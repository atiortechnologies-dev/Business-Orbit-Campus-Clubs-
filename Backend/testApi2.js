const http = require('http');

const loginData = JSON.stringify({ email: 'admin@bocc.com', password: 'admin@123' });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const req = http.request(options, (res) => {
  const cookies = res.headers['set-cookie'];
  if (!cookies) {
    console.error("Login failed, no cookies!");
    process.exit(1);
  }
  
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
  console.log("Got cookies");
  
  const getReq = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/users',
    method: 'GET',
    headers: { 'Cookie': cookieHeader }
  }, (res2) => {
    let data = '';
    res2.on('data', d => data += d);
    res2.on('end', () => {
      console.log("/admin/users status:", res2.statusCode);
      console.log(data);
    });
  });
  getReq.end();
});

req.write(loginData);
req.end();
