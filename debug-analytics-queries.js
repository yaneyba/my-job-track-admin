// Debug script to test the analytics queries directly
const API_BASE_URL = 'https://myjobtrack-api.yeb404974.workers.dev';

async function debugAnalyticsQueries() {
  console.log('🔍 Debugging Analytics SQL Queries...\n');

  try {
    // Step 1: Login to get authentication token
    console.log('1. Getting authentication token...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'analytics@test.com',
        password: 'analytics123'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.error);
      return;
    }

    const token = loginData.token;
    console.log('✅ Token obtained');

    // Step 2: Test analytics without date filters (this works)
    console.log('\n2. Testing analytics without date filters...');
    const noFiltersResponse = await fetch(`${API_BASE_URL}/api/analytics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (noFiltersResponse.ok) {
      const data = await noFiltersResponse.json();
      console.log('✅ No filters works - got data with', data.overview.totalSessions, 'sessions');
    } else {
      console.log('❌ No filters failed:', noFiltersResponse.status);
    }

    // Step 3: Test individual endpoints with date filters
    console.log('\n3. Testing individual endpoints with date filters...');
    
    const endpoints = ['overview', 'sessions', 'events', 'features', 'funnels'];
    const dateParams = '?startDate=2025-06-09&endDate=2025-07-09';

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/analytics/${endpoint}${dateParams}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          console.log(`   ✅ ${endpoint} - OK`);
        } else {
          const errorText = await response.text();
          console.log(`   ❌ ${endpoint} - ${response.status}: ${errorText}`);
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint} - Error: ${error.message}`);
      }
    }

    // Step 4: Test with different date formats
    console.log('\n4. Testing different date formats...');
    
    const dateFormats = [
      '?startDate=2025-06-09&endDate=2025-07-09',
      '?startDate=2025-06-09T00:00:00Z&endDate=2025-07-09T23:59:59Z',
      '?startDate=2025-06-09T00:00:00.000Z&endDate=2025-07-09T23:59:59.999Z'
    ];

    for (const dateFormat of dateFormats) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/analytics/overview${dateFormat}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          console.log(`   ✅ Format: ${dateFormat}`);
        } else {
          console.log(`   ❌ Format: ${dateFormat} - ${response.status}`);
        }
      } catch (error) {
        console.log(`   ❌ Format: ${dateFormat} - Error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugAnalyticsQueries();
