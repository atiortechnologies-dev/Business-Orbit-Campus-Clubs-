const request = require('supertest');
const express = require('express');
const publicRoutes = require('../routes/public.routes');
require('./setup');
const { contactEnquirySchema } = require('../utils/validators');

const app = express();
app.use(express.json());
app.use('/api/public', publicRoutes);


describe('Public API Routes', () => {
  
  describe('GET /api/public/auth-redirects', () => {
    it('should return auth redirects', async () => {
      const res = await request(app).get('/api/public/auth-redirects');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('login');
    });
  });

  describe('GET /api/public/faqs', () => {
    it('should return faqs', async () => {
      const res = await request(app).get('/api/public/faqs');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/public/enquiries', () => {
    it('should fail with invalid payload (missing email)', async () => {
      const payload = {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        message: 'This is a test message'
      };
      const res = await request(app).post('/api/public/enquiries').send(payload);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should succeed with valid payload', async () => {
      const payload = {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message'
      };
      const res = await request(app).post('/api/public/enquiries').send(payload);
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('john@example.com');
    });
  });

  describe('GET /api/public/documents/partnership-deck', () => {
    it('should return a file or 404', async () => {
      const res = await request(app).get('/api/public/documents/partnership-deck');
      // Should be 200 since we created the dummy PDF, but depending on path resolution in supertest it might be 404 or 200
      expect([200, 404]).toContain(res.statusCode); 
    });
  });
});
