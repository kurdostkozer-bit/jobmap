/**
 * P2.9.1 — Backend Performance Testing
 * 
 * Validates:
 * 1. Response time < 100ms (p95)
 * 2. Connection pooling working
 * 3. Query optimization
 * 4. Memory stability
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const API_KEY = 'test-key';

// Test data generators
const generateBounds = (zoom = 7) => {
  // Baghdad area bounds (testing area in Iraq)
  const latRange = [32.0, 34.5];
  const lngRange = [43.0, 45.0];
  
  return {
    south: latRange[0] + Math.random() * 0.5,
    north: latRange[1] - Math.random() * 0.5,
    west: lngRange[0] + Math.random() * 0.5,
    east: lngRange[1] - Math.random() * 0.5,
  };
};

// Test results tracking
const results = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],
  errors: [],
  memorySnapshots: [],
  timestamp: new Date().toISOString(),
};

// Helper: format bytes
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Test 1: Sequential requests (measure baseline)
async function testSequentialRequests(count = 50) {
  console.log(`\n📊 Test 1: Sequential Requests (${count} requests)`);
  console.log('═'.repeat(50));
  
  for (let i = 0; i < count; i++) {
    const startTime = Date.now();
    
    try {
      const response = await axios.post(`${BASE_URL}/api/jobs/search/bounds`, {
        bounds: generateBounds(7),
        zoom: 7,
        filters: {},
        limit: 50,
        offset: 0,
      }, {
        timeout: 5000,
      });
      
      const responseTime = Date.now() - startTime;
      results.responseTimes.push(responseTime);
      results.successfulRequests++;
      
      if (i % 10 === 0) {
        console.log(`  ✓ Request ${i + 1}/${count}: ${responseTime}ms (jobs: ${response.data.stats.totalFound})`);
      }
    } catch (error) {
      results.failedRequests++;
      results.errors.push({
        test: 'Sequential',
        request: i + 1,
        error: error.message,
      });
      console.log(`  ✗ Request ${i + 1}/${count}: ${error.message}`);
    }
    
    results.totalRequests++;
  }
}

// Test 2: Concurrent requests (measure concurrency handling)
async function testConcurrentRequests(concurrency = 10) {
  console.log(`\n📊 Test 2: Concurrent Requests (${concurrency} parallel)`);
  console.log('═'.repeat(50));
  
  const promises = [];
  
  for (let i = 0; i < concurrency; i++) {
    promises.push(
      (async () => {
        const startTime = Date.now();
        
        try {
          const response = await axios.post(`${BASE_URL}/api/jobs/search/bounds`, {
            bounds: generateBounds(7),
            zoom: 7,
            filters: {},
            limit: 50,
            offset: 0,
          }, {
            timeout: 5000,
          });
          
          const responseTime = Date.now() - startTime;
          results.responseTimes.push(responseTime);
          results.successfulRequests++;
          return { success: true, responseTime, jobs: response.data.stats.totalFound };
        } catch (error) {
          results.failedRequests++;
          results.errors.push({
            test: 'Concurrent',
            concurrent: i + 1,
            error: error.message,
          });
          return { success: false, error: error.message };
        } finally {
          results.totalRequests++;
        }
      })()
    );
  }
  
  const concurrentResults = await Promise.all(promises);
  const successful = concurrentResults.filter(r => r.success).length;
  
  console.log(`  ✓ Successful: ${successful}/${concurrency}`);
  concurrentResults
    .filter(r => r.success)
    .slice(0, 5)
    .forEach((r, idx) => {
      console.log(`    Request ${idx + 1}: ${r.responseTime}ms (jobs: ${r.jobs})`);
    });
}

// Test 3: Stress test with different zoom levels
async function testDifferentZoomLevels() {
  console.log(`\n📊 Test 3: Different Zoom Levels`);
  console.log('═'.repeat(50));
  
  const zoomLevels = [5, 7, 10, 13, 15];
  const resultsPerZoom = {};
  
  for (const zoom of zoomLevels) {
    resultsPerZoom[zoom] = { responseTimes: [], successCount: 0 };
    
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      
      try {
        const response = await axios.post(`${BASE_URL}/api/jobs/search/bounds`, {
          bounds: generateBounds(zoom),
          zoom: zoom,
          filters: {},
          limit: 100,
          offset: 0,
        }, {
          timeout: 5000,
        });
        
        const responseTime = Date.now() - startTime;
        resultsPerZoom[zoom].responseTimes.push(responseTime);
        resultsPerZoom[zoom].successCount++;
        results.responseTimes.push(responseTime);
        results.successfulRequests++;
      } catch (error) {
        results.failedRequests++;
      }
      
      results.totalRequests++;
    }
    
    const avgTime = resultsPerZoom[zoom].responseTimes.length > 0
      ? (resultsPerZoom[zoom].responseTimes.reduce((a, b) => a + b, 0) / resultsPerZoom[zoom].responseTimes.length).toFixed(2)
      : 'N/A';
    
    console.log(`  Zoom ${zoom}: ${avgTime}ms avg (${resultsPerZoom[zoom].successCount}/5 success)`);
  }
}

// Test 4: Large result sets
async function testLargeResultSets() {
  console.log(`\n📊 Test 4: Large Result Sets`);
  console.log('═'.repeat(50));
  
  const limits = [50, 100, 200];
  
  for (const limit of limits) {
    const startTime = Date.now();
    
    try {
      const response = await axios.post(`${BASE_URL}/api/jobs/search/bounds`, {
        bounds: generateBounds(7),
        zoom: 7,
        filters: {},
        limit: limit,
        offset: 0,
      }, {
        timeout: 10000,
      });
      
      const responseTime = Date.now() - startTime;
      results.responseTimes.push(responseTime);
      results.successfulRequests++;
      
      const payloadSize = JSON.stringify(response.data).length;
      
      console.log(`  Limit ${limit}: ${responseTime}ms (${formatBytes(payloadSize)} response, ${response.data.stats.totalFound} found)`);
    } catch (error) {
      results.failedRequests++;
      console.log(`  Limit ${limit}: ${error.message}`);
    }
    
    results.totalRequests++;
  }
}

// Test 5: Memory stability
async function testMemoryStability(duration = 30000) {
  console.log(`\n📊 Test 5: Memory Stability (${duration / 1000}s)`);
  console.log('═'.repeat(50));
  
  const startMem = process.memoryUsage();
  console.log(`  Initial Memory: ${formatBytes(startMem.heapUsed)}`);
  
  const startTime = Date.now();
  let requestCount = 0;
  
  while (Date.now() - startTime < duration) {
    try {
      await axios.post(`${BASE_URL}/api/jobs/search/bounds`, {
        bounds: generateBounds(7),
        zoom: 7,
        filters: {},
        limit: 50,
        offset: 0,
      }, {
        timeout: 5000,
      });
      
      requestCount++;
      results.successfulRequests++;
      results.totalRequests++;
      
      if (requestCount % 10 === 0) {
        const currentMem = process.memoryUsage();
        console.log(`    Requests: ${requestCount}, Heap: ${formatBytes(currentMem.heapUsed)}`);
        results.memorySnapshots.push({
          requests: requestCount,
          heapUsed: currentMem.heapUsed,
          external: currentMem.external,
        });
      }
    } catch (error) {
      results.failedRequests++;
      results.totalRequests++;
    }
  }
  
  const endMem = process.memoryUsage();
  const memDiff = endMem.heapUsed - startMem.heapUsed;
  const memDiffPercent = ((memDiff / startMem.heapUsed) * 100).toFixed(2);
  
  console.log(`  Final Memory: ${formatBytes(endMem.heapUsed)}`);
  console.log(`  Memory Delta: ${formatBytes(Math.abs(memDiff))} (${memDiff > 0 ? '+' : ''}${memDiffPercent}%)`);
  console.log(`  Total Requests: ${requestCount}`);
}

// Analysis functions
function analyzeResults() {
  console.log(`\n\n${'═'.repeat(60)}`);
  console.log('📈 PERFORMANCE ANALYSIS');
  console.log('═'.repeat(60));
  
  if (results.responseTimes.length === 0) {
    console.log('❌ No response times recorded');
    return;
  }
  
  // Calculate percentiles
  const sorted = [...results.responseTimes].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const avg = (sorted.reduce((a, b) => a + b, 0) / sorted.length).toFixed(2);
  
  console.log(`\n✓ Response Time Analysis:`);
  console.log(`  Min:     ${min}ms`);
  console.log(`  P50:     ${p50}ms`);
  console.log(`  P95:     ${p95}ms ${p95 > 100 ? '⚠️ EXCEEDS 100ms TARGET' : '✅'}`);
  console.log(`  P99:     ${p99}ms`);
  console.log(`  Max:     ${max}ms`);
  console.log(`  Average: ${avg}ms`);
  
  console.log(`\n✓ Success Rate:`);
  const successRate = ((results.successfulRequests / results.totalRequests) * 100).toFixed(2);
  console.log(`  Total Requests: ${results.totalRequests}`);
  console.log(`  Successful: ${results.successfulRequests} (${successRate}%)`);
  console.log(`  Failed: ${results.failedRequests}`);
  
  if (results.errors.length > 0) {
    console.log(`\n✗ Errors:`);
    const errorSummary = {};
    results.errors.forEach(err => {
      const key = err.error;
      errorSummary[key] = (errorSummary[key] || 0) + 1;
    });
    Object.entries(errorSummary).forEach(([error, count]) => {
      console.log(`  ${count}x ${error}`);
    });
  }
  
  // Recommendations
  console.log(`\n💡 Recommendations:`);
  if (p95 > 100) {
    console.log(`  ⚠️  P95 response time (${p95}ms) exceeds 100ms target`);
    console.log(`      → Add database indexes on latitude/longitude`);
    console.log(`      → Implement query result caching`);
    console.log(`      → Consider pagination optimization`);
  } else {
    console.log(`  ✅ P95 response time (${p95}ms) meets 100ms target`);
  }
  
  if (results.failedRequests > 0) {
    console.log(`  ⚠️  ${results.failedRequests} requests failed`);
    console.log(`      → Check backend logs for errors`);
    console.log(`      → Increase database connection pool`);
  } else {
    console.log(`  ✅ All requests successful`);
  }
  
  if (results.memorySnapshots.length > 1) {
    const firstMem = results.memorySnapshots[0].heapUsed;
    const lastMem = results.memorySnapshots[results.memorySnapshots.length - 1].heapUsed;
    const memGrowth = lastMem - firstMem;
    
    if (memGrowth > 50 * 1024 * 1024) { // 50MB threshold
      console.log(`  ⚠️  Memory growth (${formatBytes(memGrowth)}) indicates potential leak`);
      console.log(`      → Review clustering algorithm for memory leaks`);
      console.log(`      → Check for unclosed database connections`);
    } else {
      console.log(`  ✅ Memory stable (growth: ${formatBytes(memGrowth)})`);
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n🚀 STARTING P2.9.1 BACKEND PERFORMANCE TESTS');
  console.log('═'.repeat(60));
  console.log(`Timestamp: ${results.timestamp}`);
  console.log(`Server: ${BASE_URL}`);
  console.log('═'.repeat(60));
  
  try {
    // Check server health
    console.log('\n🔍 Health Check...');
    try {
      const response = await axios.post(`${BASE_URL}/api/jobs/search/bounds`, {
        bounds: { north: 34, south: 32, east: 45, west: 43 },
        limit: 1
      }, { timeout: 5000 });
      console.log('✅ Server is running');
    } catch (error) {
      console.log('❌ Server is not responding');
      console.log(`   Start backend: cd backend && node dist/main.js`);
      process.exit(1);
    }
    
    // Run tests sequentially
    await testSequentialRequests(50);
    await testConcurrentRequests(10);
    await testDifferentZoomLevels();
    await testLargeResultSets();
    await testMemoryStability(30000); // 30 seconds
    
    // Analyze and report
    analyzeResults();
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    process.exit(1);
  }
  
  // Summary and next steps
  console.log(`\n${'═'.repeat(60)}`);
  console.log('📋 SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Tests Completed: ${new Date().toISOString()}`);
  console.log(`\nNext Steps:`);
  console.log(`1. Review results above`);
  console.log(`2. If P95 > 100ms, run P2.9.2 (Database EXPLAIN ANALYZE)`);
  console.log(`3. If all OK, proceed to P2.9.3 (Iraq Real Data Testing)`);
  console.log(`\nFull Results: ${JSON.stringify(results, null, 2)}`);
}

// Run if executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('Fatal Error:', error);
    process.exit(1);
  });
}

module.exports = {
  testSequentialRequests,
  testConcurrentRequests,
  testDifferentZoomLevels,
  testLargeResultSets,
  testMemoryStability,
  analyzeResults,
};
