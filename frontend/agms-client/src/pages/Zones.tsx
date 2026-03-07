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

    // Function to handle adding a new zone
    const handleAddZone = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        // Validation: Min Temp must be less than Max Temp
        if (newMinTemp !== '' && newMaxTemp !== '' && Number(newMinTemp) >= Number(newMaxTemp)) {
            setErrorMsg('Minimum temperature must be less than maximum temperature.');
            return;
        }

        try {
            // POST request to API Gateway which routes to Zone Service [cite: 125, 127]
            await apiClient.post('/zones', {
                name: newZoneName,
                minTemp: Number(newMinTemp),
                maxTemp: Number(newMaxTemp)
            });

            // Refresh list and close modal
            fetchZones();
            setShowModal(false);

            // Reset form
            setNewZoneName('');
            setNewMinTemp('');
            setNewMaxTemp('');
        } catch (error) {
            console.error("Error adding zone:", error);
            setErrorMsg("Failed to add zone. Please check console.");
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
                    onClick={() => setShowModal(true)}
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
                                        <button className="text-blue-500 hover:text-blue-700 transition-colors" title="Edit Zone">
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 transition-colors" title="Delete Zone">
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

            {/* Add New Zone Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-800">Add New Zone</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleAddZone}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Zone Name</label>
                                <input
                                    type="text"
                                    value={newZoneName}
                                    onChange={(e) => setNewZoneName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
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
                                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm"
                                >
                                    Save Zone
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