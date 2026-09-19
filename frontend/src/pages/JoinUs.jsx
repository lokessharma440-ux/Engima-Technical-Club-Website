import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Code, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import SectionHeader from '../components/SectionHeader';

const JoinUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    rollNumber: '',
    interests: '',
    skills: '',
    motivation: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/settings/join-status');
        setAccepting(res.data.accepting);
      } catch (err) {
        console.error('Failed to load join status');
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/join-us', formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex justify-center items-center max-w-7xl mx-auto bg-[#FAFAFA]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="neo-card p-12 bg-primary border-4 border-black text-center neo-shadow max-w-2xl w-full">
          <CheckCircle2 size={80} strokeWidth={2.5} className="text-black mx-auto mb-8 bg-white rounded-full border-4 border-black" />
          <h2 className="text-4xl font-black mb-6 uppercase tracking-tight text-charcoal">Application Received!</h2>
          <p className="text-charcoal font-bold text-lg mb-10 leading-relaxed">Thank you for your interest in joining ENIGMA. Our core team will review your application and get back to you soon.</p>
          <Link to="/" className="inline-block px-10 py-4 bg-white text-black font-black uppercase tracking-widest border-4 border-black neo-btn">
            Return to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader 
        number="11"
        title="Join ENIGMA"
        description="Become part of the most active technical community. Learn, build, and grow together."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Why Join & Who Can Join */}
        <div className="lg:col-span-5 space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="neo-card p-8 bg-white border-4 border-black"
          >
            <div className="flex items-center mb-8 border-b-4 border-black pb-4">
              <div className="bg-primary p-3 border-2 border-black mr-4 neo-shadow-sm">
                <Rocket className="text-black" size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black uppercase text-charcoal tracking-tight">Why Join Us?</h3>
            </div>
            <ul className="space-y-6 text-gray-800 font-bold text-lg">
              <li className="flex items-start"><span className="text-primary text-2xl mr-3 leading-none">★</span> Learn modern, industry-relevant technologies</li>
              <li className="flex items-start"><span className="text-primary text-2xl mr-3 leading-none">★</span> Build real-world projects and enhance your portfolio</li>
              <li className="flex items-start"><span className="text-primary text-2xl mr-3 leading-none">★</span> Participate and win in national hackathons</li>
              <li className="flex items-start"><span className="text-primary text-2xl mr-3 leading-none">★</span> Network with alumni and industry professionals</li>
              <li className="flex items-start"><span className="text-primary text-2xl mr-3 leading-none">★</span> Develop essential leadership and soft skills</li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="neo-card p-8 bg-primary border-4 border-black"
          >
            <div className="flex items-center mb-8 border-b-4 border-black pb-4">
              <div className="bg-white p-3 border-2 border-black mr-4 neo-shadow-sm">
                <Code className="text-black" size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black uppercase text-charcoal tracking-tight">Who Can Join?</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {['Developers', 'Designers', 'AI Enthusiasts', 'Problem Solvers', 'Event Organizers', 'Tech Writers', 'Beginners'].map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-white border-2 border-black text-xs font-black uppercase tracking-widest text-charcoal neo-shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Application Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-7 neo-card p-10 bg-white border-4 border-black"
        >
          {loadingConfig ? (
            <div className="py-20 text-center font-black uppercase text-xl text-gray-500 animate-pulse">Loading Application Form...</div>
          ) : !accepting ? (
            <div className="py-20 text-center">
              <div className="inline-block p-4 rounded-full bg-red-100 border-4 border-black mb-6 neo-shadow-sm">
                <Award className="text-red-500" size={48} strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black uppercase mb-4 text-charcoal">Not Accepting Applications</h3>
              <p className="font-bold text-gray-600 text-lg">We are not accepting applications right now. Please check back later.</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black mb-10 flex items-center uppercase tracking-tight text-charcoal border-b-4 border-black pb-4">
                <Award className="text-black mr-4" size={36} strokeWidth={2.5} /> Application Form
              </h2>

              {error && (
                <div className="bg-red-500 text-white font-bold border-4 border-black px-6 py-4 mb-8 neo-shadow-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Full Name *</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder-gray-400" placeholder="JOHN DOE" />
              </div>
              <div>
                <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Email Address *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder-gray-400" placeholder="JOHN@EXAMPLE.COM" />
              </div>
              <div>
                <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Phone Number *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder-gray-400" placeholder="1234567890" />
              </div>
              <div>
                <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Roll Number / ID *</label>
                <input type="text" name="rollNumber" required value={formData.rollNumber} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder-gray-400" placeholder="200XXXXX" />
              </div>
              <div>
                <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Department *</label>
                <input type="text" name="department" required value={formData.department} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder-gray-400" placeholder="CSE" />
              </div>
              <div>
                <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Year of Study *</label>
                <select name="year" required value={formData.year} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase appearance-none cursor-pointer">
                  <option value="">SELECT YEAR</option>
                  <option value="1">1ST YEAR</option>
                  <option value="2">2ND YEAR</option>
                  <option value="3">3RD YEAR</option>
                  <option value="4">4TH YEAR</option>
                  <option value="Other">OTHER</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Areas of Interest</label>
              <input type="text" name="interests" value={formData.interests} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder-gray-400" placeholder="WEB DEV, AI, DESIGN..." />
            </div>

            <div>
              <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Current Skills (If Any)</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder-gray-400" placeholder="REACT, PYTHON, FIGMA..." />
            </div>

            <div>
              <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Why do you want to join ENIGMA? *</label>
              <textarea name="motivation" required rows="4" value={formData.motivation} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all resize-none uppercase placeholder-gray-400" placeholder="BRIEFLY TELL US YOUR GOALS..."></textarea>
            </div>

            <div className="pt-8 mt-8 border-t-4 border-black">
                <button type="submit" disabled={submitting} className="w-full sm:w-auto px-10 py-5 bg-primary text-black font-black text-lg uppercase tracking-widest border-4 border-black neo-btn hover:-translate-y-1 hover:translate-x-1 transition-transform disabled:opacity-50 disabled:hover:transform-none flex justify-center items-center">
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default JoinUs;
