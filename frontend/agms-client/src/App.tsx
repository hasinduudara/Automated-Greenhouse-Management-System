import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Crops from './pages/Crops';
import Automation from './pages/Automation';
import Zones from './pages/Zones';

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