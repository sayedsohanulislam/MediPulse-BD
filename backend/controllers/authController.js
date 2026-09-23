const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getStore, getIsConnected } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// Seed demo users
const demoUsers = [
  { id: 'usr-cit-1', name: 'Rahim Ahmed (Citizen)', email: 'citizen@medipulse.bd', role: 'citizen', phone: '01711-223344', bloodGroup: 'B+', district: 'Dhaka' },
  { id: 'usr-don-1', name: 'Tanvir Hasan (Donor Hero)', email: 'donor@medipulse.bd', role: 'donor', phone: '01819-556677', bloodGroup: 'O+', district: 'Dhaka' },
  { id: 'usr-hosp-1', name: 'Dr. Shahabuddin (DMCH Authority)', email: 'hospital@medipulse.bd', role: 'hospital', phone: '01912-889900', district: 'Dhaka', organization: 'Dhaka Medical College Hospital' },
  { id: 'usr-adm-1', name: 'DGHS Director (Super Admin)', email: 'admin@medipulse.bd', role: 'admin', phone: '01678-001122', district: 'Dhaka' }
];

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id, email: user.email, role: user.role, name: user.name, district: user.district },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, bloodGroup, district, organization } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const store = getStore();

    if (getIsConnected()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'citizen',
        phone: phone || '',
        bloodGroup: bloodGroup || '',
        district: district || 'Dhaka',
        organization: organization || ''
      });
      const token = generateToken(newUser);
      return res.status(201).json({ success: true, token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, district: newUser.district } });
    } else {
      // In-memory mode
      const existing = store.users.find(u => u.email === email.toLowerCase());
      if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

      const newUser = {
        id: 'usr-' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'citizen',
        phone: phone || '',
        bloodGroup: bloodGroup || '',
        district: district || 'Dhaka',
        organization: organization || ''
      };
      store.users.push(newUser);
      const token = generateToken(newUser);
      return res.status(201).json({ success: true, token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, district: newUser.district } });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Check demo accounts first
    const demo = demoUsers.find(d => d.email.toLowerCase() === email.toLowerCase());
    if (demo && (password === 'password123' || password === 'demo123')) {
      const token = generateToken(demo);
      return res.json({ success: true, token, user: demo });
    }

    if (getIsConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const token = generateToken(user);
      return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, district: user.district, organization: user.organization } });
    } else {
      const store = getStore();
      const user = store.users.find(u => u.email === email.toLowerCase());
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const token = generateToken(user);
      return res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role, district: user.district, organization: user.organization } });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.demoLogin = async (req, res) => {
  const { role } = req.params;
  const matched = demoUsers.find(d => d.role === role);
  if (!matched) {
    return res.status(404).json({ success: false, message: `Demo account for role '${role}' not found` });
  }
  const token = generateToken(matched);
  return res.json({ success: true, token, user: matched });
};

exports.getMe = (req, res) => {
  return res.json({ success: true, user: req.user });
};
