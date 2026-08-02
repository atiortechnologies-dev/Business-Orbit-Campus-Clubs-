const http = require('http');

async function test() {
  const login = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@bocc.com', password: 'admin@123' })
  });
  const cookie = login.headers.get('set-cookie');
  
  const chapters = await fetch('http://localhost:5001/api/admin/chapters', {
    headers: { 'Cookie': cookie }
  });
  console.log("Chapters:", chapters.status, await chapters.text());
}

setTimeout(test, 3000);
