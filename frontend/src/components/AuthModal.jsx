import React, { useState } from 'react';
import { X, User, Heart, Building2, Shield, Lock, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, demoLogin } = useAuth();
  const { t, lang } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('citizen');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [district, setDistrict] = useState('Dhaka');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register({ name, email, password, role, phone, bloodGroup, district });
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoRole) => {
    setError('');
    setLoading(true);
    try {
      await demoLogin(demoRole);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-5 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">
              {isRegister ? (lang === 'bn' ? 'নতুন অ্যাকাউন্ট নিবন্ধন' : 'Create Account') : (lang === 'bn' ? 'সাইন ইন / প্রবেশ করুন' : 'Sign In to MediPulse')}
            </h2>
            <p className="text-sky-100 text-xs mt-0.5">
              Access emergency blood requests & authority controls
            </p>
          </div>
          <button onClick={onClose} className="text-sky-200 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast-Track Section */}
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            ⚡ Quick Demo Logins (One-Click)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemo('citizen')}
              disabled={loading}
              className="bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition text-left"
            >
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>Citizen Demo</span>
            </button>
            <button
              onClick={() => handleDemo('donor')}
              disabled={loading}
              className="bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition text-left"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
              <span>Donor Hero</span>
            </button>
            <button
              onClick={() => handleDemo('hospital')}
              disabled={loading}
              className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition text-left"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hospital Authority</span>
            </button>
            <button
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition text-left"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>DGHS Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-lg">
              {error}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Tanvir Hossain"
                className="w-full text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. citizen@medipulse.bd"
              className="w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs"
            />
          </div>

          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    className="w-full text-xs"
                  >
                    <option value="citizen">Citizen</option>
                    <option value="donor">Blood Donor</option>
                    <option value="hospital">Hospital Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Blood Group</label>
                  <select 
                    value={bloodGroup} 
                    onChange={(e) => setBloodGroup(e.target.value)} 
                    className="w-full text-xs"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">District</label>
                  <select 
                    value={district} 
                    onChange={(e) => setDistrict(e.target.value)} 
                    className="w-full text-xs"
                  >
                    {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded-lg text-xs shadow-sm transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : (isRegister ? 'Register & Continue' : 'Sign In')}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-xs text-sky-600 hover:underline"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register free"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
