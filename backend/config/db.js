const mongoose = require('mongoose');

let isConnected = false;
let inMemoryStore = {
  users: [],
  hospitals: [],
  donors: [],
  medicines: [],
  incidents: [],
  alerts: [],
  operationLogs: []
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medipulse_bd';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`[MediPulse BD] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MediPulse BD] MongoDB connection failed (${error.message}). Running in Resilient In-Memory Fallback Mode.`);
    isConnected = false;
  }
};

const getStore = () => inMemoryStore;
const getIsConnected = () => isConnected;

module.exports = { connectDB, getStore, getIsConnected };
