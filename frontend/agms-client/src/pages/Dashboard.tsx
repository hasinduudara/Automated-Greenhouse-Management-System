import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { Thermometer, Droplets, Map, Sprout } from 'lucide-react';

const Dashboard: React.FC = () => {
    // State to hold our dashboard metrics
    const [stats, setStats] = useState({
        totalZones: 0,
        totalCrops: 0,
        temperature: '--',
        humidity: '--'
    });

    useEffect(() => {
        // Function to fetch data from all microservices via API Gateway
        const fetchDashboardData = async () => {
            try {
                const zonesRes = await apiClient.get('/zones');
                const cropsRes = await apiClient.get('/crops');

                // Fetching the latest sensor data (This might fail if the sensor service isn't running)
                let temp = '--';
                let hum = '--';
                try {
                    const sensorRes = await apiClient.get('/sensors/latest');
                    temp = sensorRes.data?.value?.temperature || '--';
                    hum = sensorRes.data?.value?.humidity || '--';
                } catch {
                    console.log("Sensor data not ready yet");
                }

                setStats({
                    totalZones: zonesRes.data.length,
                    totalCrops: cropsRes.data.length,
                    temperature: temp,
                    humidity: hum
                });
            } catch (error) {
                console.error("❌ Error fetching dashboard data:", error);
            }
        };

        // Fetch immediately on component mount
        fetchDashboardData();

        // Set an interval to fetch live data every 10 seconds!
        const interval = setInterval(fetchDashboardData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Live Dashboard Overview</h2>

            {/* Grid for the 4 Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total Zones Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <Map className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Zones</p>
                        <p className="text-2xl font-semibold text-gray-800">{stats.totalZones}</p>
                    </div>
                </div>

                {/* Total Crops Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <Sprout className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Crops</p>
                        <p className="text-2xl font-semibold text-gray-800">{stats.totalCrops}</p>
                    </div>
                </div>

                {/* Current Temperature Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                        <Thermometer className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Avg Temperature</p>
                        <p className="text-2xl font-semibold text-gray-800">{stats.temperature}°C</p>
                    </div>
                </div>

                {/* Current Humidity Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
                    <div className="p-3 rounded-full bg-cyan-100 text-cyan-600 mr-4">
                        <Droplets className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Avg Humidity</p>
                        <p className="text-2xl font-semibold text-gray-800">{stats.humidity}%</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;