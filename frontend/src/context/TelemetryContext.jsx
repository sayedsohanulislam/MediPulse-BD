import React, { createContext, useContext, useState, useEffect } from 'react';
import { healthApi } from '../services/api';

const TelemetryContext = createContext();

export const TelemetryProvider = ({ children }) => {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTelemetry = async () => {
    try {
      const res = await healthApi.getLiveTelemetry();
      if (res.data.success) {
        setTelemetry(res.data.data);
      }
    } catch (err) {
      console.warn('Telemetry fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const forceRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await healthApi.forceRefresh();
      if (res.data.success) {
        setTelemetry(res.data.data);
      }
    } catch (err) {
      console.warn('Force refresh error:', err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    // Auto polling every 30 seconds
    const interval = setInterval(fetchTelemetry, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TelemetryContext.Provider value={{ telemetry, loading, isRefreshing, forceRefresh, fetchTelemetry }}>
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => useContext(TelemetryContext);
