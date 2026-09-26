import { getImageUrl } from '../utils/getImageUrl';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Code, Cpu, Globe, Users, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import SectionHeader from '../components/SectionHeader';
import CountUp from '../components/CountUp';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        const { upcoming } = res.data;
        setUpcomingEvents(upcoming.slice(0, 3));
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="w-full bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-background">
        {/* Geometric Elements */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 text-left">
              <div className="inline-block border-2 border-charcoal bg-white px-3 py-1 text-sm font-bold uppercase tracking-widest mb-6 neo-shadow-sm text-charcoal">
                ENIGMA TECHNICAL CLUB
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-charcoal uppercase leading-[0.9]">
                Learn.<br/>
                <span className="text-primary" style={{ WebkitTextStroke: '2px var(--color-charcoal)' }}>Build.</span><br/>
                Innovate.
              </h1>
              <p className="mt-4 text-xl md:text-2xl text-charcoal/80 max-w-2xl mb-10 font-medium border-l-4 border-primary pl-4">
                The official technical community of AIMT focusing on coding, innovation, collaboration, mentorship, and real-world projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/join-us" className="px-8 py-4 bg-primary text-charcoal font-black uppercase tracking-wider text-center neo-btn">
                  Join ENIGMA
                </Link>
                <Link to="/events" className="px-8 py-4 bg-white text-charcoal font-black uppercase tracking-wider text-center neo-btn">
                  Explore Events
                </Link>
              </div>
            </div>
            <div className="w-full mt-12 md:mt-0 md:flex-1">
              <div className="w-full bg-[#f4f7fb] border-[3px] border-charcoal neo-shadow flex flex-col">
                {/* Window Title Bar */}
                <div className="flex justify-between items-center border-b-[3px] border-charcoal bg-white px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] border-[2px] border-charcoal"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border-[2px] border-charcoal"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] border-[2px] border-charcoal"></div>
                  </div>
                  <div className="text-xs font-bold text-charcoal/60 tracking-widest uppercase">
                    SYS_TERMINAL // V4.2.0
                  </div>
                </div>

                {/* Window Content */}
                <div className="p-4 md:p-5 flex flex-col gap-4">
                  {/* Top Terminal Block */}
                  <div className="bg-primary border-[3px] border-charcoal neo-shadow-sm p-4 font-mono text-sm md:text-base text-charcoal flex flex-col gap-1">
                    <div className="font-bold">SYSTEM_STATUS: ONLINE</div>
                    <div>$ git checkout enigma-core-systems</div>
                    <div>[OK] Initializing club metrics...</div>
                    <div className="mt-1 font-bold">[OK] <CountUp to={5} suffix="+" /> Years Club Journey</div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Stat 1 */}
                    <div className="bg-white border-[3px] border-charcoal neo-shadow-sm p-4 flex flex-col justify-center">
                      <div className="text-[10px] md:text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-1">Active Members</div>
                      <div className="text-3xl md:text-4xl font-black text-charcoal leading-none tracking-tight"><CountUp to={35} /></div>
                    </div>
                    {/* Stat 2 */}
                    <div className="bg-[#e6f0ff] border-[3px] border-charcoal neo-shadow-sm p-4 flex flex-col justify-center">
                      <div className="text-[10px] md:text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-1">Team Heads</div>
                      <div className="text-3xl md:text-4xl font-black text-charcoal leading-none tracking-tight"><CountUp to={17} /></div>
                    </div>
                    {/* Stat 3 */}
                    <div className="bg-[#e6f0ff] border-[3px] border-charcoal neo-shadow-sm p-4 flex flex-col justify-center">
                      <div className="text-[10px] md:text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-1">Mentors</div>
                      <div className="text-3xl md:text-4xl font-black text-charcoal leading-none tracking-tight"><CountUp to={6} /></div>
                    </div>
                    {/* Stat 4 */}
                    <div className="bg-white border-[3px] border-charcoal neo-shadow-sm p-4 flex flex-col justify-center">
                      <div className="text-[10px] md:text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-1 lg:whitespace-nowrap">Students Participated</div>
                      <div className="text-3xl md:text-4xl font-black text-charcoal leading-none tracking-tight"><CountUp to={500} suffix="+" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About / What We Do Section */}
      <section className="py-32 bg-white border-y-4 border-charcoal relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader 
            number="01"
            title="What We Do"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Code size={32} strokeWidth={2.5} />, title: "Hackathons", desc: "Collaborative problem-solving and 24-hour coding events." },
              { icon: <Cpu size={32} strokeWidth={2.5} />, title: "Workshops", desc: "Hands-on sessions on modern technologies." },
              { icon: <Globe size={32} strokeWidth={2.5} />, title: "Web Dev", desc: "Building scalable and beautiful web applications." },
              { icon: <Users size={32} strokeWidth={2.5} />, title: "Community", desc: "Connect, learn, and grow with like-minded peers." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="neo-card p-8 flex flex-col h-full bg-background"
              >
                <div className="text-charcoal mb-6 bg-primary inline-block p-3 border-2 border-charcoal neo-shadow-sm self-start">{item.icon}</div>
                <h3 className="text-2xl font-black mb-3 uppercase text-charcoal">{item.title}</h3>
                <p className="text-charcoal/80 font-medium flex-grow">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16">
            <Link to="/about" className="inline-block px-8 py-3 bg-white text-charcoal font-black uppercase tracking-wider neo-btn">
              Learn More About Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-32 bg-charcoal text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <SectionHeader 
              number="02"
              title="Upcoming Events"
              dark={true}
            />
            <Link to="/events" className="flex items-center text-primary font-bold uppercase tracking-wider hover:translate-x-2 transition-transform mb-16 md:mb-0">
              View All <ChevronRight size={20} className="ml-1" strokeWidth={3} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, idx) => (
              <motion.div 
                key={event._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white text-charcoal border-4 border-charcoal neo-shadow flex flex-col hover:-translate-y-2 transition-transform"
              >
                <div className="border-b-4 border-charcoal bg-white">
                  <img src={getImageUrl(event.image)} alt={event.title} className="w-full h-auto block" onError={(e) => { e.target.onerror = null; e.target.src = event.image; }} />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black bg-primary px-2 py-1 border-2 border-charcoal neo-shadow-sm uppercase tracking-wider inline-block mb-4 text-charcoal">{event.category}</span>
                    <h3 className="text-2xl font-black mb-3 leading-tight uppercase text-charcoal">{event.title}</h3>
                    <p className="text-sm font-bold text-charcoal/70 mb-6 uppercase tracking-wide">{event.date} • {event.venue}</p>
                  </div>
                  <Link to={`/events/${event._id}`} className="w-full py-3 bg-white text-charcoal text-center font-black uppercase tracking-wider neo-btn">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore & Discover Section */}
      <section className="py-32 bg-background border-y-4 border-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            number="03"
            title="Explore & Discover"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="neo-card p-10 flex flex-col">
              <h3 className="text-3xl font-black mb-4 uppercase text-charcoal">Our Projects</h3>
              <p className="text-charcoal/80 font-medium mb-8 text-lg flex-grow">Discover the incredible products and applications built by our community members.</p>
              <Link to="/projects" className="inline-block px-6 py-3 bg-primary text-charcoal font-black uppercase tracking-wider text-center neo-btn">
                Explore Projects
              </Link>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="neo-card p-10 flex flex-col">
              <h3 className="text-3xl font-black mb-4 uppercase text-charcoal">Our Achievements</h3>
              <p className="text-charcoal/80 font-medium mb-8 text-lg flex-grow">See the milestones, hackathon wins, and awards our members have secured.</p>
              <Link to="/achievements" className="inline-block px-6 py-3 bg-white text-charcoal font-black uppercase tracking-wider text-center neo-btn">
                View Achievements
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="neo-card p-10 flex flex-col">
              <h3 className="text-3xl font-black mb-4 uppercase text-charcoal">Meet the Team</h3>
              <p className="text-charcoal/80 font-medium mb-8 text-lg flex-grow">Get to know the dedicated core team and mentors behind ENIGMA Technical Club.</p>
              <Link to="/team" className="inline-block px-6 py-3 bg-white text-charcoal font-black uppercase tracking-wider text-center neo-btn">
                Meet the Team
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="neo-card p-10 flex flex-col bg-primary">
              <h3 className="text-3xl font-black mb-4 uppercase text-charcoal">Gallery</h3>
              <p className="text-charcoal/90 font-bold mb-8 text-lg flex-grow">A glimpse into our events, hackathons, and the vibrant community that makes it all happen.</p>
              <Link to="/gallery" className="inline-block px-6 py-3 bg-charcoal text-white font-black uppercase tracking-wider text-center border-2 border-charcoal neo-shadow hover:translate-y-1 hover:shadow-none transition-all">
                View Gallery
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary border-b-4 border-charcoal relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-20 transform -skew-x-12 translate-x-32 hidden md:block"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase text-charcoal tracking-tight">Ready to make an impact?</h2>
            <p className="text-xl md:text-2xl text-charcoal/90 font-bold mb-10 max-w-2xl mx-auto">Whether you want to join our community or collaborate with us, we'd love to connect.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/join-us" className="px-8 py-5 bg-charcoal text-white font-black text-lg uppercase tracking-wider neo-btn">
                Join ENIGMA
              </Link>
              <Link to="/contact" className="px-8 py-5 bg-white text-charcoal font-black text-lg uppercase tracking-wider neo-btn">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
