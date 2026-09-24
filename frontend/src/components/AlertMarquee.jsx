import React, { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { operationsApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const AlertMarquee = () => {
  const [alerts, setAlerts] = useState([]);
  const { lang } = useLanguage();
  const [paused, setPaused] = useState(false);

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

  const getSeverityStyle = (severity) => {
    if (severity === 'critical' || severity === 'high') return {
      bg: 'bg-rose-600',
      bar: 'bg-rose-600',
      text: 'text-white',
      badge: 'bg-rose-800 text-rose-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-200" />,
      label: 'CRITICAL'
    };
    if (severity === 'medium') return {
      bg: 'bg-amber-500',
      bar: 'bg-amber-500',
      text: 'text-amber-950',
      badge: 'bg-amber-700 text-amber-100',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-100" />,
      label: 'ALERT'
    };
    return {
      bg: 'bg-sky-600',
      bar: 'bg-sky-600',
      text: 'text-white',
      badge: 'bg-sky-800 text-sky-200',
      icon: <Info className="w-3.5 h-3.5 text-sky-200" />,
      label: 'INFO'
    };
  };

  const primaryAlert = alerts[0];
  const style = getSeverityStyle(primaryAlert.severity);

  // Duplicate the alerts for seamless looping
  const marqueeItems = [...alerts, ...alerts];

  return (
    <div className={`${style.bg} ${style.text} overflow-hidden`}>
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Static left badge */}
        <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 ${style.badge} text-[11px] font-extrabold uppercase tracking-wider z-10`}>
          {style.icon}
          {style.label}
        </div>

        {/* Scrolling marquee content */}
        <div
          className="flex-1 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex gap-8 whitespace-nowrap"
            style={{
              animation: `marqueeScroll 35s linear infinite`,
              animationPlayState: paused ? 'paused' : 'running'
            }}
          >
            {marqueeItems.map((alert, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 py-2 px-2 text-xs font-medium flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0" />
                <strong className="font-bold">{lang === 'bn' && alert.titleBn ? alert.titleBn : alert.title}:</strong>
                <span className="opacity-90">{lang === 'bn' && alert.descriptionBn ? alert.descriptionBn : alert.description}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertMarquee;
