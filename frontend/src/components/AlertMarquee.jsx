import React, { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, Bell } from 'lucide-react';
import { operationsApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const AlertMarquee = () => {
  const [alerts, setAlerts] = useState([]);
  const { lang } = useLanguage();

  useEffect(() => {
    operationsApi.getAlerts()
      .then(res => {
        if (res.data.success && res.data.data.length > 0) {
          setAlerts(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  if (alerts.length === 0) return null;
  const current = alerts[0];

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-medium flex items-center justify-between shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-hidden w-full">
        <span className="flex items-center gap-1 bg-slate-900 text-amber-300 font-bold px-2 py-0.5 rounded text-[11px] shrink-0 uppercase tracking-wide">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          ALERT
        </span>
        <div className="truncate">
          <strong>{lang === 'bn' && current.titleBn ? current.titleBn : current.title}:</strong> {lang === 'bn' && current.descriptionBn ? current.descriptionBn : current.description}
        </div>
      </div>
    </div>
  );
};

export default AlertMarquee;
