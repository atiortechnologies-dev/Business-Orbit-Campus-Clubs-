const axios = require('axios');
const http = require('http');

async function test() {
  try {
    // 1. Login
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'superadmin@atior.tech',
      password: 'AdminPassword123!'
    });
    
    // Get cookies
    const cookies = loginRes.headers['set-cookie'];
    console.log("Cookies received:", cookies);
    
    // 2. Try /admin/overview
    const reqConf = {
      headers: {
        Cookie: cookies.join('; ')
      }
    };
    
    const overviewRes = await axios.get('http://localhost:5000/api/admin/overview', reqConf);
    console.log("Overview Status:", overviewRes.status);
    console.log("Overview Data:", overviewRes.data);
    
  } catch (err) {
    console.error("Error Status:", err.response?.status);
    console.error("Error Data:", err.response?.data);
  }
}
test();
