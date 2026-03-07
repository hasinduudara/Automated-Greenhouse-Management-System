import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { Sprout, Plus, Edit2, Trash2, X } from 'lucide-react';

interface Crop {
    _id: string;
    cropName: string;
    batchId: string;
    status: string;
    plantedAt: string;
}

const Crops: React.FC = () => {
    const [crops, setCrops] = useState<Crop[]>([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [newCropName, setNewCropName] = useState('');
    const [newBatchId, setNewBatchId] = useState('');

    const fetchCrops = async () => {
        try {
            const response = await apiClient.get('/crops');
            setCrops(response.data);
        } catch (error) {
            console.error("❌ Error fetching crops:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCrops();
    }, []);

    const handleOpenModal = () => {
        let nextId = "BATCH-001";

        if (crops.length > 0) {
            const batchNumbers = crops.map(c => {
                const parts = c.batchId.split('-');
                return parts.length === 2 ? parseInt(parts[1]) : 0;
            });
            const maxNumber = Math.max(...batchNumbers);
            nextId = `BATCH-${String(maxNumber + 1).padStart(3, '0')}`;
        }

        setNewBatchId(nextId);
        setNewCropName('');
        setShowModal(true);
    };

    const handleAddCrop = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/crops', {
                cropName: newCropName,
                batchId: newBatchId
            });
            fetchCrops();
            setShowModal(false);
        } catch (error) {
            console.error("❌ Error adding crop:", error);
            alert("Failed to add crop. Please check console.");
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await apiClient.put(`/crops/${id}/status`, { status: newStatus });
            fetchCrops();
        } catch (error) {
            console.error("❌ Error updating status:", error);
            alert("Failed to update crop status.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Crops Inventory</h2>
                <button
                    onClick={handleOpenModal}
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5 mr-1" /> Add New Crop
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading crops...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 font-semibold text-gray-600">Crop Name</th>
                            <th className="p-4 font-semibold text-gray-600">Batch ID</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Planted Date</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {crops.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">No crops found in the inventory.</td>
                            </tr>
                        ) : (
                            crops.map((crop) => (
                                <tr key={crop._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-800 flex items-center">
                                        <Sprout className="w-4 h-4 mr-2 text-green-600" />
                                        {crop.cropName}
                                    </td>
                                    <td className="p-4 text-gray-700">{crop.batchId}</td>
                                    <td className="p-4">
                                        <select
                                            value={crop.status}
                                            onChange={(e) => handleStatusChange(crop._id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer outline-none border-2
                          ${crop.status === 'SEEDLING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                crop.status === 'VEGETATIVE' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                    'bg-green-100 text-green-800 border-green-200'}`}
                                        >
                                            <option value="SEEDLING">SEEDLING</option>
                                            <option value="VEGETATIVE">VEGETATIVE</option>
                                            <option value="HARVESTED">HARVESTED</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-gray-700">{new Date(crop.plantedAt).toLocaleDateString()}</td>
                                    <td className="p-4 flex justify-center space-x-3">
                                        <button className="text-blue-500 hover:text-blue-700"><Edit2 className="w-5 h-5" /></button>
                                        <button className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-800">Add New Crop</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCrop}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Crop Name</label>
                                <input
                                    type="text"
                                    value={newCropName}
                                    onChange={(e) => setNewCropName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                    placeholder="e.g., Tomatoes"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Batch ID (Auto-Generated)</label>
                                <input
                                    type="text"
                                    value={newBatchId}
                                    readOnly
                                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm"
                                >
                                    Save Crop
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Crops;