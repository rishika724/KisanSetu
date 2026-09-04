const {
  calculateAvailableCapacity,
  updateFarmerQueueState,
  generateKisanSetuOfflineToken,
  UNLOADING_DURATIONS_MINUTES
} = require('./dist/services/kisanSetuQueueEngine');

async function runQueueEngineTests() {
  console.log('--- Testing Kisan Setu Dynamic Queue Engine ---');

  // 1. Check Unloading Benchmarks
  console.log('1. Unloading Benchmarks:');
  console.log('   Bullock Cart:', UNLOADING_DURATIONS_MINUTES.BULLOCK_CART, 'mins');
  console.log('   Tractor:', UNLOADING_DURATIONS_MINUTES.TRACTOR, 'mins');
  console.log('   Truck:', UNLOADING_DURATIONS_MINUTES.TRUCK, 'mins');
  if (
    UNLOADING_DURATIONS_MINUTES.BULLOCK_CART !== 25 ||
    UNLOADING_DURATIONS_MINUTES.TRACTOR !== 15 ||
    UNLOADING_DURATIONS_MINUTES.TRUCK !== 10
  ) {
    throw new Error('Unloading duration constants mismatch!');
  }

  // 2. Capacity & Queue Engine Test
  console.log('\n2. Testing calculateAvailableCapacity(centerId, date, timeWindow):');
  const today = new Date().toISOString().split('T')[0];
  const cap = await calculateAvailableCapacity('center-01', today, '08:00-09:00');
  console.log('   Center:', cap.centerName);
  console.log('   Weighbridges:', cap.weighbridgeCount);
  console.log('   Total Capacity Minutes:', cap.totalWeighbridgeMinutes);
  console.log('   Used Minutes:', cap.usedMinutes);
  console.log('   Remaining Minutes:', cap.remainingMinutes);
  console.log('   Utilization:', cap.utilizationPercentage + '%');
  console.log('   Congestion Level:', cap.congestionLevel);
  console.log('   Can Accept Bullock Cart (25m)?', cap.canAcceptVehicle.BULLOCK_CART);
  console.log('   Can Accept Tractor (15m)?', cap.canAcceptVehicle.TRACTOR);
  console.log('   Can Accept Truck (10m)?', cap.canAcceptVehicle.TRUCK);

  // 3. Geofenced Buffer Staging Engine Test
  console.log('\n3. Testing updateFarmerQueueState (Geofenced Buffer):');
  const centerLat = 25.18;
  const centerLng = 75.83;

  // Test Case A: Farmer 15 km away -> Should be BOOKED (At Home)
  const stateHome = updateFarmerQueueState(25.30, 75.90, centerLat, centerLng);
  console.log(`   [Distance: ${stateHome.distanceKm} km] -> State: ${stateHome.status} (Stage ${stateHome.stageIndex})`);
  if (stateHome.status !== 'BOOKED' || stateHome.stageIndex !== 0) {
    throw new Error('Geofence test failed for >5km (Expected BOOKED)');
  }

  // Test Case B: Farmer 2.5 km away -> Should be STAGING (In Buffer Yard)
  // 0.02 deg lat difference is roughly 2.2 km
  const stateBuffer = updateFarmerQueueState(25.20, 75.83, centerLat, centerLng);
  console.log(`   [Distance: ${stateBuffer.distanceKm} km] -> State: ${stateBuffer.status} (Stage ${stateBuffer.stageIndex})`);
  if (stateBuffer.status !== 'STAGING' || stateBuffer.stageIndex !== 1) {
    throw new Error('Geofence test failed for 500m-5km (Expected STAGING)');
  }

  // Test Case C: Farmer 200m away -> Should be MANDI_GATE (Ready for scanning)
  // 0.001 deg lat difference is roughly 110 meters
  const stateGate = updateFarmerQueueState(25.181, 75.83, centerLat, centerLng);
  console.log(`   [Distance: ${stateGate.distanceKm} km / ${stateGate.distanceMeters}m] -> State: ${stateGate.status} (Stage ${stateGate.stageIndex})`);
  if (stateGate.status !== 'MANDI_GATE' || stateGate.stageIndex !== 2) {
    throw new Error('Geofence test failed for <500m (Expected MANDI_GATE)');
  }

  // 4. Offline Cryptographic Token Generator Test
  console.log('\n4. Testing generateKisanSetuOfflineToken:');
  const tokenObj = generateKisanSetuOfflineToken('farmer-01', 'slot-01', 1725380000000);
  console.log('   Token Hash (SHA-256):', tokenObj.tokenHash);
  console.log('   Offline Short String:', tokenObj.offlineString);
  console.log('   QR Payload length:', tokenObj.qrPayload.length);
  if (tokenObj.tokenHash.length !== 64 || !tokenObj.tokenHash.match(/^[0-9A-F]{64}$/)) {
    throw new Error('Invalid SHA-256 token hash format');
  }

  console.log('\n✅ ALL QUEUE ENGINE & GEOFENCE TESTS PASSED SUCCESSFULLY!');
}

runQueueEngineTests().catch((e) => {
  console.error('❌ Test failed:', e);
  process.exit(1);
});
