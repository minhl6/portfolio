import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import AxialFluxGeneratorPage from './pages/AxialFluxGeneratorPage.jsx';
import Resume from './pages/Resume.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// old slug is still bookmarked/linked in the wild — send it to the new one
// instead of 404ing, preserving any #hash (e.g. #gearbox) it was pointing at
function AxialFluxRedirect() {
    const { search, hash } = useLocation();
    return <Navigate to={`/projects/two-speed-hand-crank-generator${search}${hash}`} replace />;
}

export default function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ScrollToTop />
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects/two-speed-hand-crank-generator" element={<AxialFluxGeneratorPage />} />
                    <Route path="/projects/axial-flux-generator" element={<AxialFluxRedirect />} />
                    <Route path="/projects/:slug" element={<ProjectDetail />} />
                    <Route path="/resume" element={<Resume />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}
