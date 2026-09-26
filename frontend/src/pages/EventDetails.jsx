import { getImageUrl } from '../utils/getImageUrl';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ArrowLeft } from 'lucide-react';
import api from '../api';
import { getEventStatus } from '../utils/eventDateUtils';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest">Loading...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest">Event not found</div>;

  const eventStatus = getEventStatus(event.date);

  const renderRegistrationButton = () => {
    if (eventStatus === 'previous') {
      return (
        <div className="px-12 py-5 bg-gray-200 text-gray-500 text-xl font-black uppercase tracking-wider border-2 border-gray-400 text-center w-full sm:w-auto cursor-not-allowed">
          Event Completed
        </div>
      );
    }

    if (!event.registrationOpen) {
      return (
        <div className="px-12 py-5 bg-gray-200 text-gray-500 text-xl font-black uppercase tracking-wider border-2 border-gray-400 text-center w-full sm:w-auto cursor-not-allowed">
          Registration Closed
        </div>
      );
    }

    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      return (
        <div className="px-12 py-5 bg-gray-200 text-gray-500 text-xl font-black uppercase tracking-wider border-2 border-gray-400 text-center w-full sm:w-auto cursor-not-allowed">
          Registration Closed
        </div>
      );
    }

    if (event.registrationLimit > 0 && event.registeredCount >= event.registrationLimit) {
      return (
        <div className="px-12 py-5 bg-gray-200 text-gray-500 text-xl font-black uppercase tracking-wider border-2 border-gray-400 text-center w-full sm:w-auto cursor-not-allowed">
          Registration Full
        </div>
      );
    }

    if (event.externalRegistrationLink) {
      return (
        <a href={event.externalRegistrationLink} target="_blank" rel="noopener noreferrer" className="px-12 py-5 bg-primary text-black text-xl font-black uppercase tracking-wider neo-btn text-center w-full sm:w-auto">
          Register Now
        </a>
      );
    }

    return (
      <Link to={`/events/${event._id}/register`} className="px-12 py-5 bg-primary text-black text-xl font-black uppercase tracking-wider neo-btn text-center w-full sm:w-auto">
        Register Now
      </Link>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/events" className="inline-flex items-center text-charcoal hover:bg-primary border-2 border-transparent hover:border-black transition-colors mb-8 font-black uppercase tracking-widest py-1 px-2">
          <ArrowLeft size={24} className="mr-2" strokeWidth={3} /> Back to Events
        </Link>
        
        {/* Full-width Banner Poster */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full h-64 md:h-[400px] border-4 border-black relative bg-white mb-12 neo-shadow overflow-hidden">
          <img src={getImageUrl(event.bannerImage || event.image)} alt={event.title} className="w-full h-full object-cover block" onError={(e) => { e.target.onerror = null; e.target.src = event.bannerImage || event.image; }} />
          <div className="absolute top-4 left-4 bg-primary text-black font-black uppercase tracking-widest px-4 py-2 border-2 border-black neo-shadow-sm z-20">
            {event.category}
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area (Left) */}
          <div className="lg:w-2/3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-12 uppercase leading-tight text-charcoal">{event.title}</h1>
            
            <div className="mb-16">
              <h3 className="text-2xl font-black mb-6 uppercase text-charcoal border-b-4 border-black pb-2 inline-block tracking-tight">About the Event</h3>
              <p className="text-gray-700 leading-relaxed font-medium text-lg whitespace-pre-wrap">{event.description}</p>
            </div>

            {event.gallery && event.gallery.length > 0 && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
                <h3 className="text-2xl font-black mb-6 uppercase text-charcoal border-b-4 border-black pb-2 inline-block tracking-tight">Event Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {event.gallery.map((img, i) => (
                    <div key={i} className="h-48 overflow-hidden neo-card p-0 border-4 border-black bg-gray-200">
                      <img src={getImageUrl(img)} alt={`Gallery image ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Area (Right) */}
          <div className="lg:w-1/3">
            <div className="neo-card p-8 sticky top-32 bg-white">
              <h3 className="text-xl font-black mb-8 uppercase text-charcoal border-b-4 border-black pb-2">Event Details</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#FAFAFA] border-2 border-black flex items-center justify-center mr-4 shrink-0 neo-shadow-sm">
                    <Calendar className="text-black" size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Date</p>
                    <p className="font-black uppercase text-lg">{event.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#FAFAFA] border-2 border-black flex items-center justify-center mr-4 shrink-0 neo-shadow-sm">
                    <Clock className="text-black" size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Time</p>
                    <p className="font-black uppercase text-lg">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#FAFAFA] border-2 border-black flex items-center justify-center mr-4 shrink-0 neo-shadow-sm">
                    <MapPin className="text-black" size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Venue</p>
                    <p className="font-black uppercase text-lg">{event.venue}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#FAFAFA] border-2 border-black flex items-center justify-center mr-4 shrink-0 neo-shadow-sm">
                    <Users className="text-black" size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Registered</p>
                    <p className="font-black uppercase text-lg">{event.registeredCount} Students</p>
                  </div>
                </div>
              </div>

              <div className="border-t-4 border-black pt-6">
                {renderRegistrationButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
