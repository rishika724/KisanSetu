import crypto from 'crypto';

export const seedFarmers = [
  {
    id: 'farmer-01',
    aadhaarHash: crypto.createHash('sha256').update('AADHAAR_9876_5432_1098').digest('hex'),
    name: 'रामेश कुमार (Ramesh Kumar)',
    phone: '+91 98765 43210',
    language: 'hi',
    landSize: 4.5,
    locationVillage: 'रनपुर (Ranpur, Kota)'
  },
  {
    id: 'farmer-02',
    aadhaarHash: crypto.createHash('sha256').update('AADHAAR_8765_4321_0987').digest('hex'),
    name: 'बलविंदर सिंह (Balwinder Singh)',
    phone: '+91 98123 45678',
    language: 'hi',
    landSize: 12.0,
    locationVillage: 'नीलोखेड़ी (Nilokheri, Karnal)'
  },
  {
    id: 'farmer-03',
    aadhaarHash: crypto.createHash('sha256').update('AADHAAR_7654_3210_9876').digest('hex'),
    name: 'सुरेश पटेल (Suresh Patel)',
    phone: '+91 97555 23456',
    language: 'hi',
    landSize: 7.2,
    locationVillage: 'बैरसिया (Berasia, Bhopal)'
  }
];

export const seedCenters = [
  {
    id: 'center-01',
    name: 'कोटा कृषि उपज मंडी (Kota Krishi Upaj Mandi)',
    locationLat: 25.18,
    locationLng: 75.83,
    weighbridgeCount: 4,
    hourlyCapacity: 20
  },
  {
    id: 'center-02',
    name: 'करनाल मुख्य अनाज मंडी (Karnal Grain Mandi)',
    locationLat: 29.68,
    locationLng: 76.99,
    weighbridgeCount: 6,
    hourlyCapacity: 35
  },
  {
    id: 'center-03',
    name: 'भोपाल करोंद कृषि मंडी (Bhopal Karond Mandi)',
    locationLat: 23.30,
    locationLng: 77.40,
    weighbridgeCount: 5,
    hourlyCapacity: 25
  }
];

// Helper for dynamic dates starting today
export const getFormattedDate = (offsetDays: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const seedSlots = [
  // Today's slots for Kota Mandi
  {
    id: 'slot-01',
    centerId: 'center-01',
    date: getFormattedDate(0),
    timeWindow: '08:00-09:00',
    maxCapacity: 20,
    bookedCount: 5
  },
  {
    id: 'slot-02',
    centerId: 'center-01',
    date: getFormattedDate(0),
    timeWindow: '09:00-10:00',
    maxCapacity: 20,
    bookedCount: 18
  },
  {
    id: 'slot-03',
    centerId: 'center-01',
    date: getFormattedDate(0),
    timeWindow: '10:00-11:00',
    maxCapacity: 20,
    bookedCount: 8
  },
  {
    id: 'slot-04',
    centerId: 'center-01',
    date: getFormattedDate(0),
    timeWindow: '11:00-12:00',
    maxCapacity: 20,
    bookedCount: 20 // Fully booked slot test case
  },
  // Tomorrow's slots for Kota Mandi
  {
    id: 'slot-05',
    centerId: 'center-01',
    date: getFormattedDate(1),
    timeWindow: '09:00-10:00',
    maxCapacity: 20,
    bookedCount: 2
  },
  {
    id: 'slot-06',
    centerId: 'center-01',
    date: getFormattedDate(1),
    timeWindow: '10:00-11:00',
    maxCapacity: 20,
    bookedCount: 0
  },
  // Today's slots for Karnal Mandi
  {
    id: 'slot-07',
    centerId: 'center-02',
    date: getFormattedDate(0),
    timeWindow: '08:00-09:00',
    maxCapacity: 35,
    bookedCount: 12
  },
  {
    id: 'slot-08',
    centerId: 'center-02',
    date: getFormattedDate(0),
    timeWindow: '09:00-10:00',
    maxCapacity: 35,
    bookedCount: 15
  },
  // Today's slots for Bhopal Mandi
  {
    id: 'slot-09',
    centerId: 'center-03',
    date: getFormattedDate(0),
    timeWindow: '09:00-10:00',
    maxCapacity: 25,
    bookedCount: 4
  },
  {
    id: 'slot-10',
    centerId: 'center-03',
    date: getFormattedDate(0),
    timeWindow: '10:00-11:00',
    maxCapacity: 25,
    bookedCount: 6
  }
];
