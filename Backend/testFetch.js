async function test() {
  const login = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@bocc.com', password: 'admin@123' })
  });
  const cookie = login.headers.get('set-cookie');
  console.log("Cookie header:", cookie ? "EXISTS" : "NONE");
  
  const users = await fetch('http://localhost:5000/api/admin/users', {
    headers: { 'Cookie': cookie }
  });
  console.log("Users:", users.status, await users.text());
}
test();
