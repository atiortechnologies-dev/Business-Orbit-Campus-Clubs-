const axios = require('axios');
const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.response.use(res => res, err => {
  console.log("error.config.url is:", err.config.url);
  return Promise.reject(err);
});
api.post('/auth/login').catch(() => {});
