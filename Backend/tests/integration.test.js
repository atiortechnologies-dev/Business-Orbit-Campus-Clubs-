const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const app = require('../server');

jest.mock('../utils/email', () => ({
  generateOTP: () => '123456',
  sendOTPEmail: jest.fn().mockResolvedValue(true)
}));

process.env.ADMIN_API_KEY = 'testadmin';
process.env.JWT_SECRET = 'testsecret';

let mongoServer;
const testData = [];

// Helper to log test scenes for the narrative report
function logTestScene(journey, sceneDesc, req, res, dbState) {
  testData.push({
    journey,
    sceneDesc,
    req,
    res,
    dbState
  });
}

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const uri = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  await mongoServer.stop();
  
  // Write out the captured data for Phase 3
  const docsDir = path.join(__dirname, '../docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(docsDir, 'test-narrative-data.json'), JSON.stringify(testData, null, 2));
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

describe('Integration Tests & Narrative Capture', () => {

  describe('User Journey: Registration & Authentication', () => {
    it('should register a new student user successfully (Happy Path)', async () => {
      const payload = {
        role: 'student',
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirm_password: 'Password123!',
        college: 'Test University',
        degree: 'B.Tech',
        graduation_year: 2025
      };
      
      const res = await request(app)
        .post('/api/auth/register')
        .send(payload);
        
      const userDoc = await mongoose.connection.collection('users').findOne({ email: 'john@example.com' });
      const otpDoc = await mongoose.connection.collection('emailverifications').findOne({ userId: userDoc?._id });
      const profileDoc = await mongoose.connection.collection('studentprofiles').findOne({ userId: userDoc?._id });
      
      logTestScene(
        'User Onboarding',
        'A student opens the signup form and submits a valid registration request.',
        payload,
        { status: res.status, body: res.body },
        { 
          user: userDoc ? { email: userDoc.email, role: userDoc.role, account_status: userDoc.account_status, email_verified: userDoc.email_verified } : null,
          profileCreated: !!profileDoc,
          otpCreated: !!otpDoc
        }
      );
      
      expect(res.status).toBe(201);
      expect(userDoc).toBeDefined();
      expect(userDoc.account_status).toBe('pending_verification');
    });

    it('should fail registration with invalid data (Validation Failure)', async () => {
      const payload = {
        role: 'student',
        email: 'not-an-email'
      };
      
      const res = await request(app)
        .post('/api/auth/register')
        .send(payload);
        
      const usersCount = await mongoose.connection.collection('users').countDocuments();
      
      logTestScene(
        'User Onboarding',
        'A student submits an invalid email and missing required fields.',
        payload,
        { status: res.status, body: res.body },
        { usersCount }
      );
      
      expect(res.status).toBe(400);
      expect(usersCount).toBe(0);
    });

    it('should verify OTP and activate account (State Transition)', async () => {
      // First, register
      const payload = {
        role: 'student', full_name: 'Jane Doe', email: 'jane@example.com',
        password: 'Password123!', confirm_password: 'Password123!',
        college: 'TU', degree: 'B.Sc', graduation_year: 2024
      };
      await request(app).post('/api/auth/register').send(payload);
      
      // Get the OTP
      const tempUser = await mongoose.connection.collection('users').findOne({ email: 'jane@example.com' });
      const otpDoc = await mongoose.connection.collection('emailverifications').findOne({ userId: tempUser._id });
      
      // Verify
      const verifyPayload = { email: 'jane@example.com', otp: otpDoc.otp };
      const res = await request(app).post('/api/auth/verify-otp').send(verifyPayload);
      
      const userDoc = await mongoose.connection.collection('users').findOne({ email: 'jane@example.com' });
      
      logTestScene(
        'User Onboarding',
        'The student receives an OTP and submits it to verify their account.',
        verifyPayload,
        { status: res.status, body: res.body },
        { user: { email_verified: userDoc.email_verified, account_status: userDoc.account_status } }
      );
      
      expect(res.status).toBe(200);
      expect(userDoc.email_verified).toBe(true);
      expect(userDoc.account_status).toBe('active'); // active because role is student
    });

    it('should login successfully and receive JWT (Happy Path)', async () => {
      // Register & Verify
      const payload = {
        role: 'student', full_name: 'Bob Builder', email: 'bob@example.com',
        password: 'Password123!', confirm_password: 'Password123!',
        college: 'TU', degree: 'B.Sc', graduation_year: 2024
      };
      await request(app).post('/api/auth/register').send(payload);
      const tempUser = await mongoose.connection.collection('users').findOne({ email: 'bob@example.com' });
      const otpDoc = await mongoose.connection.collection('emailverifications').findOne({ userId: tempUser._id });
      await request(app).post('/api/auth/verify-otp').send({ email: 'bob@example.com', otp: otpDoc.otp });
      
      // Login
      const loginPayload = { email: 'bob@example.com', password: 'Password123!' };
      const res = await request(app).post('/api/auth/login').send(loginPayload);
      
      logTestScene(
        'User Login',
        'The verified student logs into the platform.',
        loginPayload,
        { status: res.status, body: { success: res.body.success, hasToken: !!res.body.data?.token } },
        { }
      );
      
      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('should fail login if account is pending_verification (Auth Failure)', async () => {
      // Register but DO NOT verify
      const payload = {
        role: 'student', full_name: 'Alice', email: 'alice@example.com',
        password: 'Password123!', confirm_password: 'Password123!',
        college: 'TU', degree: 'B.Sc', graduation_year: 2024
      };
      await request(app).post('/api/auth/register').send(payload);
      
      // Login
      const loginPayload = { email: 'alice@example.com', password: 'Password123!' };
      const res = await request(app).post('/api/auth/login').send(loginPayload);
      
      logTestScene(
        'User Login',
        'A user attempts to log in before verifying their email.',
        loginPayload,
        { status: res.status, body: res.body },
        { }
      );
      
      expect(res.status).toBe(403);
    });
  });

  describe('User Journey: Admin CMS Management', () => {
    it('should fail to create an FAQ without API key (Auth Failure)', async () => {
      const payload = { question: 'What?', answer: 'This', pageType: 'Student' };
      
      const res = await request(app)
        .post('/api/admin/faqs')
        .send(payload);
        
      const faqsCount = await mongoose.connection.collection('faqs').countDocuments();
      
      logTestScene(
        'Content Management',
        'An unauthorized user attempts to create an FAQ without an API key.',
        payload,
        { status: res.status, body: res.body },
        { faqsCount }
      );
      
      expect(res.status).toBe(401);
    });

    it('should create an FAQ successfully with API key (Happy Path)', async () => {
      const payload = { question: 'What is Business Orbit?', answer: 'A club', pageType: 'Student' };
      
      const res = await request(app)
        .post('/api/admin/faqs')
        .set('x-api-key', 'testadmin')
        .send(payload);
        
      const faqDoc = await mongoose.connection.collection('faqs').findOne({ question: 'What is Business Orbit?' });
      
      logTestScene(
        'Content Management',
        'An admin submits a valid FAQ creation request.',
        payload,
        { status: res.status, body: res.body },
        { faqDoc: faqDoc ? { question: faqDoc.question, pageType: faqDoc.pageType } : null }
      );
      
      expect(res.status).toBe(201);
    });
  });

  describe('User Journey: Public Landing Pages', () => {
    it('should retrieve a list of FAQs', async () => {
      // Seed an FAQ via admin route
      const payload = { question: 'Question 1?', answer: 'Answer 1 is long enough', pageType: 'Student' };
      await request(app).post('/api/admin/faqs').set('x-api-key', 'testadmin').send(payload);
      
      const res = await request(app).get('/api/public/faqs?pageType=Student');
      
      logTestScene(
        'Browsing Landing Pages',
        'A student visits the landing page to view FAQs.',
        { query: { pageType: 'Student' } },
        { status: res.status, body: { success: res.body.success, count: res.body.data.length } },
        { }
      );
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should submit a public enquiry form successfully (Happy Path)', async () => {
      const payload = {
        companyName: 'Test Corp',
        contactPerson: 'Mr. Test',
        email: 'test@corp.com',
        message: 'I want to partner with Business Orbit'
      };
      
      const res = await request(app)
        .post('/api/public/enquiries')
        .send(payload);
        
      const enquiryDoc = await mongoose.connection.collection('contactenquiries').findOne({ email: 'test@corp.com' });
      
      logTestScene(
        'Public Enquiry',
        'A visitor submits a partnership enquiry form.',
        payload,
        { status: res.status, body: res.body },
        { enquiryDoc: enquiryDoc ? { companyName: enquiryDoc.companyName, status: enquiryDoc.status || 'Pending' } : null }
      );
      
      expect(res.status).toBe(201);
      expect(enquiryDoc).toBeDefined();
    });
  });
});
