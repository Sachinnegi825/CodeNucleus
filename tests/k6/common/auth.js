import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS, USERS } from './config.js';

export function login(user = USERS.admin) {
  const url = `${BASE_URL}/api/auth/login`;
  const payload = JSON.stringify(user);
  const params = {
    headers: DEFAULT_HEADERS,
  };

  const res = http.post(url, payload, params);

  check(res, {
    'login successful': (r) => r.status === 200,
  });

  return res;
}
