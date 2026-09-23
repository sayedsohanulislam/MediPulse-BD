import React from 'react';
import { PhoneCall, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              {t('brand')}
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('tagline')}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Service Initiative • Bangladesh</span>
            </div>
          </div>

          <div>
            <div className="text-white font-semibold mb-2">National Hotlines</div>
            <ul className="space-y-1.5">
              <li><strong className="text-rose-400">999</strong> — National Police, Fire, Ambulance</li>
              <li><strong className="text-emerald-400">16263</strong> — Shastho Batayon Doctor Helpline</li>
              <li><strong className="text-sky-400">333</strong> — Citizen & Disaster Redressal</li>
              <li><strong className="text-amber-400">106</strong> — Anti-Corruption & Consumer Rights</li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold mb-2">Live Automated Data Feeds</div>
            <ul className="space-y-1.5 text-slate-400">
              <li>• OpenAQ / Open-Meteo Atmospheric Sensors</li>
              <li>• OSRM Dynamic Chokepoint Ambulance Routing</li>
              <li>• DGDA Official Medicine Ceiling Gazette</li>
              <li>• DGHS Communicable Disease Vector Tracking</li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold mb-2">Platform Portals</div>
            <ul className="space-y-1.5">
              <li>• Emergency Blood Donor Registry (64 Districts)</li>
              <li>• Hospital ICU & Bed Capacity Synchronization</li>
              <li>• Counterfeit Medicine Whistleblower Desk</li>
              <li>• Mass-Casualty Disaster Triage Protocol</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <div>
            © 2026 MediPulse BD. Built for the healthcare resilience of Bangladesh.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in Dhaka
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
