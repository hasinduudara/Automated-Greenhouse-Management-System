import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { Activity, Clock, Thermometer, Zap, CheckCircle2 } from 'lucide-react';

// Interface matching the actual Backend response
interface AutomationLog {
    timestamp: string;
    temperature: number;
    action: string;
}

const Automation: React.FC = () => {
    const [logs, setLogs] = useState<AutomationLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            // Updated the endpoint to match backend route
            const response = await apiClient.get('/automation/logs');

            // Sort newest logs to the top
            const sortedLogs = response.data.sort((a: AutomationLog, b: AutomationLog) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setLogs(sortedLogs);
        } catch (error) {
            console.error("Error fetching automation logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-blue-600" />
                    System Automation Logs
                </h2>
                <div className="flex items-center text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
                    Live Monitoring
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <Activity className="w-8 h-8 animate-pulse text-blue-400 mb-2" />
                        Loading system logs...
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 font-semibold text-gray-600">Time</th>
                            <th className="p-4 font-semibold text-gray-600">Recorded Temp</th>
                            <th className="p-4 font-semibold text-gray-600">System Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-gray-500">
                                    No automation events recorded yet.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log, index) => (
                                <tr key={index} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                                    <td className="p-4 text-gray-600 flex items-center whitespace-nowrap">
                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="p-4">
                      <span className="flex items-center font-medium text-gray-700">
                        <Thermometer className="w-4 h-4 mr-1 text-red-400" />
                          {log.temperature}°C
                      </span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">
                                        {log.action === 'NORMAL - NO ACTION NEEDED' ? (
                                            <span className="flex items-center text-green-600">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> {log.action}
                        </span>
                                        ) : (
                                            <span className="flex items-center text-amber-600">
                          <Zap className="w-4 h-4 mr-1" /> {log.action}
                        </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Automation;