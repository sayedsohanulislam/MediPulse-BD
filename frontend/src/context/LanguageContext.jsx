import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    brand: "MediPulse BD",
    tagline: "Real-Time Emergency Health & Epidemic Surveillance Network",
    nav_home: "Overview",
    nav_live_grid: "Live Health Map",
    nav_hospitals: "ICU & Hospitals",
    nav_blood: "Blood SOS Hub",
    nav_medicines: "Medicine Guide",
    nav_smart_services: "Citizen Services",
    nav_authority: "Authority Portal",
    btn_login: "Sign In",
    btn_demo: "Demo Access",
    btn_logout: "Logout",
    urgent_sos: "Urgent Blood SOS",
    emergency_call: "Emergency Speed-Dial",
    live_aqi: "Live Air Quality (AQI)",
    live_dengue: "Dengue Risk Score",
    live_temp: "Temperature",
    live_humidity: "Humidity",
    live_sync_status: "Automated External API Sync Active",
    refresh_sync: "Force Sync Now",
    hospital_search_ph: "Search hospitals by name, area, or facility...",
    blood_search_ph: "Filter by blood group and district...",
    medicine_search_ph: "Search brand name or generic...",
    all_districts: "All Districts",
    all_blood_groups: "All Groups",
    general_beds: "General Beds",
    icu_beds: "ICU Beds",
    available: "Available",
    total: "Total",
    navigate: "Ambulance Route",
    opd_queue: "OPD Waiting",
    surge_mode_active: "Mass Casualty Surge Active",
    report_fake_drug: "Report Counterfeit / Price Gouging",
    footer_text: "MediPulse BD — Empowering 170M+ Citizens with Real-Time Emergency Healthcare Telemetry."
  },
  bn: {
    brand: "স্বাস্থ্যপালস বিডি",
    tagline: "রিয়েল-টাইম জরুরি স্বাস্থ্য ও মহামারী নজরদারি নেটওয়ার্ক",
    nav_home: "হোম",
    nav_live_grid: "লাইভ হেলথ ম্যাপ",
    nav_hospitals: "আইসিইউ ও হাসপাতাল",
    nav_blood: "জরুরি রক্ত কেন্দ্র",
    nav_medicines: "ওষুধ নির্দেশিকা",
    nav_smart_services: "নাগরিক সেবা",
    nav_authority: "কর্তৃপক্ষ পোর্টাল",
    btn_login: "লগইন",
    btn_demo: "ডেমো অ্যাক্সেস",
    btn_logout: "লগআউট",
    urgent_sos: "জরুরি রক্ত এসওএস",
    emergency_call: "জরুরি হটলাইন ডায়াল",
    live_aqi: "লাইভ বায়ুর মান (AQI)",
    live_dengue: "ডেঙ্গু ঝুঁকি স্কোর",
    live_temp: "তাপমাত্রা",
    live_humidity: "আর্দ্রতা",
    live_sync_status: "স্বয়ংক্রিয় এক্সটার্নাল এপিআই সিঙ্ক সচল",
    refresh_sync: "এখনই সিঙ্ক করুন",
    hospital_search_ph: "নাম, এলাকা বা সুবিধা দিয়ে হাসপাতাল খুঁজুন...",
    blood_search_ph: "রক্তের গ্রুপ ও জেলা নির্বাচন করুন...",
    medicine_search_ph: "ব্র্যান্ড বা জেনেরিক ওষুধের নাম লিখুন...",
    all_districts: "সকল জেলা",
    all_blood_groups: "সকল গ্রুপ",
    general_beds: "সাধারণ শয্যা",
    icu_beds: "আইসিইউ শয্যা",
    available: "ফাঁকা আছে",
    total: "মোট",
    navigate: "অ্যাম্বুলেন্স রুট",
    opd_queue: "বহির্বিভাগে অপেক্ষমাণ",
    surge_mode_active: "জরুরি গণ-দুর্ঘটনা মোড চালু",
    report_fake_drug: "ভেজাল ওষুধ / অতিরিক্ত দামের অভিযোগ করুন",
    footer_text: "স্বাস্থ্যপালস বিডি — ১৭ কোটি নাগরিকের জরুরি স্বাস্থ্য সেবায় রিয়েল-টাইম তথ্য নেটওয়ার্ক।"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'bn' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
