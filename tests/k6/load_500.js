import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, USERS } from './common/config.js';
import { login } from './common/auth.js';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up
    { duration: '2m', target: 200 }, 
    { duration: '2m', target: 500 }, 
    { duration: '1m', target: 500 }, 
    { duration: '1m', target: 0 },   
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 3s threshold for Render free tier
    http_req_failed: ['rate<0.15'],    // Allow 15% failure under heavy load
  },
};

export default function () {
  // Select user based on VU ID to distribute load between admin and coder
  const user = (__VU % 2 === 0) ? USERS.admin : USERS.coder;
  
  // 1. Login (Cookies are automatically handled by k6 for the VU)
  // We perform login to ensure we have a session for protected routes
  login(user);

  // 2. Batch requests to various endpoints
  const responses = http.batch([
    ['GET', `${BASE_URL}/health`],
    ['GET', `${BASE_URL}/api/users/coders`],
    ['GET', `${BASE_URL}/api/orgs/branding`],
    ['GET', `${BASE_URL}/api/encounters/`],
    ['GET', `${BASE_URL}/api/encounters/stats/performance`],
  ]);

  // 3. Checks
  check(responses[0], {
    'health check status is 200': (r) => r.status === 200,
  });

  if (user === USERS.admin) {
    check(responses[1], {
      'admin can get coders': (r) => r.status === 200,
    });
    check(responses[2], {
      'admin can get branding': (r) => r.status === 200,
    });
  } else {
    check(responses[1], {
      'coder is forbidden from get coders': (r) => r.status === 403,
    });
  }

  check(responses[3], {
    'encounters list accessible': (r) => r.status === 200,
  });

  check(responses[4], {
    'stats accessible': (r) => r.status === 200,
  });

  // Wait 2-4 seconds between iterations to simulate real user behavior
  sleep(Math.random() * 2 + 2);
}
