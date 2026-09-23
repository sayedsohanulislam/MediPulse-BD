const axios = require('axios');
const app = require('./server');

const runTests = async () => {
  console.log('[Test] Waiting for server and sync daemon to spin up...');
  await new Promise(r => setTimeout(r, 4000));

  try {
    const res = await axios.get('http://localhost:5000/api/health-sync/live-telemetry');
    console.log('[Test] Telemetry API Status:', res.status);
    console.log('[Test] Live Telemetry Data:', JSON.stringify(res.data.data.weather?.current || {}, null, 2));
    console.log('[Test] Live Dengue Risk:', JSON.stringify(res.data.data.weather?.dengueRisk || {}, null, 2));
    console.log('[Test] Live US AQI:', res.data.data.airQuality?.usAqi);

    const hospRes = await axios.get('http://localhost:5000/api/hospitals');
    console.log('[Test] Hospitals Count:', hospRes.data.count);

    const bloodRes = await axios.get('http://localhost:5000/api/blood/donors');
    console.log('[Test] Donors Count:', bloodRes.data.count);

    console.log('[Test] ALL BACKEND TESTS PASSED!');
    process.exit(0);
  } catch (err) {
    console.error('[Test] Test failed:', err.message);
    process.exit(1);
  }
};

runTests();
