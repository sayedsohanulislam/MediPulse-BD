import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { TelemetryProvider } from './context/TelemetryContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AlertMarquee from './components/AlertMarquee';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import LiveHealthGrid from './pages/LiveHealthGrid';
import HospitalFinder from './pages/HospitalFinder';
import BloodHub from './pages/BloodHub';
import MedicineGuide from './pages/MedicineGuide';
import SmartServices from './pages/SmartServices';
import AuthorityPortal from './pages/AuthorityPortal';

function AppContent() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
      <AlertMarquee />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home onOpenSosModal={() => window.location.href = '/blood'} onOpenAuth={() => setIsAuthOpen(true)} />} />
          <Route path="/live-grid" element={<LiveHealthGrid />} />
          <Route path="/hospitals" element={<HospitalFinder />} />
          <Route path="/blood" element={<BloodHub />} />
          <Route path="/medicines" element={<MedicineGuide />} />
          <Route path="/services" element={<SmartServices />} />
          <Route path="/authority" element={<AuthorityPortal onOpenAuth={() => setIsAuthOpen(true)} />} />
        </Routes>
      </main>

      <Footer />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <TelemetryProvider>
            <AppContent />
          </TelemetryProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
