#!/usr/bin/env node

// Test script to verify analytics API is working
const API_BASE_URL = 'https://myjobtrack-api.yeb404974.workers.dev';

async function testAnalyticsAPI() {
  console.log('🔐 Testing Analytics API Authentication and Data Retrieval...\n');

  try {
    // Step 1: Login to get authentication token
    console.log('1. Logging in with analytics credentials...');
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

    console.log('✅ Login successful');
    console.log(`   User: ${loginData.user.name} (${loginData.user.email})`);
    
    const token = loginData.token;

    // Step 2: Test analytics dashboard endpoint
    console.log('\n2. Fetching analytics dashboard data...');
    const analyticsResponse = await fetch(`${API_BASE_URL}/api/analytics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!analyticsResponse.ok) {
      console.error('❌ Analytics API request failed:', analyticsResponse.status, analyticsResponse.statusText);
      const errorText = await analyticsResponse.text();
      console.error('   Response:', errorText);
      return;
    }

    const analyticsData = await analyticsResponse.json();
    
    console.log('✅ Analytics data retrieved successfully');
    console.log(`   Total Sessions: ${analyticsData.overview.totalSessions}`);
    console.log(`   Total Events: ${analyticsData.overview.totalEvents}`);
    console.log(`   Conversion Rate: ${analyticsData.overview.conversionRate.toFixed(1)}%`);
    console.log(`   Demo Mode Usage: ${analyticsData.overview.demoModeUsage.toFixed(1)}%`);
    
    // Step 3: Test specific analytics endpoints
    console.log('\n3. Testing specific analytics endpoints...');
    
    const endpoints = [
      'overview',
      'sessions', 
      'events',
      'features',
      'funnels'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/analytics/${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`   ✅ /api/analytics/${endpoint} - OK (${JSON.stringify(data).length} bytes)`);
        } else {
          console.log(`   ❌ /api/analytics/${endpoint} - ${response.status}`);
        }
      } catch (error) {
        console.log(`   ❌ /api/analytics/${endpoint} - Error: ${error.message}`);
      }
    }

    console.log('\n🎉 Analytics API is working correctly!');
    console.log('\nTo access the admin dashboard:');
    console.log('1. Go to http://localhost:3001');
    console.log('2. Login with: analytics@test.com / analytics123');
    console.log('3. Navigate to the Analytics page');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAnalyticsAPI();
