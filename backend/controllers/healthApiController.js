const { getLatestTelemetry, executeSync } = require('../services/syncDaemon');
const externalApiService = require('../services/externalApiService');

exports.getLiveTelemetry = async (req, res) => {
  try {
    let telemetry = getLatestTelemetry();
    if (!telemetry.weather || !telemetry.airQuality) {
      await executeSync();
      telemetry = getLatestTelemetry();
    }
    return res.json({ success: true, data: telemetry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.forceRefreshSync = async (req, res) => {
  try {
    await executeSync();
    const updated = getLatestTelemetry();
    return res.json({ 
      success: true, 
      message: 'Real-time telemetry successfully re-synchronized with external APIs',
      data: updated 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.calculateAmbulanceRoute = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.body;
    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({ success: false, message: 'Origin and destination coordinates required' });
    }

    const routeData = await externalApiService.calculateEmergencyRoute(
      Number(originLat), 
      Number(originLng), 
      Number(destLat), 
      Number(destLng)
    );

    return res.json({ success: true, data: routeData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRegionalRiskSummary = async (req, res) => {
  try {
    // Generate multi-division snapshot
    const regions = [
      { name: "Dhaka", aqi: 185, aqiStatus: "Unhealthy", dengueRisk: "Critical High", dengueScore: 84, heatIndex: "Elevated" },
      { name: "Chittagong", aqi: 132, aqiStatus: "Moderate/Unhealthy for Sensitive", dengueRisk: "Elevated", dengueScore: 68, heatIndex: "Normal" },
      { name: "Sylhet", aqi: 65, aqiStatus: "Good", dengueRisk: "Moderate", dengueScore: 48, heatIndex: "Normal (Rainfall)" },
      { name: "Rajshahi", aqi: 155, aqiStatus: "Unhealthy", dengueRisk: "Low", dengueScore: 35, heatIndex: "Heatwave Alert" },
      { name: "Khulna", aqi: 110, aqiStatus: "Moderate", dengueRisk: "Elevated", dengueScore: 62, heatIndex: "Elevated" },
      { name: "Barisal", aqi: 75, aqiStatus: "Moderate", dengueRisk: "Moderate", dengueScore: 52, heatIndex: "Normal" }
    ];

    return res.json({ success: true, data: regions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
