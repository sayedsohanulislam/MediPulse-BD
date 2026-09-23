const axios = require('axios');

class ExternalApiService {
  constructor() {
    this.dhakaCoords = { lat: 23.8103, lng: 90.4125 };
    this.chittagongCoords = { lat: 22.3569, lng: 91.7832 };
    this.sylhetCoords = { lat: 24.8949, lng: 91.8687 };
  }

  // 1. Fetch Real-time Weather & Climate Data (Open-Meteo)
  async fetchLiveWeather(lat = this.dhakaCoords.lat, lng = this.dhakaCoords.lng) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation_probability&timezone=Asia%2FDhaka`;
      const res = await axios.get(url, { timeout: 6000 });
      const current = res.data.current;

      // Compute Vector-Borne Dengue Risk Index (0-100)
      // Aedes aegypti thrives in 25-32C, high humidity (>70%), and standing water
      let dengueScore = 40;
      if (current.temperature_2m >= 24 && current.temperature_2m <= 33) dengueScore += 25;
      if (current.relative_humidity_2m > 65) dengueScore += 20;
      if (current.precipitation > 0 || current.rain > 0) dengueScore += 15;
      dengueScore = Math.min(100, Math.max(10, dengueScore));

      let dengueLevel = 'Moderate';
      if (dengueScore > 75) dengueLevel = 'Critical High';
      else if (dengueScore > 55) dengueLevel = 'Elevated';
      else dengueLevel = 'Low';

      // Heatwave index check
      const isHeatwave = current.apparent_temperature > 37;

      return {
        success: true,
        source: 'Open-Meteo Real-Time Climate Telemetry',
        location: { lat, lng, city: lat === this.dhakaCoords.lat ? 'Dhaka' : 'Regional Hub' },
        current: {
          temperature: current.temperature_2m,
          feelsLike: current.apparent_temperature,
          humidity: current.relative_humidity_2m,
          precipitationMm: current.precipitation,
          windSpeedKmh: current.wind_speed_10m,
          isHeatwave
        },
        dengueRisk: {
          score: dengueScore,
          level: dengueLevel,
          advisory: dengueScore > 75 
            ? 'Severe mosquito proliferation alert. Stagnant rainwater detected. Emergency hospitals on high alert for platelet transfusions.' 
            : 'Normal vigilance. Eliminate flower-pot and AC drip water accumulation.'
        },
        timestamp: new Date()
      };
    } catch (err) {
      console.warn('[External API] Weather fetch failed, providing robust telemetry fallback:', err.message);
      return {
        success: true,
        fallback: true,
        source: 'MediPulse Simulated Climate Telemetry',
        location: { lat, lng, city: 'Dhaka' },
        current: {
          temperature: 31.5,
          feelsLike: 36.2,
          humidity: 78,
          precipitationMm: 4.2,
          windSpeedKmh: 12,
          isHeatwave: false
        },
        dengueRisk: {
          score: 82,
          level: 'Critical High',
          advisory: 'Heavy seasonal humidity in Dhaka. High vector breeding conditions.'
        },
        timestamp: new Date()
      };
    }
  }

  // 2. Fetch Real-time Air Quality Index (Open-Meteo AQI & OpenAQ)
  async fetchLiveAirQuality(lat = this.dhakaCoords.lat, lng = this.dhakaCoords.lng) {
    try {
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index,us_aqi&timezone=Asia%2FDhaka`;
      const res = await axios.get(url, { timeout: 6000 });
      const current = res.data.current;

      const usAqi = current.us_aqi || Math.round((current.pm2_5 || 75) * 2.1);
      let aqiStatus = 'Moderate';
      let healthRisk = 'Acceptable air quality for general population.';
      let maskRecommended = false;

      if (usAqi > 200) {
        aqiStatus = 'Very Unhealthy / Hazardous';
        healthRisk = 'Severe risk for children, elderly, and respiratory patients. High asthma attack probability.';
        maskRecommended = true;
      } else if (usAqi > 150) {
        aqiStatus = 'Unhealthy';
        healthRisk = 'General public may experience eye irritation, coughing, and shortness of breath.';
        maskRecommended = true;
      } else if (usAqi > 100) {
        aqiStatus = 'Unhealthy for Sensitive Groups';
        healthRisk = 'Sensitive individuals should limit prolonged outdoor exertion.';
        maskRecommended = false;
      }

      return {
        success: true,
        source: 'Open-Meteo Atmospheric & OpenAQ Feed',
        usAqi,
        aqiStatus,
        healthRisk,
        maskRecommended,
        pollutants: {
          pm2_5: current.pm2_5,
          pm10: current.pm10,
          no2: current.nitrogen_dioxide,
          so2: current.sulphur_dioxide,
          co: current.carbon_monoxide,
          uvIndex: current.uv_index
        },
        timestamp: new Date()
      };
    } catch (err) {
      console.warn('[External API] AQI fetch fallback triggered:', err.message);
      return {
        success: true,
        fallback: true,
        source: 'MediPulse Environmental Monitor Fallback',
        usAqi: 188,
        aqiStatus: 'Unhealthy',
        healthRisk: 'Elevated PM2.5 in Dhaka basin. Vulnerable individuals advised to wear N95 masks.',
        maskRecommended: true,
        pollutants: { pm2_5: 118, pm10: 172, no2: 32, so2: 18, co: 510, uvIndex: 6.2 },
        timestamp: new Date()
      };
    }
  }

  // 3. Dynamic Emergency Routing between coordinates (OSRM)
  async calculateEmergencyRoute(originLat, originLng, destLat, destLng) {
    try {
      const url = `http://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=false`;
      const res = await axios.get(url, { timeout: 6000 });
      if (res.data.routes && res.data.routes.length > 0) {
        const route = res.data.routes[0];
        const distanceKm = +(route.distance / 1000).toFixed(2);
        const durationMinutes = +(route.duration / 60).toFixed(1);
        
        // Compute standard ambulance transit delay & fare
        const baseFare = 500; // BDT minimum flag drop
        const perKmFare = 45; // BDT per km
        const estimatedAmbulanceFare = Math.round(baseFare + (distanceKm * perKmFare));

        return {
          success: true,
          distanceKm,
          durationMinutes,
          estimatedAmbulanceFare,
          trafficChokeRisk: durationMinutes > (distanceKm * 3.5) ? 'Heavy Congestion' : 'Clear Route'
        };
      }
      throw new Error('No OSRM route found');
    } catch (err) {
      // Fallback haversine calculation
      const R = 6371; // km
      const dLat = (destLat - originLat) * Math.PI / 180;
      const dLon = (destLng - originLng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(originLat * Math.PI / 180) * Math.cos(destLat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distanceKm = +(R * c * 1.3).toFixed(2); // approximate road winding factor
      const durationMinutes = +(distanceKm * 2.8).toFixed(1);
      const estimatedAmbulanceFare = Math.round(500 + (distanceKm * 45));

      return {
        success: true,
        fallback: true,
        distanceKm,
        durationMinutes,
        estimatedAmbulanceFare,
        trafficChokeRisk: 'Moderate Urban Flow'
      };
    }
  }

  // 4. Live Exchange Rates for Medical Tourism & Imported Drugs
  async fetchLiveExchangeRates() {
    try {
      const res = await axios.get('https://open.er-api.com/v6/latest/USD', { timeout: 5000 });
      const bdt = res.data.rates.BDT || 117.5;
      const inr = res.data.rates.INR || 83.5;
      const eur = res.data.rates.EUR || 0.92;

      return {
        success: true,
        base: 'USD',
        bdtRate: +bdt.toFixed(2),
        inrRate: +(bdt / inr).toFixed(2), // 1 INR in BDT
        eurRate: +(bdt / eur).toFixed(2),
        timestamp: new Date()
      };
    } catch (err) {
      return {
        success: true,
        fallback: true,
        base: 'USD',
        bdtRate: 118.25,
        inrRate: 1.42,
        eurRate: 128.50,
        timestamp: new Date()
      };
    }
  }
}

module.exports = new ExternalApiService();
