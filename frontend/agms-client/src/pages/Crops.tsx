import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { Sprout, Plus, Edit2, Trash2, X } from 'lucide-react';

// MongoDB Crop Document Interface
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

    // Add New Crop
    const [showModal, setShowModal] = useState(false);
    const [newCropName, setNewCropName] = useState('');
    const [newBatchId, setNewBatchId] = useState('');

    // Get Crops Inventory
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

    // Save Crop Function
    const handleAddCrop = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/crops', {
                cropName: newCropName,
                batchId: newBatchId
            });
            fetchCrops();
            setShowModal(false);
            setNewCropName('');
            setNewBatchId('');
        } catch (error) {
            console.error("❌ Error adding crop:", error);
            alert("Failed to add crop. Please check console.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Crops Inventory</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5 mr-1" /> Add New Crop
                </button>
            </div>

            {/* Crops Table */}
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
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${crop.status === 'SEEDLING' ? 'bg-yellow-100 text-yellow-800' :
                          crop.status === 'VEGETATIVE' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'}`}>
                        {crop.status}
                      </span>
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

            {/* Add New Crop Modal (Pop-up) */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Add New Crop</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                    placeholder="e.g., Tomatoes"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Batch ID</label>
                                <input
                                    type="text"
                                    value={newBatchId}
                                    onChange={(e) => setNewBatchId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                    placeholder="e.g., BATCH-002"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="mr-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
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