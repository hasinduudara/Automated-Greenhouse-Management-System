import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Crops from './pages/Crops';

// Dummy components for other pages (We will create these properly later)
const Zones = () => <div className="p-4"><h2>Zones Management Page (Coming Soon)</h2></div>;
const Automation = () => <div className="p-4"><h2>Automation Logs Page (Coming Soon)</h2></div>;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* MainLayout acts as a wrapper for all these routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="zones" element={<Zones />} />
                    <Route path="crops" element={<Crops />} />
                    <Route path="automation" element={<Automation />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;