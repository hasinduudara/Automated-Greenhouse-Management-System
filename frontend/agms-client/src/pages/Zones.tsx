import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { Map, Edit2, Trash2, Plus, X } from 'lucide-react';

interface Zone {
    id: number;
    name: string;
    minTemp: number;
    maxTemp: number;
    deviceId: string;
}

const Zones: React.FC = () => {
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editZoneId, setEditZoneId] = useState<number | null>(null); // Edit කරනවද නැද්ද කියලා අඳුරගන්න

    // Form State
    const [newZoneName, setNewZoneName] = useState('');
    const [newMinTemp, setNewMinTemp] = useState<number | ''>('');
    const [newMaxTemp, setNewMaxTemp] = useState<number | ''>('');
    const [errorMsg, setErrorMsg] = useState('');

    const fetchZones = async () => {
        try {
            const response = await apiClient.get('/zones');
            setZones(response.data);
        } catch (error) {
            console.error("Error fetching zones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchZones();
    }, []);

    // 1. Add Modal
    const handleOpenAddModal = () => {
        setEditZoneId(null);
        setNewZoneName('');
        setNewMinTemp('');
        setNewMaxTemp('');
        setErrorMsg('');
        setShowModal(true);
    };
    // Edite Modal
    const handleOpenEditModal = (zone: Zone) => {
        setEditZoneId(zone.id);
        setNewZoneName(zone.name);
        setNewMinTemp(zone.minTemp);
        setNewMaxTemp(zone.maxTemp);
        setErrorMsg('');
        setShowModal(true);
    };

    // 3. Delete Function
    const handleDeleteZone = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this zone?")) {
            try {
                await apiClient.delete(`/zones/${id}`);
                fetchZones();
            } catch (error) {
                console.error("Error deleting zone:", error);
                alert("Failed to delete the zone. Please check the console.");
            }
        }
    };

    // 4. Save (Add) and Update (Edit)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        // Validation: Min Temp must be less than Max Temp
        if (newMinTemp !== '' && newMaxTemp !== '' && Number(newMinTemp) >= Number(newMaxTemp)) {
            setErrorMsg('Minimum temperature must be strictly less than maximum temperature.');
            return;
        }

        const payload = {
            name: newZoneName,
            minTemp: Number(newMinTemp),
            maxTemp: Number(newMaxTemp)
        };

        try {
            if (editZoneId) {
                await apiClient.put(`/zones/${editZoneId}`, payload);
            } else {
                await apiClient.post('/zones', payload);
            }

            fetchZones();
            setShowModal(false);

            // Reset form
            setNewZoneName('');
            setNewMinTemp('');
            setNewMaxTemp('');
            setEditZoneId(null);
        } catch (error) {
            console.error("Error saving zone:", error);
            setErrorMsg("Failed to save zone. Please check console.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Map className="w-6 h-6 mr-2 text-blue-600" />
                    Greenhouse Zones Management
                </h2>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5 mr-1" /> Add New Zone
                </button>
            </div>

            {/* Zones Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading zones...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 font-semibold text-gray-600">ID</th>
                            <th className="p-4 font-semibold text-gray-600">Zone Name</th>
                            <th className="p-4 font-semibold text-gray-600">Min Temp (°C)</th>
                            <th className="p-4 font-semibold text-gray-600">Max Temp (°C)</th>
                            <th className="p-4 font-semibold text-gray-600">Device ID</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {zones.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No zones found in the system.
                                </td>
                            </tr>
                        ) : (
                            zones.map((zone) => (
                                <tr key={zone.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-mono">#{zone.id}</td>
                                    <td className="p-4 font-medium text-gray-800 flex items-center">
                                        <Map className="w-4 h-4 mr-2 text-blue-500" />
                                        {zone.name}
                                    </td>
                                    <td className="p-4 text-blue-600 font-medium">{zone.minTemp}°C</td>
                                    <td className="p-4 text-red-600 font-medium">{zone.maxTemp}°C</td>
                                    <td className="p-4 text-sm text-gray-500 font-mono truncate max-w-[200px]" title={zone.deviceId}>
                                        {zone.deviceId}
                                    </td>
                                    <td className="p-4 flex justify-center space-x-3">
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleOpenEditModal(zone)}
                                            className="text-blue-500 hover:text-blue-700 transition-colors"
                                            title="Edit Zone"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteZone(zone.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            title="Delete Zone"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
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
                            <h3 className="text-xl font-bold text-gray-800">
                                {editZoneId ? 'Edit Zone' : 'Add New Zone'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Zone Name</label>
                                <input
                                    type="text"
                                    value={newZoneName}
                                    onChange={(e) => setNewZoneName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g., Tomato Zone"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Min Temp (°C)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={newMinTemp}
                                        onChange={(e) => setNewMinTemp(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g., 20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Max Temp (°C)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={newMaxTemp}
                                        onChange={(e) => setNewMaxTemp(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g., 30"
                                        required
                                    />
                                </div>
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
                                    className={`${editZoneId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm`}
                                >
                                    {editZoneId ? 'Update Zone' : 'Save Zone'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Zones;