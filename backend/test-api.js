const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  console.log('\n🧪 Testing KJF Platform Backend APIs\n');

  try {
    // 1. Health Check
    console.log('1️⃣  Testing GET /api/health');
    let res = await makeRequest('GET', '/api/health');
    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${JSON.stringify(res.body)}\n`);

    // 2. Register
    console.log('2️⃣  Testing POST /api/auth/register');
    const registerData = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'seeker',
    };
    res = await makeRequest('POST', '/api/auth/register', registerData);
    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${JSON.stringify(res.body, null, 2)}\n`);

    const token = res.body?.accessToken;
    if (!token) {
      console.log('❌ Registration failed - no token received\n');
      return;
    }

    // 3. Login
    console.log('3️⃣  Testing POST /api/auth/login');
    const loginData = {
      email: 'test@example.com',
      password: 'TestPassword123!',
    };
    res = await makeRequest('POST', '/api/auth/login', loginData);
    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${JSON.stringify(res.body, null, 2)}\n`);

    const loginToken = res.body?.accessToken;
    if (!loginToken) {
      console.log('❌ Login failed\n');
      return;
    }

    // 4. Get Profile
    console.log('4️⃣  Testing GET /api/auth/me (with token)');
    const profileOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginToken}`,
      },
    };

    res = await new Promise((resolve, reject) => {
      const req = http.request(profileOptions, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, body: body });
          }
        });
      });
      req.on('error', reject);
      req.end();
    });

    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${JSON.stringify(res.body, null, 2)}\n`);

    console.log('✅ ALL TESTS COMPLETED\n');
  } catch (err) {
    console.error('❌ Test error:', err.message);
  }
}

test();
