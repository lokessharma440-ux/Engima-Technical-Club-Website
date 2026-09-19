import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Printer } from 'lucide-react';
import api from '../api';
import { QRCodeSVG } from 'qrcode.react';

const Registration = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [formQuestions, setFormQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    participantName: '',
    email: '',
    phone: '',
    dynamicAnswers: {}
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [eventRes, formRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/events/${id}/registration-form`)
        ]);
        setEvent(eventRes.data);
        setFormQuestions(formRes.data);
      } catch (err) {
        console.error('Error fetching event data:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDynamicChange = (questionId, value, type) => {
    let finalValue = value;
    if (type === 'checkbox') {
      finalValue = value; // assuming value passed is already boolean
    }
    setFormData((prev) => ({
      ...prev,
      dynamicAnswers: {
        ...prev.dynamicAnswers,
        [questionId]: finalValue
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const res = await api.post(`/events/${id}/register`, formData);
      setSuccessData(res.data.registration);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong while registering. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest text-charcoal">Loading...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest text-charcoal">Event not found</div>;

  if (successData) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex justify-center items-center bg-[#FAFAFA]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="neo-card p-0 bg-white border-4 border-black text-center neo-shadow max-w-xl w-full overflow-hidden flex flex-col">
          {/* Print Section wrapper */}
          <div className="print-container w-full bg-white text-left">
            <div className="bg-primary border-b-4 border-black p-8 text-center">
               <CheckCircle2 size={64} strokeWidth={2.5} className="text-black mx-auto mb-4 bg-white rounded-full border-4 border-black" />
               <h2 className="text-3xl font-black mb-2 uppercase tracking-tight text-charcoal">Registration Successful!</h2>
               <p className="font-bold text-lg text-charcoal uppercase">Digital Event Pass</p>
            </div>
            
            <div className="p-8">
              <div className="mb-8 border-b-4 border-black pb-6 text-center">
                <h3 className="text-2xl font-black uppercase text-charcoal mb-2">{successData.event.title}</h3>
                <p className="font-bold uppercase tracking-widest text-gray-500 text-sm">ENIGMA TECHNICAL CLUB</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 text-left">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Participant</p>
                  <p className="font-bold text-lg uppercase text-charcoal">{successData.participantName}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Registration ID</p>
                  <p className="font-bold text-lg uppercase text-charcoal">{successData.registrationId}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Date</p>
                  <p className="font-bold text-lg uppercase text-charcoal">{successData.event.date}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Venue</p>
                  <p className="font-bold text-lg uppercase text-charcoal">{successData.event.venue}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Status</p>
                  <span className="bg-green-300 border-2 border-black px-3 py-1 font-black uppercase text-sm">{successData.registrationStatus}</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center border-4 border-black p-6 bg-[#FAFAFA]">
                <QRCodeSVG value={successData.qrToken} size={150} level="H" />
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-center">Please present this QR code at the venue</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 border-t-4 border-black p-6 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
            <button onClick={handlePrint} className="flex-1 flex justify-center items-center py-4 bg-white text-black font-black uppercase tracking-widest border-4 border-black neo-btn hover:-translate-y-1 hover:-translate-x-1 transition-transform">
              <Printer className="mr-2" size={20} /> Print Pass
            </button>
            <Link to="/events" className="flex-1 flex justify-center items-center py-4 bg-primary text-black font-black uppercase tracking-widest border-4 border-black neo-btn hover:-translate-y-1 hover:-translate-x-1 transition-transform">
              Back to Events
            </Link>
          </div>
        </motion.div>
        <style>{`
          @media print {
            @page { margin: 10mm; }
            body * { visibility: hidden; }
            .print-container, .print-container * { visibility: visible; }
            .print-container { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
            .neo-card { box-shadow: none !important; border: none !important; }
            html, body { height: 100%; overflow: hidden; margin: 0; padding: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto bg-[#FAFAFA]">
      <Link to={`/events/${id}`} className="inline-flex items-center text-charcoal font-black uppercase tracking-widest mb-10 hover:translate-x-2 transition-transform bg-white border-2 border-black px-4 py-2 neo-shadow-sm">
        <ArrowLeft size={24} strokeWidth={2.5} className="mr-3" /> Back to Event
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="neo-card p-10 bg-white border-4 border-black">
        <div className="mb-10 border-b-4 border-black pb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase text-charcoal">Register for Event</h1>
          <p className="text-2xl text-charcoal font-bold bg-primary inline-block px-4 py-2 border-2 border-black neo-shadow-sm">{event.title}</p>
        </div>

        {error && (
          <div className="bg-red-500 text-white font-bold border-4 border-black px-6 py-4 mb-8 neo-shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Fields */}
            <div>
              <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Full Name *</label>
              <input type="text" name="participantName" required value={formData.participantName} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder-gray-400" placeholder="JOHN DOE" />
            </div>
            <div>
              <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Email Address *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder-gray-400" placeholder="JOHN@EXAMPLE.COM" />
            </div>
            <div>
              <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">Phone Number *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder-gray-400" placeholder="1234567890" />
            </div>
            
            {/* Dynamic Fields */}
            {formQuestions.map(q => {
              const qId = q._id.toString();
              const val = formData.dynamicAnswers[qId] !== undefined ? formData.dynamicAnswers[qId] : '';
              
              let inputClass = "w-full bg-[#FAFAFA] border-4 border-black px-6 py-4 text-charcoal font-bold focus:outline-none focus:bg-white focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder-gray-400";
              
              return (
                <div key={qId} className={q.type === 'textarea' ? 'col-span-1 md:col-span-2' : ''}>
                  <label className="block text-sm font-black text-charcoal uppercase tracking-widest mb-3">
                    {q.label} {q.required && '*'}
                  </label>
                  
                  {q.type === 'text' && <input type="text" required={q.required} value={val} onChange={(e) => handleDynamicChange(qId, e.target.value, q.type)} className={inputClass} />}
                  {q.type === 'email' && <input type="email" required={q.required} value={val} onChange={(e) => handleDynamicChange(qId, e.target.value, q.type)} className={inputClass} />}
                  {q.type === 'phone' && <input type="tel" required={q.required} value={val} onChange={(e) => handleDynamicChange(qId, e.target.value, q.type)} className={inputClass} />}
                  {q.type === 'number' && <input type="number" required={q.required} value={val} onChange={(e) => handleDynamicChange(qId, e.target.value, q.type)} className={inputClass} />}
                  {q.type === 'textarea' && <textarea required={q.required} rows={4} value={val} onChange={(e) => handleDynamicChange(qId, e.target.value, q.type)} className={inputClass} />}
                  
                  {q.type === 'select' && (
                    <select required={q.required} value={val} onChange={(e) => handleDynamicChange(qId, e.target.value, q.type)} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">SELECT OPTION</option>
                      {q.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  )}
                  
                  {q.type === 'radio' && (
                    <div className="flex flex-col space-y-3">
                      {q.options.map((opt, i) => (
                        <label key={i} className="flex items-center space-x-3 cursor-pointer">
                          <input type="radio" name={qId} required={q.required && !val} value={opt} checked={val === opt} onChange={(e) => handleDynamicChange(qId, e.target.value, q.type)} className="w-5 h-5 border-2 border-black text-primary focus:ring-primary accent-primary" />
                          <span className="font-bold uppercase text-charcoal">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {q.type === 'yes/no' && (
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name={qId} required={q.required && !val} value="Yes" checked={val === 'Yes'} onChange={(e) => handleDynamicChange(qId, e.target.value, q.type)} className="w-5 h-5 border-2 border-black accent-primary" />
                        <span className="font-bold uppercase text-charcoal">YES</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name={qId} required={q.required && !val} value="No" checked={val === 'No'} onChange={(e) => handleDynamicChange(qId, e.target.value, q.type)} className="w-5 h-5 border-2 border-black accent-primary" />
                        <span className="font-bold uppercase text-charcoal">NO</span>
                      </label>
                    </div>
                  )}

                  {q.type === 'checkbox' && (
                    <label className="flex items-center space-x-3 cursor-pointer p-2 bg-[#FAFAFA] border-4 border-black">
                      <input type="checkbox" required={q.required} checked={!!val} onChange={(e) => handleDynamicChange(qId, e.target.checked, q.type)} className="w-6 h-6 border-2 border-black accent-primary" />
                      <span className="font-bold uppercase text-charcoal">YES, I CONFIRM</span>
                    </label>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="pt-8 mt-8 border-t-4 border-black">
            <button type="submit" disabled={submitting} className={`w-full py-5 border-2 border-black font-black text-xl uppercase tracking-widest transition-all ${submitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-black neo-btn hover:translate-x-1 hover:-translate-y-1'}`}>
              {submitting ? 'REGISTERING...' : 'CONFIRM REGISTRATION'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Registration;
