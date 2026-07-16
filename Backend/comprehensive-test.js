/**
 * Goal: Script to run a comprehensive suite of API tests.
 * Architecture relevance: Automates the validation of multiple endpoints (registration, login, profile creation) across various roles to ensure system stability and correctness.
 */
const http = require('http');

const makeRequest = (path, data, method = 'POST') => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: body ? JSON.parse(body) : null }));
    });

    req.on('error', e => reject(e));
    if (data) req.write(postData);
    req.end();
  });
};

async function runComprehensiveTests() {
  console.log('=============================================');
  console.log('       COMPREHENSIVE API TEST SUITE          ');
  console.log('=============================================\n');
  
  let passed = 0;
  let failed = 0;

  const assert = (name, condition, data) => {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${name}`);
      console.log(`   Response data: ${JSON.stringify(data)}`);
      failed++;
    }
  };

  const randomString = Math.random().toString(36).substring(7);

  // 1. ENDPOINT: /api/auth/check-email
  console.log('\\n--- 1. Testing /api/auth/check-email ---');
  
  let res = await makeRequest('/api/auth/check-email', null, 'GET');
  assert('Fails when email query param is missing', res.statusCode === 400, res.body);

  res = await makeRequest('/api/auth/check-email?email=invalidemail', null, 'GET');
  assert('Fails on invalid email format', res.statusCode === 400, res.body);

  res = await makeRequest(`/api/auth/check-email?email=newuser_${randomString}@test.com`, null, 'GET');
  assert('Returns available=true for new email', res.statusCode === 200 && res.body.available === true, res.body);

  // 2. ENDPOINT: /api/auth/register (VALIDATIONS)
  console.log('\\n--- 2. Testing /api/auth/register (Validations) ---');

  const baseUser = {
    full_name: 'Test User',
    email: `student_${randomString}@test.com`,
    password: 'Password123!',
    confirm_password: 'Password123!',
    role: 'student',
    college: 'Test University',
    degree: 'B.Tech',
    graduation_year: 2025
  };

  res = await makeRequest('/api/auth/register', { ...baseUser, password: 'password' });
  assert('Fails on weak password', res.statusCode === 400, res.body);

  res = await makeRequest('/api/auth/register', { ...baseUser, confirm_password: 'Password1234!' });
  assert('Fails on mismatched passwords', res.statusCode === 400, res.body);

  res = await makeRequest('/api/auth/register', { ...baseUser, role: 'invalid_role' });
  assert('Fails on invalid role', res.statusCode === 400, res.body);

  // 3. ENDPOINT: /api/auth/register (ROLES)
  console.log('\\n--- 3. Testing /api/auth/register (Role Submissions) ---');

  // A. Student
  res = await makeRequest('/api/auth/register', { ...baseUser, college: '' });
  assert('Student: Fails when missing college', res.statusCode === 400, res.body);
  
  res = await makeRequest('/api/auth/register', baseUser);
  assert('Student: Successful registration', res.statusCode === 201 && res.body.data.redirect_to === '/welcome-chapter', res.body);

  res = await makeRequest('/api/auth/register', baseUser);
  assert('Student: Fails on duplicate email', res.statusCode === 400, res.body);

  // B. Mentor
  const mentorEmail = `mentor_${randomString}@test.com`;
  res = await makeRequest('/api/auth/register', {
    ...baseUser, email: mentorEmail, role: 'mentor', college: undefined, degree: undefined, graduation_year: undefined,
    organization: 'Tech Corp', designation: 'Senior Engineer', expertise: 'NodeJS', years_of_experience: 10
  });
  assert('Mentor: Successful registration', res.statusCode === 201 && res.body.data.redirect_to === '/email-verification', res.body);

  // C. Investor
  const investorEmail = `investor_${randomString}@test.com`;
  res = await makeRequest('/api/auth/register', {
    ...baseUser, email: investorEmail, role: 'investor', college: undefined, degree: undefined, graduation_year: undefined,
    organization: 'Capital VC', investment_focus: 'AI', investment_stage: 'Seed', profile_url: 'https://linkedin.com/in/investor'
  });
  assert('Investor: Successful registration', res.statusCode === 201, res.body);

  res = await makeRequest('/api/auth/register', {
    ...baseUser, email: `investor2_${randomString}@test.com`, role: 'investor',
    organization: 'Capital VC', investment_focus: 'AI', investment_stage: 'Seed', profile_url: 'not-a-url'
  });
  assert('Investor: Fails on invalid URL format', res.statusCode === 400, res.body);

  // D. Incubator
  const incubatorEmail = `incubator_${randomString}@test.com`;
  res = await makeRequest('/api/auth/register', {
    ...baseUser, email: incubatorEmail, role: 'incubator', college: undefined, degree: undefined, graduation_year: undefined,
    incubator_name: 'Startup Hub', organization: 'University', city: 'San Francisco' // website is optional
  });
  assert('Incubator: Successful registration without optional website', res.statusCode === 201, res.body);

  // E. Company
  const companyEmail = `company_${randomString}@test.com`;
  res = await makeRequest('/api/auth/register', {
    ...baseUser, email: companyEmail, role: 'company', college: undefined, degree: undefined, graduation_year: undefined,
    company_name: 'SaaS Inc', industry: 'Software', company_size: '1-10', contact_person: 'Jane Doe', website: 'https://saas.com'
  });
  assert('Company: Successful registration with website', res.statusCode === 201, res.body);

  res = await makeRequest('/api/auth/register', {
    ...baseUser, email: `company2_${randomString}@test.com`, role: 'company',
    company_name: 'SaaS Inc', industry: 'Software', company_size: '1-10', contact_person: 'Jane Doe' // missing website
  });
  assert('Company: Fails when missing required website', res.statusCode === 400, res.body);

  // 4. ENDPOINT: /api/auth/send-otp
  console.log('\\n--- 4. Testing /api/auth/send-otp ---');

  res = await makeRequest('/api/auth/send-otp', { email: '' });
  assert('Fails on missing email', res.statusCode === 400, res.body);

  res = await makeRequest('/api/auth/send-otp', { email: baseUser.email });
  assert('Successfully generates OTP for valid user', res.statusCode === 200, res.body);

  res = await makeRequest('/api/auth/send-otp', { email: `nonexistent_${randomString}@test.com` });
  assert('Returns 200 silently for nonexistent email (anti-enumeration)', res.statusCode === 200, res.body);

  console.log('\\n=============================================');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================');

  process.exit(failed > 0 ? 1 : 0);
}

runComprehensiveTests();
