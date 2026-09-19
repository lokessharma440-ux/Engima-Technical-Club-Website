import React, { useState, useEffect } from 'react';
import { RefreshCcw, Search, Filter, ClipboardList, Eye, X, Download } from 'lucide-react';
import api from '../../api';

const AttendanceDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // 1. Fetch Events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/admin/events');
        setEvents(res.data);
        if (res.data.length > 0) {
          setSelectedEventId(res.data[0]._id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err.response?.status === 401 || err.response?.status === 403 
          ? 'Your admin session has expired. Please log in again.' 
          : 'Unable to load events. Please try again.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. Fetch Stats and Registrations when event or filters change
  const fetchDashboardData = async (eventId, search = searchQuery, filter = statusFilter) => {
    if (!eventId) return;
    try {
      setError(null);
      
      // Fetch Stats
      const statsRes = await api.get(`/admin/events/${eventId}/attendance/stats`);
      setStats(statsRes.data);

      // Fetch Registrations with Native Backend Filters
      let url = `/admin/events/${eventId}/registrations?`;
      if (search) url += `search=${encodeURIComponent(search)}&`;
      
      if (filter === 'CHECKED IN') url += 'checkInStatus=CHECKED_IN&';
      else if (filter === 'PENDING') url += 'checkInStatus=PENDING&';
      else if (filter === 'CANCELLED') url += 'status=CANCELLED&';
      
      const regRes = await api.get(url);
      setRegistrations(regRes.data);

    } catch (err) {
      setError(err.response?.status === 401 || err.response?.status === 403 
        ? 'Your admin session has expired. Please log in again.' 
        : 'Unable to load attendance data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      setLoading(true);
      fetchDashboardData(selectedEventId);
    }
  }, [selectedEventId]);

  // Handle Search and Filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchDashboardData(selectedEventId);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(selectedEventId);
  };

  const handleExport = async () => {
    if (!selectedEventId || stats?.total === 0 || exporting) return;
    try {
      setExporting(true);
      const res = await api.get(`/admin/events/${selectedEventId}/registrations/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = res.headers['content-disposition'];
      let filename = 'registrations.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.response?.status === 404) {
        alert('No registrations available to export.');
      } else {
        alert('Unable to export registrations. Please try again.');
      }
    } finally {
      setExporting(false);
    }
  };

  const openDetails = async (id) => {
    try {
      const res = await api.get(`/admin/registrations/${id}`);
      setSelectedRegistration(res.data);
    } catch (err) {
      alert('Could not load registration details.');
    }
  };

  const closeDetails = () => {
    setSelectedRegistration(null);
  };

  const getQuestionLabel = (questionId) => {
    if (!selectedRegistration?.event?.formQuestions) return questionId;
    const q = selectedRegistration.event.formQuestions.find(fq => fq._id.toString() === questionId);
    return q ? q.label : questionId;
  };

  if (loading && !events.length) {
    return <div className="min-h-[50vh] flex items-center justify-center font-black text-2xl uppercase">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* HEADER & EVENT SELECTION */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-black pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-charcoal flex items-center gap-2">
            <ClipboardList size={32} />
            Attendance Dashboard
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Event Statistics & Check-ins</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-black uppercase text-charcoal mb-1">Select Event</label>
            <select 
              className="w-full sm:w-64 border-4 border-black px-4 py-2 font-bold uppercase neo-shadow-sm focus:outline-none focus:bg-primary transition-colors cursor-pointer disabled:opacity-50"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              disabled={loading || refreshing}
            >
              {events.length === 0 ? (
                <option value="">No events available</option>
              ) : (
                events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)
              )}
            </select>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={!selectedEventId || loading || refreshing || exporting}
            className="w-full sm:w-auto mt-0 sm:mt-5 flex items-center justify-center gap-2 px-6 py-2 bg-charcoal text-white font-black uppercase border-4 border-black hover:-translate-y-1 hover:translate-x-1 transition-transform disabled:opacity-50 disabled:hover:transform-none"
          >
            <RefreshCcw size={18} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={handleExport}
            disabled={!selectedEventId || loading || exporting || stats?.total === 0}
            className="w-full sm:w-auto mt-0 sm:mt-5 flex items-center justify-center gap-2 px-6 py-2 bg-primary text-black font-black uppercase border-4 border-black hover:-translate-y-1 hover:translate-x-1 transition-transform disabled:opacity-50 disabled:hover:transform-none"
          >
            <Download size={18} className={exporting ? 'animate-bounce' : ''} /> 
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-4 border-black font-bold text-red-600 uppercase neo-shadow-sm">
          {error}
        </div>
      )}

      {!selectedEventId && !loading && !error && (
        <div className="neo-card p-12 text-center border-4 border-black bg-white">
          <h2 className="text-2xl font-black uppercase">No Events Available</h2>
          <p className="font-bold text-gray-500 mt-2">Create an event to view attendance.</p>
        </div>
      )}

      {selectedEventId && stats && (
        <>
          {/* STATISTICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="neo-card p-6 bg-white border-4 border-black neo-shadow flex flex-col justify-center">
              <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Total Registrations</p>
              <p className="text-4xl font-black">{stats.total}</p>
            </div>
            <div className="neo-card p-6 bg-green-100 border-4 border-black neo-shadow flex flex-col justify-center">
              <p className="text-sm font-black text-green-700 uppercase tracking-widest">Checked In</p>
              <p className="text-4xl font-black text-green-900">{stats.checkedIn}</p>
            </div>
            <div className="neo-card p-6 bg-yellow-100 border-4 border-black neo-shadow flex flex-col justify-center">
              <p className="text-sm font-black text-yellow-700 uppercase tracking-widest">Pending</p>
              <p className="text-4xl font-black text-yellow-900">{stats.pending}</p>
            </div>
            <div className="neo-card p-6 bg-primary border-4 border-black neo-shadow flex flex-col justify-center">
              <p className="text-sm font-black text-black uppercase tracking-widest">Attendance %</p>
              <p className="text-4xl font-black">{stats.total > 0 ? ((stats.checkedIn / stats.total) * 100).toFixed(1) : 0}%</p>
            </div>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="neo-card p-6 bg-white border-4 border-black neo-shadow mb-8">
            <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow w-full">
                <label className="block text-xs font-black uppercase text-charcoal mb-2">Search</label>
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, Email, Phone, or ID..." 
                    className="w-full border-4 border-black pl-12 pr-4 py-3 font-bold bg-[#FAFAFA] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <label className="block text-xs font-black uppercase text-charcoal mb-2">Status Filter</label>
                <div className="relative">
                  <Filter size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border-4 border-black pl-12 pr-4 py-3 font-bold uppercase bg-[#FAFAFA] focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All</option>
                    <option value="CHECKED IN">Checked In</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-primary text-black font-black uppercase border-4 border-black hover:-translate-y-1 hover:translate-x-1 transition-transform disabled:opacity-50 disabled:hover:transform-none"
              >
                Apply
              </button>
            </form>
          </div>

          {/* REGISTRATION TABLE */}
          <div className="neo-card bg-white border-4 border-black neo-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-charcoal text-white">
                  <tr>
                    <th className="p-4 font-black uppercase text-sm border-b-4 border-black whitespace-nowrap">Participant</th>
                    <th className="p-4 font-black uppercase text-sm border-b-4 border-black whitespace-nowrap">Email</th>
                    <th className="p-4 font-black uppercase text-sm border-b-4 border-black whitespace-nowrap">Phone</th>
                    <th className="p-4 font-black uppercase text-sm border-b-4 border-black whitespace-nowrap">Reg ID</th>
                    <th className="p-4 font-black uppercase text-sm border-b-4 border-black whitespace-nowrap">Reg Status</th>
                    <th className="p-4 font-black uppercase text-sm border-b-4 border-black whitespace-nowrap">Check-in Status</th>
                    <th className="p-4 font-black uppercase text-sm border-b-4 border-black whitespace-nowrap">Time</th>
                    <th className="p-4 font-black uppercase text-sm border-b-4 border-black whitespace-nowrap text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && !refreshing ? (
                    <tr>
                      <td colSpan="8" className="p-10 text-center font-black uppercase text-gray-500">Loading registrations...</td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-10 text-center font-black uppercase text-gray-500">
                        {searchQuery || statusFilter !== 'ALL' ? 'No registrations match your search.' : 'No registrations yet.'}
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg) => (
                      <tr key={reg._id} className="border-b-2 border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold">{reg.participantName}</td>
                        <td className="p-4 text-gray-600">{reg.email}</td>
                        <td className="p-4 text-gray-600">{reg.phone}</td>
                        <td className="p-4 text-xs font-bold text-gray-500 font-mono">{reg.registrationId}</td>
                        
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-black uppercase border-2 border-black inline-block ${
                            reg.registrationStatus === 'REGISTERED' ? 'bg-primary text-black' : 'bg-gray-300 text-gray-700'
                          }`}>
                            {reg.registrationStatus}
                          </span>
                        </td>
                        
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-black uppercase border-2 border-black inline-block ${
                            reg.checkInStatus === 'CHECKED_IN' ? 'bg-green-400 text-black' : 'bg-yellow-400 text-black'
                          }`}>
                            {reg.checkInStatus.replace('_', ' ')}
                          </span>
                        </td>
                        
                        <td className="p-4 text-sm font-bold text-gray-600 whitespace-nowrap">
                          {reg.checkInTime ? new Date(reg.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}
                        </td>
                        
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => openDetails(reg._id)}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-charcoal text-white text-xs font-black uppercase border-2 border-black hover:-translate-y-1 transition-transform"
                          >
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* REGISTRATION DETAILS MODAL */}
      {selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal bg-opacity-80 backdrop-blur-sm">
          <div className="bg-white border-4 border-black neo-shadow w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b-4 border-black flex justify-between items-center bg-primary">
              <h2 className="text-2xl font-black uppercase tracking-tight">Registration Details</h2>
              <button 
                onClick={closeDetails}
                className="p-2 hover:bg-black hover:text-primary transition-colors border-2 border-transparent hover:border-black"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-black uppercase border-b-4 border-black pb-2 mb-4">Participant Info</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Name</p>
                      <p className="font-bold text-xl">{selectedRegistration.participantName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Email</p>
                      <p className="font-bold">{selectedRegistration.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Phone</p>
                      <p className="font-bold">{selectedRegistration.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Registration ID</p>
                      <p className="font-mono font-bold text-sm bg-gray-100 p-2 border-2 border-black inline-block mt-1">
                        {selectedRegistration.registrationId}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-black uppercase border-b-4 border-black pb-2 mb-4">Status & Admin</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Registration Status</p>
                      <span className={`px-3 py-1 text-xs font-black uppercase border-2 border-black inline-block ${
                        selectedRegistration.registrationStatus === 'REGISTERED' ? 'bg-primary' : 'bg-gray-300'
                      }`}>
                        {selectedRegistration.registrationStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Check-in Status</p>
                      <span className={`px-3 py-1 text-xs font-black uppercase border-2 border-black inline-block ${
                        selectedRegistration.checkInStatus === 'CHECKED_IN' ? 'bg-green-400' : 'bg-yellow-400'
                      }`}>
                        {selectedRegistration.checkInStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Check-in Time</p>
                      <p className="font-bold">
                        {selectedRegistration.checkInTime ? new Date(selectedRegistration.checkInTime).toLocaleString() : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Checked In By</p>
                      <p className="font-bold">{selectedRegistration.checkedInBy || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedRegistration.answers && selectedRegistration.answers.length > 0 && (
                <div>
                  <h3 className="text-lg font-black uppercase border-b-4 border-black pb-2 mb-4">Form Answers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRegistration.answers.map((ans, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 border-2 border-black">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                          {getQuestionLabel(ans.questionId)}
                        </p>
                        <p className="font-bold whitespace-pre-wrap">
                          {Array.isArray(ans.value) ? ans.value.join(', ') : (ans.value?.toString() || '—')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t-4 border-black bg-gray-100 flex justify-end">
              <button 
                onClick={closeDetails}
                className="px-6 py-2 bg-charcoal text-white font-black uppercase border-4 border-black hover:-translate-y-1 hover:translate-x-1 transition-transform"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
