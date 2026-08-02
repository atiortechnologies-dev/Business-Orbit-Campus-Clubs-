const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@bocc.com',
      password: 'admin@123'
    });
    const cookies = res.headers['set-cookie'];
    
    console.log("Testing /api/admin/users");
    const usersRes = await axios.get('http://localhost:5000/api/admin/users', {
      headers: { Cookie: cookies.join(';') }
    });
    console.log("Users:", usersRes.status);
    
    console.log("Testing /api/admin/chapters");
    const chaptersRes = await axios.get('http://localhost:5000/api/admin/chapters', {
      headers: { Cookie: cookies.join(';') }
    });
    console.log("Chapters:", chaptersRes.status);
  } catch(e) {
    console.error("Error:", e.response ? e.response.status : e.message);
  }
}
test();
