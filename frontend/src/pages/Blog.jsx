import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import api from '../api';
import SectionHeader from '../components/SectionHeader';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        setBlogs(res.data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase tracking-widest">Loading...</div>;

  return (
    <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <SectionHeader 
        number="06"
        title="Engineering Blog"
        description="Deep dives and technical tutorials from the core members."
      />

      <div className="space-y-12">
        {blogs.map((blog, idx) => (
          <motion.article 
            key={blog._id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="neo-card p-8 md:p-10 bg-white group hover:-translate-y-2 transition-transform cursor-pointer"
          >
            <div className="flex flex-wrap items-center gap-6 text-sm text-charcoal font-bold uppercase tracking-widest mb-6 pb-6 border-b-4 border-black">
              <span className="bg-primary text-black px-3 py-1 border-2 border-black neo-shadow-sm">
                {blog.category}
              </span>
              <span className="flex items-center gap-2"><Calendar size={18} strokeWidth={2.5} /> {blog.date}</span>
              <span className="flex items-center gap-2"><Clock size={18} strokeWidth={2.5} /> {blog.readTime}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase leading-tight text-charcoal group-hover:text-primary transition-colors">{blog.title}</h2>
            <p className="text-gray-700 font-medium text-lg leading-relaxed mb-8">{blog.excerpt}</p>
            <div className="flex items-center gap-4">
              <img src={blog.authorImage} alt={blog.author} className="w-12 h-12 border-2 border-black neo-shadow-sm object-cover bg-gray-200" />
              <span className="text-lg font-black text-charcoal uppercase tracking-widest">{blog.author}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
