import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';

describe('Admin Authentication and Security', () => {
  let cookies;

  beforeAll(async () => {
    // Connect to test database or existing db
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/enigma_test');
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should fail login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'wrongpassword' });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'admin123' }); // matching our .env setup
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    
    // Save cookies for authenticated requests
    cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
  });

  it('should reject unauthorized CRUD operations (missing JWT)', async () => {
    const res = await request(app)
      .post('/api/admin/members')
      .send({ name: 'Hacker', category: 'Mentors' });
    
    expect(res.statusCode).toEqual(401);
  });

  it('should allow authorized CRUD operations (valid JWT)', async () => {
    const res = await request(app)
      .post('/api/admin/members')
      .set('Cookie', cookies)
      .send({ name: 'Test Member', category: 'Mentors' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    
    // Cleanup
    await request(app).delete(`/api/admin/members/${res.body._id}`).set('Cookie', cookies);
  });

  it('should logout successfully', async () => {
    const res = await request(app).post('/api/admin/logout');
    expect(res.statusCode).toEqual(200);
    const setCookie = res.headers['set-cookie'][0];
    expect(setCookie).toMatch(/adminToken=;/);
  });
});
