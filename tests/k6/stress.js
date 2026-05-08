import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from './common/config.js';
import { login } from './common/auth.js';

export const options = {
  stages: [
    { duration: '2m', target: 50 },  // ramp up to 50 users
    { duration: '5m', target: 50 },  // stay at 50 users
    { duration: '2m', target: 100 }, // ramp up to 100 users
    { duration: '5m', target: 100 }, // stay at 100 users
    { duration: '2m', target: 200 }, // ramp up to 200 users
    { duration: '5m', target: 200 }, // stay at 200 users
    { duration: '5m', target: 0 },   // scale down
  ],
};

export default function () {
  login();

  const res = http.get(`${BASE_URL}/users/coders`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
