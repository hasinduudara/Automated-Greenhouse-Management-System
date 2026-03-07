import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Sprout, Activity, Menu } from 'lucide-react';

const MainLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-green-800 text-white flex flex-col">
                <div className="h-16 flex items-center justify-center border-b border-green-700">
                    <Sprout className="w-8 h-8 mr-2" />
                    <span className="text-xl font-bold">AGMS Admin</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-2">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-green-700' : 'hover:bg-green-700'}`}
                            >
                                <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/zones"
                                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-green-700' : 'hover:bg-green-700'}`}
                            >
                                <Map className="w-5 h-5 mr-3" /> Zones
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/crops"
                                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-green-700' : 'hover:bg-green-700'}`}
                            >
                                <Sprout className="w-5 h-5 mr-3" /> Crops Inventory
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/automation"
                                className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-green-700' : 'hover:bg-green-700'}`}
                            >
                                <Activity className="w-5 h-5 mr-3" /> Automation Logs
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Topbar */}
                <header className="h-16 bg-white shadow-sm flex items-center px-6">
                    <button className="text-gray-500 md:hidden mr-4">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">Automated Greenhouse Management</h1>
                </header>

                {/* Dynamic Page Content (Outlet) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet /> {/* The current page will be rendered here */}
                </main>
            </div>

        </div>
    );
};

export default MainLayout;