import express from 'express';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import TeamMember from '../models/TeamMember.js';
import Achievement from '../models/Achievement.js';
import Project from '../models/Project.js';
import JoinApplication from '../models/JoinApplication.js';
import Settings from '../models/Settings.js';
import ContactMessage from '../models/ContactMessage.js';
import Resource from '../models/Resource.js';
import Blog from '../models/Blog.js';
import Leaderboard from '../models/Leaderboard.js';
import Gallery from '../models/Gallery.js';

const router = express.Router();

// Get all events (Legacy backward compatibility + New categorization)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({ published: { $ne: false } }).sort({ createdAt: -1 });
    const now = new Date();
    
    const upcoming = [];
    const previous = [];

    events.forEach(e => {
      let compareDate;
      if (e.endDate) compareDate = new Date(e.endDate);
      else if (e.startDate) compareDate = new Date(new Date(e.startDate).getTime() + 24*60*60*1000);
      else compareDate = new Date(new Date(e.date).getTime() + 24*60*60*1000);

      // Remove sensitive/large admin fields for list view
      const eventObj = e.toObject();
      delete eventObj.formQuestions;
      
      if (compareDate > now) upcoming.push(eventObj);
      else previous.push(eventObj);
    });

    res.json({ upcoming, previous });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get upcoming events specifically
router.get('/events/upcoming', async (req, res) => {
  try {
    const events = await Event.find({ published: { $ne: false } }).sort({ createdAt: -1 });
    const now = new Date();
    const upcoming = events.filter(e => {
      let compareDate = e.endDate ? new Date(e.endDate) : (e.startDate ? new Date(new Date(e.startDate).getTime() + 24*60*60*1000) : new Date(new Date(e.date).getTime() + 24*60*60*1000));
      return compareDate > now;
    }).map(e => { const obj = e.toObject(); delete obj.formQuestions; return obj; });
    res.json(upcoming);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get previous events specifically
router.get('/events/previous', async (req, res) => {
  try {
    const events = await Event.find({ published: { $ne: false } }).sort({ createdAt: -1 });
    const now = new Date();
    const previous = events.filter(e => {
      let compareDate = e.endDate ? new Date(e.endDate) : (e.startDate ? new Date(new Date(e.startDate).getTime() + 24*60*60*1000) : new Date(new Date(e.date).getTime() + 24*60*60*1000));
      return compareDate <= now;
    }).map(e => { const obj = e.toObject(); delete obj.formQuestions; return obj; });
    res.json(previous);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get single event (by ID or slug)
router.get('/events/:identifier', async (req, res) => {
  try {
    let event;
    if (req.params.identifier.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(req.params.identifier);
    }
    if (!event) {
      event = await Event.findOne({ slug: req.params.identifier });
    }
    if (!event || event.published === false) return res.status(404).json({ error: 'Event not found' });
    
    const eventObj = event.toObject();
    delete eventObj.formQuestions; // Do not expose questions on the main detail endpoint
    res.json(eventObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get event registration form questions
router.get('/events/:eventId/registration-form', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event || event.published === false) return res.status(404).json({ error: 'Event not found' });
    res.json(event.formQuestions || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

import crypto from 'crypto';

// Register for an event
router.post('/events/:eventId/register', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    
    // 1. Fetch Event
    const event = await Event.findById(eventId);
    if (!event || event.published === false) return res.status(404).json({ error: 'Event not found' });
    if (!event.registrationOpen) return res.status(400).json({ error: 'Registration is closed for this event' });
    
    // Date deadline check
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ error: 'Registration deadline has passed' });
    }

    const { participantName, phone, dynamicAnswers } = req.body;
    let { email } = req.body;

    if (!participantName || !email || !phone) return res.status(400).json({ error: 'Name, email, and phone are required' });

    // Normalize email
    email = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });

    // Pre-check duplicate email to avoid unnecessary event limit increments
    const existingReg = await Registration.findOne({ event: eventId, email });
    if (existingReg) return res.status(409).json({ error: 'You are already registered for this event with this email' });

    // Validate Dynamic Questions
    const answersArray = [];
    const validQuestionIds = new Set((event.formQuestions || []).map(q => q._id.toString()));
    const providedKeys = dynamicAnswers ? Object.keys(dynamicAnswers) : [];
    
    for (const key of providedKeys) {
      if (!validQuestionIds.has(key)) {
        return res.status(400).json({ error: `Unknown question ID provided: ${key}` });
      }
    }

    if (event.formQuestions && event.formQuestions.length > 0) {
      for (const question of event.formQuestions) {
        let answerVal = dynamicAnswers ? dynamicAnswers[question._id.toString()] : undefined;
        
        // Normalize string answers
        if (typeof answerVal === 'string') answerVal = answerVal.trim();

        if (question.required && (answerVal === undefined || answerVal === null || answerVal === '')) {
          return res.status(400).json({ error: `Question '${question.label}' is required` });
        }

        if (answerVal !== undefined && answerVal !== null && answerVal !== '') {
          // Option validation for select/radio
          if (['select', 'radio'].includes(question.type)) {
            if (!question.options.includes(answerVal)) {
              return res.status(400).json({ error: `Invalid option selected for '${question.label}'` });
            }
          }
          // Type validation (basic)
          if (question.type === 'number' && isNaN(Number(answerVal))) {
             return res.status(400).json({ error: `'${question.label}' must be a number` });
          }
          if (question.type === 'email' && !emailRegex.test(answerVal)) {
             return res.status(400).json({ error: `'${question.label}' must be a valid email` });
          }

          answersArray.push({ questionId: question._id, value: answerVal });
        }
      }
    }

    // 2. Safely Enforce Registration Limit (Atomic MongoDB check)
    let updatedEvent;
    if (event.registrationLimit > 0) {
      updatedEvent = await Event.findOneAndUpdate(
        { _id: eventId, registeredCount: { $lt: event.registrationLimit } },
        { $inc: { registeredCount: 1 } },
        { new: true }
      );
      if (!updatedEvent) return res.status(409).json({ error: 'Registration is full' });
    } else {
      updatedEvent = await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } }, { new: true });
    }

    // 3. Create Registration safely
    try {
      const qrToken = crypto.randomBytes(32).toString('hex');
      let registrationId;
      
      // Collision retry logic for human-readable ID
      let isUnique = false;
      let retries = 0;
      while (!isUnique && retries < 5) {
        const regIdNumber = crypto.randomInt(10000, 99999);
        registrationId = `ENIGMA-${updatedEvent.slug.substring(0, 5).toUpperCase()}-${regIdNumber}`;
        const collision = await Registration.findOne({ registrationId });
        if (!collision) isUnique = true;
        retries++;
      }
      
      if (!isUnique) throw new Error("Could not generate a unique registration ID. Please try again.");

      const newRegistration = new Registration({
        event: eventId,
        registrationId,
        qrToken,
        participantName: participantName.trim(),
        email,
        phone: phone.trim(),
        answers: answersArray
      });

      await newRegistration.save();
      
      // 4. Return success response (No PII inside QR, frontend just uses qrToken)
      res.status(201).json({
        message: 'Registration successful',
        registration: {
          registrationId: newRegistration.registrationId,
          qrToken: newRegistration.qrToken,
          participantName: newRegistration.participantName,
          registrationStatus: newRegistration.registrationStatus,
          checkInStatus: newRegistration.checkInStatus,
          event: {
            title: updatedEvent.title,
            date: updatedEvent.startDate || updatedEvent.date,
            venue: updatedEvent.venue
          }
        }
      });
    } catch (regErr) {
      // Rollback the event count if registration fails (e.g. duplicate email index or unexpected DB error)
      await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });
      
      if (regErr.code === 11000) {
        return res.status(409).json({ error: 'You are already registered for this event with this email' });
      }
      console.error('Registration Save Error:', regErr);
      return res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Failed to save registration' : regErr.message });
    }

  } catch (err) {
    console.error('Registration API Error:', err);
    res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message });
  }
});

// Get team members
router.get('/team', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) query.category = category;
    
    const team = await TeamMember.find(query);
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get achievements
router.get('/achievements', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single project
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join Us Route
router.get('/settings/join-status', async (req, res) => {
  try {
    let setting = await Settings.findOne({ key: 'joinAccepting' });
    if (!setting) {
      setting = new Settings({ key: 'joinAccepting', value: true });
      await setting.save();
    }
    res.json({ accepting: setting.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit join application
router.post('/join-us', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: 'joinAccepting' });
    if (setting && setting.value === false) {
      return res.status(403).json({ error: 'We are not accepting applications right now.' });
    }
    const newApplication = new JoinApplication(req.body);
    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit contact message
router.post('/contact', async (req, res) => {
  try {
    const newMessage = new ContactMessage(req.body);
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get resources
router.get('/resources', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get blogs
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ problemsSolved: -1 });
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get gallery
router.get('/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
