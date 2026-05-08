import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, USERS } from './common/config.js';
import { login } from './common/auth.js';

export const options = {
  vus: 1, // 1 virtual user
  duration: '10s', // for 10 seconds
};

export default function () {
  // 1. Health check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health check is status 200': (r) => r.status === 200,
  });

  // 2. Login as Admin
  login(USERS.admin);

  // 3. Admin-only request
  const codersRes = http.get(`${BASE_URL}/users/coders`);
  check(codersRes, {
    'admin can get coders': (r) => r.status === 200,
  });

  // 4. Try logging in as Superadmin
  login(USERS.superadmin);
  const agenciesRes = http.get(`${BASE_URL}/users/agencies`);
  check(agenciesRes, {
    'superadmin can get agencies': (r) => r.status === 200,
  });

  sleep(1);
}
