// Smoke test for backend routes
const http = require('http');

async function testEndpoints() {
  const app = require('./dist/index').default;
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(4099, resolve));
  console.log('Test server listening on port 4099');

  const fetchJson = async (path, options = {}) => {
    const res = await fetch(`http://localhost:4099${path}`, options);
    const data = await res.json();
    return { status: res.status, data };
  };

  try {
    // 1. Centers
    const centersRes = await fetchJson('/api/kisan-setu/centers');
    console.log('1. Centers endpoint:', centersRes.status, 'Count:', centersRes.data.count);
    if (centersRes.status !== 200) throw new Error('Failed centers check');

    // 2. Slots
    const slotsRes = await fetchJson('/api/kisan-setu/slots/available?centerId=center-01');
    console.log('2. Slots endpoint:', slotsRes.status, 'Count:', slotsRes.data.count);
    if (slotsRes.status !== 200) throw new Error('Failed slots check');

    // 3. Booking
    const bookingPayload = {
      farmerId: 'farmer-01',
      slotId: 'slot-01',
      vehicleType: 'TRACTOR',
      cropType: 'Wheat (गेहूं)',
      estimatedWeight: 25.5
    };
    const bookingRes = await fetchJson('/api/kisan-setu/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    });
    console.log('3. Booking endpoint:', bookingRes.status, 'Token:', bookingRes.data.data?.token?.tokenHash?.slice(0, 16) + '...');
    if (bookingRes.status !== 201) throw new Error('Failed booking creation');

    const generatedToken = bookingRes.data.data.token.tokenHash;

    // 4. Token verification
    const tokenRes = await fetchJson(`/api/kisan-setu/bookings/token/${generatedToken}`);
    console.log('4. Token verification endpoint:', tokenRes.status, 'Verified:', tokenRes.data.verified, 'Vehicle:', tokenRes.data.data?.vehicleType);
    if (tokenRes.status !== 200 || !tokenRes.data.verified) throw new Error('Failed token verification');

    // 5. All Bookings query (Live Yard Queue table)
    const allBookingsRes = await fetchJson('/api/kisan-setu/bookings');
    console.log('5. All Bookings endpoint:', allBookingsRes.status, 'Count:', allBookingsRes.data.count);
    if (allBookingsRes.status !== 200 || allBookingsRes.data.count < 1) throw new Error('Failed all bookings check');

    // 6. Quality Inspection & Weighbridge Payout Settlement
    const createdBookingId = bookingRes.data.data.booking.id;
    const inspectionPayload = {
      bookingId: createdBookingId,
      moistureLevel: 13.5,
      dockageGrade: 'A',
      approvedWeight: 45.0,
      mspRate: 2275,
      inspectorId: 'OFFICER-TEST-01'
    };
    const inspectionRes = await fetchJson('/api/kisan-setu/inspections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inspectionPayload)
    });
    console.log('6. Quality Inspection endpoint:', inspectionRes.status, 'Total Payout:', inspectionRes.data.data?.receipt?.totalPayout, 'SMS Dispatched:', Boolean(inspectionRes.data.data?.mockSms));
    if (inspectionRes.status !== 200 || !inspectionRes.data.data?.receipt?.totalPayout) throw new Error('Failed quality inspection check');

    console.log('✅ ALL BACKEND ENDPOINT TESTS PASSED SUCCESSFULLY (INCLUDING OFFICER PORTAL ENDPOINTS)!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(process.exitCode || 0);
  }
}

testEndpoints();

