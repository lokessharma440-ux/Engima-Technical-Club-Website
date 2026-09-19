import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(credentials.username, credentials.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md p-8 border-4 border-black bg-primary neo-shadow"
      >
        <h2 className="text-4xl font-black mb-8 text-center uppercase tracking-tight text-charcoal border-b-4 border-black pb-4">
          Admin Portal
        </h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-400 border-2 border-black font-bold flex items-center gap-2 neo-shadow-sm">
            <span className="text-xl">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-black uppercase text-sm mb-2 text-charcoal">Username</label>
            <input 
              type="text" 
              name="username" 
              value={credentials.username}
              onChange={handleChange}
              required
              className="w-full p-4 border-2 border-black focus:outline-none focus:ring-4 focus:ring-black/20 text-lg font-medium transition-all"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block font-black uppercase text-sm mb-2 text-charcoal">Password</label>
            <input 
              type="password" 
              name="password" 
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full p-4 border-2 border-black focus:outline-none focus:ring-4 focus:ring-black/20 text-lg font-medium transition-all"
              placeholder="Enter password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-black text-white font-black uppercase tracking-widest text-lg hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
