import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from './common/config.js';
import { login } from './common/auth.js';

export const options = {
  stages: [
    { duration: '1m', target: 20 }, // ramp up to 20 users
    { duration: '2m', target: 20 }, // stay at 20 users
    { duration: '1m', target: 0 },  // ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // less than 1% of requests should fail
  },
};

export default function () {
  // Login once per VU (or every iteration if desired)
  login();

  const requests = {
    'get_coders': {
      method: 'GET',
      url: `${BASE_URL}/users/coders`,
    },
    'get_agencies': {
      method: 'GET',
      url: `${BASE_URL}/users/agencies`,
    },
    'health': {
      method: 'GET',
      url: `${BASE_URL}/health`,
    },
  };

  const responses = http.batch(requests);

  check(responses['get_coders'], {
    'get coders status is 200': (r) => r.status === 200,
  });

  check(responses['get_agencies'], {
    'get agencies status is 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 3 + 2); // Sleep for 2-5 seconds
}
