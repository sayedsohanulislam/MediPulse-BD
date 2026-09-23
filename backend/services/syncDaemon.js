const cron = require('node-cron');
const externalApiService = require('./externalApiService');

let cachedTelemetry = {
  weather: null,
  airQuality: null,
  exchangeRates: null,
  lastSyncTime: null,
  syncCount: 0
};

const executeSync = async () => {
  console.log('[SyncDaemon] Initiating automated real-time external API fetch...');
  try {
    const [weather, aqi, fx] = await Promise.all([
      externalApiService.fetchLiveWeather(),
      externalApiService.fetchLiveAirQuality(),
      externalApiService.fetchLiveExchangeRates()
    ]);

    cachedTelemetry = {
      weather,
      airQuality: aqi,
      exchangeRates: fx,
      lastSyncTime: new Date(),
      syncCount: cachedTelemetry.syncCount + 1
    };

    console.log(`[SyncDaemon] Sync #${cachedTelemetry.syncCount} successful. Live AQI: ${aqi.usAqi}, Dengue Score: ${weather.dengueRisk.score}`);
  } catch (err) {
    console.error('[SyncDaemon] Sync error:', err.message);
  }
};

const initSyncDaemon = () => {
  // 1. Initial sync immediately on server boot
  executeSync();

  // 2. Schedule recurring sync every 15 minutes
  try {
    cron.schedule('*/15 * * * *', () => {
      executeSync();
    });
    console.log('[SyncDaemon] Scheduled cron job: Runs automatically every 15 minutes.');
  } catch (err) {
    console.warn('[SyncDaemon] Cron scheduling fallback to setInterval.');
    setInterval(executeSync, 15 * 60 * 1000);
  }
};

const getLatestTelemetry = () => cachedTelemetry;

module.exports = {
  initSyncDaemon,
  executeSync,
  getLatestTelemetry
};
