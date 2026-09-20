import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import TeamMember from '../models/TeamMember.js';
import Event from '../models/Event.js';
import Achievement from '../models/Achievement.js';
import Project from '../models/Project.js';
import Gallery from '../models/Gallery.js';
import Registration from '../models/Registration.js';
import Settings from '../models/Settings.js';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};
export const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter
});

// Middleware for auth
export const adminAuth = (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// LOGIN & LOGOUT
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('adminToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
  res.json({ message: 'Login successful' });
});

router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', adminAuth, (req, res) => {
  res.json({ username: req.admin.username });
});

// DASHBOARD OVERVIEW
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      totalMembers,
      totalMentors,
      facultyCoordinators,
      totalAchievements,
      totalProjects,
      totalGallery,
      events
    ] = await Promise.all([
      TeamMember.countDocuments({ category: { $nin: ['Mentors', 'Coordinator'] } }),
      TeamMember.countDocuments({ category: 'Mentors' }),
      TeamMember.countDocuments({ category: 'Coordinator' }),
      Achievement.countDocuments(),
      Project.countDocuments(),
      Gallery.countDocuments(),
      Event.find()
    ]);

    const now = new Date();
    let upcomingEvents = 0;
    let previousEvents = 0;
    
    events.forEach(e => {
      const compareDate = e.endDate ? new Date(e.endDate) : new Date(new Date(e.date).getTime() + 24*60*60*1000);
      if (compareDate > now) upcomingEvents++;
      else previousEvents++;
    });

    res.json({
      totalMembers,
      totalMentors,
      facultyCoordinators,
      totalAchievements,
      upcomingEvents,
      previousEvents,
      totalProjects,
      totalGallery
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GENERIC CRUD GENERATOR
const createCrudRoutes = (Model, uploadField = 'image') => {
  const r = express.Router();

  r.get('/', adminAuth, async (req, res) => {
    try {
      const data = await Model.find().sort({ createdAt: -1 });
      res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  r.post('/', adminAuth, upload.any(), async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          data[file.fieldname] = `/uploads/${file.filename}`;
        });
      }
      const newItem = new Model(data);
      await newItem.save();
      res.status(201).json(newItem);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  r.put('/:id', adminAuth, upload.any(), async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          data[file.fieldname] = `/uploads/${file.filename}`;
        });
      }
      const updatedItem = await Model.findByIdAndUpdate(req.params.id, data, { new: true });
      res.json(updatedItem);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  r.delete('/:id', adminAuth, async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  return r;
};

router.use('/members', createCrudRoutes(TeamMember)); // Will filter by category on frontend
router.use('/achievements', createCrudRoutes(Achievement));
router.use('/projects', createCrudRoutes(Project));
router.use('/events', createCrudRoutes(Event));
router.use('/gallery', createCrudRoutes(Gallery));

// ---------------------------------------------------
// REGISTRATION MANAGEMENT (ADMIN)
// ---------------------------------------------------

// Get registrations for an event (with filters)
router.get('/events/:eventId/registrations', adminAuth, async (req, res) => {
  try {
    const { search, status, checkInStatus } = req.query;
    const query = { event: req.params.eventId };
    
    if (status) query.registrationStatus = status;
    if (checkInStatus) query.checkInStatus = checkInStatus;
    
    if (search) {
      query.$or = [
        { participantName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { registrationId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const registrations = await Registration.find(query).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View registration statistics
router.get('/events/:eventId/attendance/stats', adminAuth, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const total = await Registration.countDocuments({ event: eventId });
    const checkedIn = await Registration.countDocuments({ event: eventId, checkInStatus: 'CHECKED_IN' });
    const pending = total - checkedIn;
    res.json({ total, checkedIn, pending, attendancePercentage: total > 0 ? ((checkedIn / total) * 100).toFixed(2) : 0 });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Export registrations as CSV
router.get('/events/:eventId/registrations/export', adminAuth, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    
    // Fetch event to get form questions and slug
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    const registrations = await Registration.find({ event: eventId }).sort({ createdAt: 1 });
    if (registrations.length === 0) return res.status(404).send('No registrations found');

    // Helper for robust CSV escaping
    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '';
      let str = Array.isArray(val) ? val.join(', ') : String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    // Extract dynamic form questions
    const dynamicQuestions = event.formQuestions || [];
    
    // De-duplicate headers if multiple questions share a label
    const seenLabels = {};
    const dynamicHeaders = dynamicQuestions.map(q => {
      let label = q.label || 'Unknown';
      if (seenLabels[label]) {
        seenLabels[label]++;
        label = `${label} (${seenLabels[label]})`;
      } else {
        seenLabels[label] = 1;
      }
      return { id: q._id.toString(), label };
    });

    const staticHeaders = ['Registration ID', 'Participant Name', 'Email', 'Phone'];
    const trailingHeaders = ['Registration Status', 'Check-in Status', 'Check-in Time', 'Checked-in By', 'Registration Date'];
    
    const headers = [
      ...staticHeaders,
      ...dynamicHeaders.map(dh => dh.label),
      ...trailingHeaders
    ];

    const rows = registrations.map(r => {
      // Map dynamic answers securely by questionId
      const mappedAnswers = dynamicHeaders.map(dh => {
        const found = r.answers?.find(a => a.questionId && a.questionId.toString() === dh.id);
        return found ? found.value : '';
      });

      const rowData = [
        r.registrationId,
        r.participantName,
        r.email,
        r.phone,
        ...mappedAnswers,
        r.registrationStatus,
        r.checkInStatus,
        r.checkInTime ? r.checkInTime.toISOString() : 'N/A',
        r.checkedInBy || 'N/A',
        r.createdAt.toISOString()
      ];

      return rowData.map(escapeCSV).join(',');
    });

    const csv = [headers.map(escapeCSV).join(','), ...rows].join('\n');
    
    const filename = `enigma-${event.slug || eventId}-registrations.csv`;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// View single registration
router.get('/registrations/:id', adminAuth, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id).populate('event', 'title startDate date');
    if (!reg) return res.status(404).json({ error: 'Registration not found' });
    res.json(reg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------
// QR SCANNER / VERIFICATION (ADMIN)
// ---------------------------------------------------

router.post('/attendance/verify', adminAuth, async (req, res) => {
  try {
    const { qrToken, eventId } = req.body;
    if (!qrToken) return res.status(400).json({ error: 'qrToken is required' });

    // 1. Find the registration
    const query = { qrToken };
    if (eventId) query.event = eventId;
    
    // We use findOne initially to provide detailed specific error messages
    const reg = await Registration.findOne(query).populate('event', 'title');
    
    if (!reg) return res.status(404).json({ code: 'INVALID_REGISTRATION', error: 'Registration not found or invalid QR token' });
    if (reg.registrationStatus !== 'REGISTERED') return res.status(409).json({ code: 'INVALID_REGISTRATION', error: 'Registration was cancelled or is invalid' });
    
    if (reg.checkInStatus === 'CHECKED_IN') {
      return res.status(409).json({ 
        code: 'ALREADY_CHECKED_IN', 
        error: 'Participant already checked in',
        checkInTime: reg.checkInTime,
        checkedInBy: reg.checkedInBy
      });
    }

    // 2. Atomic update to prevent simultaneous double-scanning
    const updatedReg = await Registration.findOneAndUpdate(
      { _id: reg._id, checkInStatus: 'PENDING' },
      { 
        $set: { 
          checkInStatus: 'CHECKED_IN', 
          checkInTime: new Date(), 
          checkedInBy: req.admin.username 
        } 
      },
      { new: true }
    ).populate('event', 'title');

    if (!updatedReg) {
      // If findOneAndUpdate returns null, someone else checked them in during this millisecond
      return res.status(409).json({ code: 'ALREADY_CHECKED_IN', error: 'Participant was just checked in by another scanner' });
    }

    res.json({
      code: 'ENTRY_ALLOWED',
      message: 'Check-in successful',
      participant: {
        name: updatedReg.participantName,
        email: updatedReg.email,
        registrationId: updatedReg.registrationId,
        eventTitle: updatedReg.event.title
      }
    });

  } catch (err) {
    console.error('QR Verification API Error:', err);
    res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message });
  }
});

// Settings Route
router.put('/settings/join-status', adminAuth, async (req, res) => {
  try {
    const { accepting } = req.body;
    let setting = await Settings.findOne({ key: 'joinAccepting' });
    if (!setting) {
      setting = new Settings({ key: 'joinAccepting', value: accepting });
    } else {
      setting.value = accepting;
    }
    await setting.save();
    res.json({ success: true, accepting: setting.value });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Event Gallery specific routes
router.post('/events/:id/gallery', adminAuth, upload.array('images', 100), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    const newImages = req.files.map(file => `/uploads/${file.filename}`);
    event.gallery = [...(event.gallery || []), ...newImages];
    
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/events/:id/gallery/remove', adminAuth, async (req, res) => {
  try {
    const { imgPath } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    event.gallery = (event.gallery || []).filter(p => p !== imgPath);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
