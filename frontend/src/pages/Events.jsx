import { getImageUrl } from '../utils/getImageUrl';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import api from '../api';
import SectionHeader from '../components/SectionHeader';

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        const { upcoming, previous } = res.data;
        setUpcomingEvents(upcoming);
        setPreviousEvents(previous);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-2xl uppercase tracking-widest">Loading...</div>;

  const EventCard = ({ event, idx, isUpcoming }) => (
    <motion.div 
      key={event._id}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="neo-card p-0 flex flex-col group bg-[#FAFAFA] border-4 border-black hover:-translate-y-2 transition-transform"
    >
      <div className="relative border-b-4 border-black overflow-hidden bg-[#FAFAFA]">
        <img src={getImageUrl(event.image)} alt={event.title} className="w-full h-auto block group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.onerror = null; e.target.src = event.image; }} />
        <div className="absolute top-4 right-4 bg-primary px-3 py-1 text-xs font-black text-black border-2 border-black neo-shadow-sm uppercase tracking-widest">
          {event.category}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-black mb-4 uppercase">{event.title}</h3>
          <div className="space-y-3 mb-6 font-bold text-sm uppercase tracking-wide">
            <div className="flex items-center text-charcoal border-b-2 border-black pb-2">
              <Calendar size={18} strokeWidth={2.5} className="mr-3 text-black" /> {event.date}
            </div>
            <div className="flex items-center text-charcoal border-b-2 border-black pb-2">
              <Clock size={18} strokeWidth={2.5} className="mr-3 text-black" /> {event.time}
            </div>
            <div className="flex items-center text-charcoal pb-2">
              <MapPin size={18} strokeWidth={2.5} className="mr-3 text-black" /> {event.venue}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Link to={`/events/${event._id}`} className="flex-1 py-3 bg-white text-black font-black uppercase tracking-widest border-2 border-black neo-shadow-sm text-center hover:translate-x-1 hover:-translate-y-1 transition-transform">
            Details
          </Link>
          {event.registrationOpen && isUpcoming && (
            event.externalRegistrationLink ? (
              <a href={event.externalRegistrationLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-primary text-black font-black uppercase tracking-widest border-2 border-black neo-shadow-sm text-center hover:translate-x-1 hover:-translate-y-1 transition-transform">
                Register
              </a>
            ) : (
              <Link to={`/events/${event._id}/register`} className="flex-1 py-3 bg-primary text-black font-black uppercase tracking-widest border-2 border-black neo-shadow-sm text-center hover:translate-x-1 hover:-translate-y-1 transition-transform">
                Register
              </Link>
            )
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader 
        number="02"
        title="Events & Workshops"
        description="Discover our upcoming hackathons, technical sessions, and hands-on workshops."
      />

      {upcomingEvents.length > 0 && (
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-black mb-10 uppercase text-charcoal border-l-8 border-primary pl-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, idx) => (
              <EventCard key={event._id} event={event} idx={idx} isUpcoming={true} />
            ))}
          </div>
        </div>
      )}

      {previousEvents.length > 0 && (
        <div>
          <h2 className="text-3xl md:text-4xl font-black mb-10 uppercase text-charcoal border-l-8 border-primary pl-4">Previous Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90 grayscale-[0.2]">
            {previousEvents.map((event, idx) => (
              <EventCard key={event._id} event={event} idx={idx} isUpcoming={false} />
            ))}
          </div>
        </div>
      )}
      
      {upcomingEvents.length === 0 && previousEvents.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl font-bold uppercase tracking-widest text-gray-500">No events found.</p>
        </div>
      )}
    </div>
  );
};

export default Events;
