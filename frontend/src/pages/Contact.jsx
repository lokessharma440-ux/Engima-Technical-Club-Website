import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import api from '../api';
import SectionHeader from '../components/SectionHeader';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader 
        number="10"
        title="Contact Us"
        description="Have questions or want to collaborate? We'd love to hear from you."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <div className="neo-card p-10 bg-white border-4 border-black">
            <h3 className="text-3xl font-black mb-10 uppercase text-charcoal border-b-4 border-black pb-4">Get In Touch</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="bg-primary p-4 border-2 border-black text-black neo-shadow-sm">
                  <MapPin size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-charcoal mb-2">Our Location</h3>
                  <p className="text-gray-700 font-bold">Ambalika Institute of Management & Technology<br/>Lucknow, Uttar Pradesh, India</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="bg-primary p-4 border-2 border-black text-black neo-shadow-sm">
                  <Mail size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-charcoal mb-2">Email Us</h3>
                  <p className="text-gray-700 font-bold">
                    <a href="mailto:enigma@ambalika.co.in" className="hover:text-primary hover:underline transition-colors">enigma@ambalika.co.in</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-primary p-4 border-2 border-black text-black neo-shadow-sm">
                  <Phone size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-charcoal mb-2">Phone</h3>
                  <p className="text-gray-700 font-bold">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Link */}
          <a href="https://maps.app.goo.gl/aVJBLxS8vBL85ShV9" target="_blank" rel="noopener noreferrer" className="block h-64 overflow-hidden relative border-4 border-black bg-gray-200 neo-shadow flex items-center justify-center group cursor-pointer">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"></div>
             <div className="z-10 text-center bg-white p-4 border-4 border-black neo-shadow-sm group-hover:-translate-y-2 transition-transform">
                <MapPin className="text-black mx-auto mb-2" size={32} strokeWidth={2.5} />
                <span className="font-black text-xl uppercase tracking-widest text-charcoal">Campus Location</span>
             </div>
          </a>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="neo-card p-10 bg-white border-4 border-black"
        >
          <h3 className="text-3xl font-black mb-10 uppercase text-charcoal border-b-4 border-black pb-4">Send a Message</h3>
          
          {success ? (
            <div className="bg-primary p-10 border-4 border-black neo-shadow text-center">
              <CheckCircle2 size={64} className="text-black mx-auto mb-6" strokeWidth={2.5} />
              <h4 className="text-3xl font-black text-charcoal uppercase mb-4">Message Sent!</h4>
              <p className="text-charcoal font-bold text-lg mb-8">We'll get back to you as soon as possible.</p>
              <button onClick={() => setSuccess(false)} className="neo-btn bg-white text-black font-black uppercase tracking-widest px-8 py-4 border-2 border-black">
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500 text-white font-bold border-4 border-black px-6 py-4 mb-8 neo-shadow-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Your Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="JOHN DOE" />
              </div>
              
              <div>
                <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="JOHN@EXAMPLE.COM" />
              </div>
              
              <div>
                <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Subject</label>
                <input type="text" name="subject" required value={formData.subject} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="HOW CAN WE HELP?" />
              </div>
              
              <div>
                <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Message</label>
                <textarea name="message" required rows="5" value={formData.message} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all resize-none" placeholder="YOUR MESSAGE HERE..."></textarea>
              </div>
              
              <button type="submit" disabled={submitting} className={`w-full py-5 border-2 border-black font-black text-xl uppercase tracking-widest transition-all ${submitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-black neo-btn hover:translate-x-1 hover:-translate-y-1'}`}>
                {submitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
