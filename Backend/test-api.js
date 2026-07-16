/**
 * Goal: Script to perform basic API endpoint testing.
 * Architecture relevance: Acts as a lightweight client to send sample requests to the backend API and verify the responses, helpful for manual verification.
 */
const http = require('http');

const makeRequest = (path, data) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body) }));
    });

    req.on('error', e => reject(e));
    req.write(postData);
    req.end();
  });
};

async function runTests() {
  console.log('--- Testing API Live ---');
  
  // 1. Test Company Validation Failure (Missing website)
  console.log('\\n1. Testing Company validation (missing website)...');
  const badCompanyRes = await makeRequest('/api/auth/register', {
    full_name: 'Test Company User',
    email: 'company1@test.com',
    password: 'Password123',
    confirm_password: 'Password123',
    role: 'company',
    company_name: 'Test Corp',
    industry: 'Tech',
    company_size: '10-50',
    contact_person: 'John Doe'
    // missing website
  });
  console.log('Status:', badCompanyRes.statusCode);
  console.log('Response:', badCompanyRes.body);

  // 2. Test Successful Company Registration
  console.log('\\n2. Testing Successful Company registration...');
  const goodCompanyRes = await makeRequest('/api/auth/register', {
    full_name: 'Test Company User',
    email: 'company2@test.com',
    password: 'Password123',
    confirm_password: 'Password123',
    role: 'company',
    company_name: 'Test Corp',
    industry: 'Tech',
    company_size: '10-50',
    contact_person: 'John Doe',
    website: 'https://testcorp.com'
  });
  console.log('Status:', goodCompanyRes.statusCode);
  console.log('Response:', goodCompanyRes.body);

  // 3. Test Student Registration
  console.log('\\n3. Testing Successful Student registration...');
  const studentRes = await makeRequest('/api/auth/register', {
    full_name: 'Test Student User',
    email: 'student1@test.com',
    password: 'Password123',
    confirm_password: 'Password123',
    role: 'student',
    college: 'Test University',
    degree: 'B.Tech',
    graduation_year: 2025
  });
  console.log('Status:', studentRes.statusCode);
  console.log('Response:', studentRes.body);

  // 4. Test Resend OTP
  console.log('\\n4. Testing Resend OTP for Student...');
  const resendRes = await makeRequest('/api/auth/send-otp', {
    email: 'student1@test.com'
  });
  console.log('Status:', resendRes.statusCode);
  console.log('Response:', resendRes.body);

  console.log('\\n--- Tests Complete ---');
}

// Give the server 2 seconds to connect to Mongo before running tests
setTimeout(runTests, 2000);
