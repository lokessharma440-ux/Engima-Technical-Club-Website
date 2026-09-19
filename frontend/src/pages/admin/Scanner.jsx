import React, { useState, useEffect, useRef } from 'react';
import { Scanner as QRScanner } from '@yudiel/react-qr-scanner';
import { Camera, CheckCircle2, XCircle, AlertTriangle, KeySquare, RefreshCcw } from 'lucide-react';
import api from '../../api';

const Scanner = () => {
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { type: 'success' | 'warning' | 'error', data: object, message: string }
  const [manualToken, setManualToken] = useState('');

  // Event Context
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/admin/events');
        // Sort by date or just use the list
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to load events for context:', err);
      }
    };
    fetchEvents();
  }, []);

  const handleVerify = async (token) => {
    if (!token || locked) return;
    setLocked(true);
    setLoading(true);
    setResult(null);

    const payload = { qrToken: token };
    if (selectedEventId) {
      payload.eventId = selectedEventId;
    }

    try {
      const res = await api.post('/admin/attendance/verify', payload);
      
      // Expected success format: code 'ENTRY_ALLOWED'
      if (res.data.code === 'ENTRY_ALLOWED') {
        setResult({
          type: 'success',
          message: 'ENTRY ALLOWED - CHECK-IN SUCCESSFUL',
          data: res.data.participant
        });
      } else {
        // Fallback for unexpected 200 format
        setResult({
          type: 'success',
          message: 'CHECK-IN SUCCESSFUL',
          data: res.data.participant || {}
        });
      }
    } catch (err) {
      const errorData = err.response?.data || {};
      const status = err.response?.status;
      
      if (status === 409 && errorData.code === 'ALREADY_CHECKED_IN') {
        setResult({
          type: 'warning',
          message: 'ALREADY CHECKED IN',
          data: errorData
        });
      } else if (status === 409 || status === 404 || status === 400) {
        setResult({
          type: 'error',
          message: errorData.error || 'INVALID QR CODE'
        });
      } else {
        setResult({
          type: 'error',
          message: 'Server Error. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (detectedCodes) => {
    if (locked || !detectedCodes || detectedCodes.length === 0) return;
    const token = detectedCodes[0].rawValue;
    handleVerify(token);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualToken.trim()) {
      handleVerify(manualToken.trim());
    }
  };

  const resetScanner = () => {
    setResult(null);
    setManualToken('');
    setLocked(false);
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-black pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-charcoal">QR Scanner</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Event Check-in</p>
        </div>
        
        {/* Optional Event Selector */}
        <div className="w-full md:w-auto">
          <label className="block text-xs font-black uppercase text-charcoal mb-1">Context (Optional)</label>
          <select 
            className="w-full md:w-64 border-2 border-black p-2 font-bold uppercase neo-shadow-sm focus:outline-none"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">Any Event</option>
            {events.map(e => (
              <option key={e._id} value={e._id}>{e.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* CAMERA PREVIEW */}
        <div className="neo-card p-4 bg-white border-4 border-black neo-shadow overflow-hidden relative">
          <div className="flex items-center gap-2 mb-4">
            <Camera size={24} />
            <h2 className="text-xl font-black uppercase">Camera View</h2>
          </div>
          
          <div className="border-4 border-black bg-gray-200 aspect-square md:aspect-video relative overflow-hidden flex items-center justify-center">
             {!locked ? (
                <QRScanner
                  onScan={handleScan}
                  onError={(error) => console.error(error?.message)}
                  components={{
                    audio: false,
                    onOff: true,
                    torch: true,
                    zoom: false,
                    finder: true,
                  }}
                  styles={{
                    container: { width: '100%', height: '100%' }
                  }}
                />
             ) : (
                <div className="absolute inset-0 bg-charcoal bg-opacity-90 flex items-center justify-center text-white z-10 flex-col p-6">
                  {loading ? (
                    <div className="font-black text-2xl uppercase animate-pulse">Verifying...</div>
                  ) : (
                    <div className="text-center">
                       {result?.type === 'success' && <CheckCircle2 size={64} className="mx-auto text-green-400 mb-4" />}
                       {result?.type === 'warning' && <AlertTriangle size={64} className="mx-auto text-yellow-400 mb-4" />}
                       {result?.type === 'error' && <XCircle size={64} className="mx-auto text-red-400 mb-4" />}
                       <h3 className={`text-2xl font-black uppercase mb-2 ${
                         result?.type === 'success' ? 'text-green-400' :
                         result?.type === 'warning' ? 'text-yellow-400' : 'text-red-400'
                       }`}>
                         {result?.message}
                       </h3>
                    </div>
                  )}
                </div>
             )}
          </div>

          {result && !loading && (
            <button 
              onClick={resetScanner} 
              className="mt-4 w-full flex items-center justify-center gap-2 py-4 bg-primary text-black font-black uppercase border-4 border-black neo-btn hover:translate-x-1 hover:-translate-y-1 transition-transform"
            >
              <RefreshCcw size={20} /> Scan Next
            </button>
          )}
        </div>

        {/* RESULTS CARD */}
        {result && !loading && result.type !== 'error' && (
          <div className={`neo-card p-6 border-4 border-black neo-shadow ${
            result.type === 'success' ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            <h3 className="text-xl font-black uppercase mb-4 text-charcoal border-b-4 border-black pb-2">Participant Details</h3>
            
            {result.type === 'success' && result.data && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Name</p>
                  <p className="font-bold text-lg">{result.data.name}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Registration ID</p>
                  <p className="font-bold text-lg">{result.data.registrationId}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Email</p>
                  <p className="font-bold">{result.data.email}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Event</p>
                  <p className="font-bold">{result.data.eventTitle}</p>
                </div>
              </div>
            )}

            {result.type === 'warning' && (
               <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Error Context</p>
                    <p className="font-bold text-lg text-red-600">{result.data.error}</p>
                  </div>
                  {result.data.checkInTime && (
                    <div>
                      <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Previously Checked In At</p>
                      <p className="font-bold">{new Date(result.data.checkInTime).toLocaleString()}</p>
                    </div>
                  )}
                  {result.data.checkedInBy && (
                    <div>
                      <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Checked In By</p>
                      <p className="font-bold">{result.data.checkedInBy}</p>
                    </div>
                  )}
               </div>
            )}
          </div>
        )}

        {/* MANUAL FALLBACK */}
        <div className="neo-card p-6 bg-white border-4 border-black neo-shadow mt-4">
          <div className="flex items-center gap-2 mb-4">
            <KeySquare size={24} />
            <h2 className="text-xl font-black uppercase">Manual Entry</h2>
          </div>
          <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Paste QR Token string..." 
              className="flex-grow border-4 border-black px-4 py-3 font-bold bg-[#FAFAFA] focus:bg-white focus:outline-none"
              disabled={locked}
            />
            <button 
              type="submit" 
              disabled={locked || !manualToken.trim()}
              className="px-8 py-3 bg-charcoal text-white font-black uppercase border-4 border-black hover:-translate-y-1 hover:translate-x-1 transition-transform disabled:opacity-50 disabled:hover:transform-none"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
