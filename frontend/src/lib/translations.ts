export type Language =
  | 'en'
  | 'hi'
  | 'pa'
  | 'mr'
  | 'te'
  | 'ta'
  | 'bn'
  | 'gu'
  | 'kn';

export interface TranslationDict {
  brandName: string;
  brandTagline: string;
  langSwitchLabel: string;
  activeLanguage: string;
  roleSwitcher: {
    farmer: string;
    admin: string;
    farmerDesc: string;
    adminDesc: string;
  };
  farmerRegistration: {
    title: string;
    subtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    farmerId: string;
    regenerateId: string;
    mobile: string;
    mobilePlaceholder: string;
    requestOtp: string;
    verifyOtp: string;
    otpLabel: string;
    otpHint: string;
    verified: string;
    village: string;
    villageSelect: string;
    customVillage: string;
    crop: string;
    quantity: string;
    quantityUnit: string;
    vehicle: string;
    loginSuccess: string;
    continueBooking: string;
    validationError: string;
    demoProfilesTitle: string;
  };
  crops: {
    PADDY: string;
    WHEAT: string;
    MAIZE: string;
    RED_GRAM: string;
    BENGAL_GRAM: string;
    GREEN_GRAM: string;
    GROUNDNUT: string;
    SOYBEAN: string;
    SOYABEAN?: string;
    MUSTARD?: string;
    COTTON?: string;
    PULSES?: string;
  };
  cropDescriptions: {
    PADDY: string;
    WHEAT: string;
    MAIZE: string;
    RED_GRAM: string;
    BENGAL_GRAM: string;
    GREEN_GRAM: string;
    GROUNDNUT: string;
    SOYBEAN: string;
    SOYABEAN?: string;
    MUSTARD?: string;
    COTTON?: string;
    PULSES?: string;
  };
  vehicles: {
    TRACTOR: string;
    TRUCK: string;
    MINI_TRUCK: string;
    BULLOCK_CART: string;
    LARGE_TRUCK?: string;
  };
  vehicleUnloadTimes: {
    TRACTOR: string;
    TRUCK: string;
    MINI_TRUCK: string;
    BULLOCK_CART: string;
    LARGE_TRUCK?: string;
  };
  centerStatus: {
    open: string;
    busy: string;
    closed: string;
  };
  centerDetails: {
    currentQueue: string;
    estimatedWaiting: string;
    availableSlots: string;
    location: string;
    selectCenter: string;
    selected: string;
    vehiclesWaiting: string;
    minsWait: string;
    slotsOpenToday: string;
  };
  farmerIntake: {
    centerTitle: string;
    centerSubtitle: string;
    cropTitle: string;
    cropSubtitle: string;
    detailsTitle: string;
    detailsSubtitle: string;
    demoStar: string;
    selectedCropLabel: string;
    quantityLabel: string;
    quantityUnit: string;
    vehicleLabel: string;
    confirmBookingBtn: string;
    bookingNotice: string;
  };
  booking: {
    step1Title: string;
    step1Subtitle: string;
    step2Title: string;
    step2Subtitle: string;
    step3Title: string;
    step3Subtitle: string;
    stepIndicator: string;
    nextStep: string;
    prevStep: string;
    quickAdd: string;
    selectCenter: string;
    selectDate: string;
    selectSlot: string;
    slotsAvailable: string;
    capacityBadges: {
      available: string;
      moderate: string;
      full: string;
    };
    submitBooking: string;
    submitting: string;
    bookingSuccess: string;
    bookingError: string;
    summaryTitle: string;
    spotsLeft: string;
    booked: string;
  };
  digitalPass: {
    title: string;
    subtitle: string;
    tokenNumber: string;
    tokenHash: string;
    farmerName: string;
    farmerId: string;
    village: string;
    center: string;
    date: string;
    timeSlot: string;
    crop: string;
    quantity: string;
    vehicle: string;
    status: string;
    statusValues: {
      BOOKED: string;
      STAGING: string;
      MANDI_GATE: string;
      INSPECTION: string;
      COMPLETED: string;
    };
    downloadPass: string;
    printPass: string;
    sharePass: string;
    offlineBadge: string;
    offlineNotice: string;
    noPassFound: string;
    noPassDesc: string;
    bookSlotNow: string;
  };
  queueTracker: {
    title: string;
    subtitle: string;
    yourPosition: string;
    vehiclesAhead: string;
    estimatedWaitTime: string;
    minutes: string;
    assignedLane: string;
    currentStage: string;
    stages: {
      booked: { title: string; desc: string };
      staging: { title: string; desc: string };
      gate: { title: string; desc: string };
      inspection: { title: string; desc: string };
      completed: { title: string; desc: string };
    };
    distanceSimulator: {
      title: string;
      desc: string;
      home: string;
      buffer: string;
      gate: string;
    };
  };
  notifications: {
    title: string;
    noNotifications: string;
    markAllRead: string;
    dismiss: string;
    notifBookingTitle: string;
    notifBookingMsg: string;
    notifGateCheckinTitle: string;
    notifGateCheckinMsg: string;
    notifInspectionTitle: string;
    notifInspectionMsg: string;
    notifBreakdownTitle: string;
    notifBreakdownMsg: string;
    notifEmergencyTitle: string;
    notifEmergencyMsg: string;
    notifTrafficTitle: string;
    notifTrafficMsg: string;
  };
  adminDashboard: {
    title: string;
    subtitle: string;
    liveOverview: string;
    gateScanner: string;
    queueControl: string;
    weighingInspection: string;
    metrics: {
      dailyTokens: string;
      activeQueue: string;
      mandiCapacity: string;
      activeWeighbridges: string;
      completedProcurement: string;
      totalDisbursed: string;
    };
    scanner: {
      title: string;
      subtitle: string;
      cameraScanner: string;
      cameraStandby: string;
      startCamera: string;
      stopCamera: string;
      scanWebcamBtn: string;
      simulateScanBtn: string;
      manualInputPlaceholder: string;
      verifyTokenBtn: string;
      quickTestBtn: string;
      verifying: string;
      verifiedSuccess: string;
      invalidToken: string;
      admitVehicle: string;
      assignedLane: string;
      cameraInstructions: string;
      simulationRunning: string;
    };
    queueManagement: {
      title: string;
      subtitle: string;
      emergencyLaneToggle: string;
      breakdownModeToggle: string;
      trafficRerouteToggle: string;
      rerouteGateLabel: string;
      active: string;
      inactive: string;
      callNext: string;
      prioritize: string;
      tableHeaders: {
        token: string;
        farmer: string;
        vehicle: string;
        cropQuantity: string;
        timeSlot: string;
        status: string;
        actions: string;
      };
    };
    weighingForm: {
      title: string;
      subtitle: string;
      selectToken: string;
      qualityScore: string;
      moistureLevel: string;
      moistureUnit: string;
      dockageGrade: string;
      foreignMatter: string;
      grossWeight: string;
      tareWeight: string;
      netWeight: string;
      mspRate: string;
      moisturePenalty: string;
      netPayout: string;
      weightUnit: string;
      approveAndIssue: string;
      approvedSuccess: string;
      selectPrompt: string;
    };
  };
  common: {
    quintal: string;
    kg: string;
    rupees: string;
    verified: string;
    pending: string;
    close: string;
    active: string;
    inactive: string;
    helpline: string;
    allRightsReserved: string;
  };
  weatherInsights: {
    title: string;
    subtitle: string;
    tabTitle: string;
    temperature: string;
    feelsLike: string;
    rainForecast: string;
    windSpeed: string;
    humidity: string;
    uvIndex: string;
    pressure: string;
    rainAlertTitle: string;
    rainAlertMsg: string;
    heatAlertTitle: string;
    heatAlertMsg: string;
    advisoryHeader: string;
    locationLabel: string;
    conditionNames: {
      sunny: string;
      thunderstorm: string;
      rainy: string;
      cloudy: string;
      highHeat: string;
      highWind: string;
    };
    severities: {
      critical: string;
      warning: string;
      info: string;
    };
    rainAlert: {
      title: string;
      message: string;
      action: string;
    };
    heatAlert: {
      title: string;
      message: string;
      action: string;
    };
    windAlert: {
      title: string;
      message: string;
      action: string;
    };
    procurementAlert: {
      title: string;
      message: string;
      action: string;
    };
    tarpaulinAlert: {
      title: string;
      message: string;
      action: string;
    };
    favorableCondition: {
      title: string;
      message: string;
      action: string;
    };
    simulation: {
      title: string;
      subtitle: string;
      scenarios: {
        rain: string;
        heat: string;
        wind: string;
        mandiRain: string;
        favorable: string;
      };
      activeScenario: string;
    };
    hourlyForecast: {
      title: string;
      now: string;
    };
    logisticsImpact: {
      title: string;
      appointmentNotice: string;
      vehicleNotice: string;
      viewCenterStatus: string;
    };
    viewFullDashboard: string;
  };
  stages8: {
    slotBooked: string;
    gateCheckin: string;
    qualityTesting: string;
    grossWeighing: string;
    unloading: string;
    tareWeighing: string;
    procurement: string;
    digitalReceipt: string;
  };
  adminMetricsBanner: {
    totalBookings: string;
    checkedIn: string;
    waiting: string;
    processing: string;
    completed: string;
    delayed: string;
  };
  gateCheckInModal: {
    title: string;
    subtitle: string;
    farmerName: string;
    farmerId: string;
    crop: string;
    quantity: string;
    vehicle: string;
    timeSlot: string;
    checkInAction: string;
    successMessage: string;
  };
  digitalReceipt: {
    title: string;
    subtitle: string;
    receiptId: string;
    tokenNumber: string;
    farmerName: string;
    farmerId: string;
    village: string;
    crop: string;
    dockageGrade: string;
    moistureLevel: string;
    foreignMatter: string;
    grossWeight: string;
    tareWeight: string;
    netWeight: string;
    mspRate: string;
    moistureDeduction: string;
    totalPayable: string;
    paymentStatus: string;
    dbtStatus: string;
    downloadPdf: string;
    printReceipt: string;
    closeReceipt: string;
    viewReceipt: string;
    previewReceipt: string;
    receiptNotice: string;
    disbursementTime: string;
    weighbridgeSlip: string;
    govtSeal: string;
    verifiedSignature: string;
    centerLabel: string;
    slotLabel: string;
  };
  voiceAssistant: {
    assistantTitle: string;
    assistantSubtitle: string;
    listening: string;
    speaking: string;
    ready: string;
    notSupported: string;
    micPermissionDenied: string;
    commandsTitle: string;
    cmdBookSlot: string;
    cmdCheckQueue: string;
    cmdReadWeather: string;
    cmdDigitalPass: string;
    cmdStartGuided: string;
    playAudio: string;
    stopAudio: string;
    guidedTitle: string;
    guidedStep1: string;
    guidedStep2: string;
    guidedStep3: string;
    guidedConfirm: string;
    guidedRestart: string;
    voiceDictation: string;
    quickCommands: string;
    recognizedText: string;
  };
}

// 1. ENGLISH
const en: TranslationDict = {
  brandName: 'Kisan Setu',
  brandTagline: 'Digital Agricultural Procurement Platform',
  langSwitchLabel: 'Select Language',
  activeLanguage: 'English',
  roleSwitcher: {
    farmer: 'Farmer App',
    admin: 'Admin Dashboard',
    farmerDesc: 'Registration, Slot Booking & Live Queue Pass',
    adminDesc: 'Mandi Gate Scanner, Yard Queue & Weighbridge Operations'
  },
  farmerRegistration: {
    title: 'Farmer Registration and Verification',
    subtitle: 'Enter your basic details to book an arrival slot at the procurement center.',
    fullName: 'Farmer Full Name',
    fullNamePlaceholder: 'Enter your full name',
    farmerId: 'Farmer ID',
    regenerateId: 'Generate New ID',
    mobile: 'Mobile Number',
    mobilePlaceholder: 'Enter 10-digit mobile number',
    requestOtp: 'Send OTP',
    verifyOtp: 'Verify OTP',
    otpLabel: 'Verification Code',
    otpHint: 'Prototype Verification Code: 123456',
    verified: 'Verified',
    village: 'Village',
    villageSelect: 'Select Village',
    customVillage: 'Other Village',
    crop: 'Primary Crop',
    quantity: 'Approximate Quantity',
    quantityUnit: 'Quintals',
    vehicle: 'Vehicle Type',
    loginSuccess: 'Farmer profile verified successfully.',
    continueBooking: 'Proceed to Slot Booking',
    validationError: 'Please fill in all mandatory fields with valid information.',
    demoProfilesTitle: 'Quick Prototype Profiles'
  },
  crops: {
    PADDY: 'Paddy',
    WHEAT: 'Wheat',
    MAIZE: 'Maize',
    RED_GRAM: 'Red Gram',
    BENGAL_GRAM: 'Bengal Gram',
    GREEN_GRAM: 'Green Gram',
    GROUNDNUT: 'Groundnut',
    SOYBEAN: 'Soybean',
    SOYABEAN: 'Soybean',
    MUSTARD: 'Mustard',
    COTTON: 'Cotton',
    PULSES: 'Pulses'
  },
  cropDescriptions: {
    PADDY: 'Kharif staple harvest',
    WHEAT: 'Rabi primary grain',
    MAIZE: 'Coarse food grain',
    RED_GRAM: 'Pigeon pea protein harvest',
    BENGAL_GRAM: 'Chickpea pulse crop',
    GREEN_GRAM: 'Moong bean pulse',
    GROUNDNUT: 'Rich edible oilseed produce',
    SOYBEAN: 'High-protein commercial oilseed',
    SOYABEAN: 'High-protein commercial oilseed',
    MUSTARD: 'Oilseed winter produce',
    COTTON: 'Cash crop fiber harvest',
    PULSES: 'Gram, Lentils, and Moong'
  },
  vehicles: {
    TRACTOR: 'Tractor/Trolley',
    TRUCK: 'Truck',
    MINI_TRUCK: 'Mini Truck',
    BULLOCK_CART: 'Bullock Cart',
    LARGE_TRUCK: 'Large Commercial Truck'
  },
  vehicleUnloadTimes: {
    TRACTOR: '15 min unloading',
    TRUCK: '10 min unloading',
    MINI_TRUCK: '12 min unloading',
    BULLOCK_CART: '25 min unloading',
    LARGE_TRUCK: '10 min unloading'
  },
  centerStatus: {
    open: 'Open',
    busy: 'Busy',
    closed: 'Closed'
  },
  centerDetails: {
    currentQueue: 'Current Queue',
    estimatedWaiting: 'Estimated Waiting Time',
    availableSlots: 'Available Slots',
    location: 'Location',
    selectCenter: 'Select Procurement Center',
    selected: 'Selected Center',
    vehiclesWaiting: 'Vehicles waiting',
    minsWait: 'Mins',
    slotsOpenToday: 'Slots Open Today'
  },
  farmerIntake: {
    centerTitle: '1. Select Procurement Center',
    centerSubtitle: 'Choose where to sell your harvest based on live queues and waiting time.',
    cropTitle: '2. Select Crop',
    cropSubtitle: 'Pick your primary harvest. Paddy is highlighted for prototype demonstration.',
    detailsTitle: '3. Quantity and Vehicle Details',
    detailsSubtitle: 'Confirm crop volume and select your transport mode for gate entry.',
    demoStar: 'Demo Highlight',
    selectedCropLabel: 'Selected Crop',
    quantityLabel: 'Quantity (in quintals)',
    quantityUnit: 'Quintals',
    vehicleLabel: 'Vehicle Selection',
    confirmBookingBtn: 'Confirm Center and Generate Digital Pass',
    bookingNotice: 'Verified digital token pass with scannable QR will be issued immediately.'
  },
  booking: {
    step1Title: '1. Crop Details and Weight',
    step1Subtitle: 'Confirm your crop and estimated volume in quintals.',
    step2Title: '2. Procurement Center and Slot',
    step2Subtitle: 'Choose your nearest Mandi and arrival time window.',
    step3Title: '3. Vehicle and Transport',
    step3Subtitle: 'Select your transport mode for weighbridge turnaround time.',
    stepIndicator: 'Step',
    nextStep: 'Continue',
    prevStep: 'Back',
    quickAdd: 'Quick Add:',
    selectCenter: 'Select Procurement Center',
    selectDate: 'Scheduled Arrival Date',
    selectSlot: 'Available Time Window',
    slotsAvailable: 'slots open',
    capacityBadges: {
      available: 'Available',
      moderate: 'Moderate',
      full: 'Full'
    },
    submitBooking: 'Confirm Booking and Generate Pass',
    submitting: 'Generating Pass...',
    bookingSuccess: 'Booking confirmed. Your digital token pass has been generated.',
    bookingError: 'Booking failed. Please check slot availability.',
    summaryTitle: 'Booking Summary',
    spotsLeft: 'spots left',
    booked: 'Booked'
  },
  digitalPass: {
    title: 'Digital Mandi Entry Pass',
    subtitle: 'This pass is cached on your device and valid offline at the Mandi gate.',
    tokenNumber: 'Token Number',
    tokenHash: 'Cryptographic Hash',
    farmerName: 'Farmer Name',
    farmerId: 'Farmer ID',
    village: 'Village',
    center: 'Procurement Center',
    date: 'Arrival Date',
    timeSlot: 'Time Slot',
    crop: 'Produce',
    quantity: 'Quantity',
    vehicle: 'Vehicle',
    status: 'Current Status',
    statusValues: {
      BOOKED: 'Booked',
      STAGING: 'Buffer Yard',
      MANDI_GATE: 'Gate Admitted',
      INSPECTION: 'Under Weighing',
      COMPLETED: 'Completed'
    },
    downloadPass: 'Download Pass',
    printPass: 'Print Pass',
    sharePass: 'Share Pass',
    offlineBadge: 'Offline Ready',
    offlineNotice: 'Gate staff can scan and verify this QR code without internet connectivity.',
    noPassFound: 'No Active Pass Found',
    noPassDesc: 'You do not have any active booking pass at the moment.',
    bookSlotNow: 'Book a Slot Now'
  },
  queueTracker: {
    title: 'Live Queue Progress Tracker',
    subtitle: 'Real-time vehicle position and progress updates from departure to payment.',
    yourPosition: 'Your Queue Position',
    vehiclesAhead: 'Vehicles Ahead of You',
    estimatedWaitTime: 'Estimated Wait Time',
    minutes: 'minutes',
    assignedLane: 'Assigned Weighbridge Lane',
    currentStage: 'Active Stage',
    stages: {
      booked: {
        title: '1. Booked',
        desc: 'Slot confirmed. Prepare your produce for transport.'
      },
      staging: {
        title: '2. Buffer Yard',
        desc: 'Holding yard near Mandi. Waiting for gate call.'
      },
      gate: {
        title: '3. Gate Check-in',
        desc: 'QR token verified. Admitted into the procurement yard.'
      },
      inspection: {
        title: '4. Quality and Weighing',
        desc: 'Sample grading, tare and gross weighbridge measurement.'
      },
      completed: {
        title: '5. Completed',
        desc: 'Final weigh slip issued. Payout processed via direct bank transfer.'
      }
    },
    distanceSimulator: {
      title: 'GPS Distance Simulator',
      desc: 'Simulate vehicle travel distance to view dynamic queue stage transitions.',
      home: 'Home Location (12 km)',
      buffer: 'Buffer Yard (2 km)',
      gate: 'Mandi Gate (200 m)'
    }
  },
  notifications: {
    title: 'Notifications and Alerts',
    noNotifications: 'No alerts at the moment.',
    markAllRead: 'Mark all as read',
    dismiss: 'Dismiss',
    notifBookingTitle: 'Slot Booked Successfully',
    notifBookingMsg: 'Your arrival slot is confirmed. Digital pass is ready.',
    notifGateCheckinTitle: 'Gate Check-in Confirmed',
    notifGateCheckinMsg: 'Your QR token was scanned at the gate. Please proceed to your assigned lane.',
    notifInspectionTitle: 'Quality and Weighing Completed',
    notifInspectionMsg: 'Produce graded and weighed. Final payment receipt generated.',
    notifBreakdownTitle: 'Traffic Notice: Weighbridge Maintenance',
    notifBreakdownMsg: 'Equipment maintenance in progress. Vehicles redirected to alternate gate.',
    notifEmergencyTitle: 'Priority Lane Active',
    notifEmergencyMsg: 'Emergency priority lane enabled for swift movement.',
    notifTrafficTitle: 'Traffic Flow Update',
    notifTrafficMsg: 'Mandi yard traffic moving at regular capacity.'
  },
  adminDashboard: {
    title: 'Mandi Administrative Dashboard',
    subtitle: 'Live oversight, gate security scanner, dynamic queue dispatch, and weighbridge testing.',
    liveOverview: 'Overview',
    gateScanner: 'Gate Scanner',
    queueControl: 'Queue Control',
    weighingInspection: 'Quality & Weighing',
    metrics: {
      dailyTokens: 'Daily Tokens Issued',
      activeQueue: 'Vehicles in Active Queue',
      mandiCapacity: 'Mandi Capacity Utilization',
      activeWeighbridges: 'Active Weighbridges',
      completedProcurement: 'Completed Procurements',
      totalDisbursed: 'Total Procurement Value'
    },
    scanner: {
      title: 'Gate QR Token Scanner',
      subtitle: 'Scan farmer entry tokens to verify authenticity and admit vehicles into the yard.',
      cameraScanner: 'Camera Live Scanner',
      cameraStandby: 'Camera Standby',
      startCamera: 'Start Camera',
      stopCamera: 'Stop Camera',
      scanWebcamBtn: 'Scan via Webcam',
      simulateScanBtn: 'Simulate Scan (A023)',
      manualInputPlaceholder: 'Enter token number (e.g. A023) or 64-char hash...',
      verifyTokenBtn: 'Verify and Admit',
      quickTestBtn: 'Quick Sample Tokens',
      verifying: 'Verifying Token...',
      verifiedSuccess: 'Token verified successfully. Vehicle admitted to yard.',
      invalidToken: 'Invalid token. Not recognized in Mandi records.',
      admitVehicle: 'Admit to Mandi Gate',
      assignedLane: 'Assigned Weighbridge Lane',
      cameraInstructions: 'Align the farmer QR code inside the scan reticle',
      simulationRunning: 'Simulating Laser Scan (A023)...'
    },
    queueManagement: {
      title: 'Dynamic Queue and Traffic Controls',
      subtitle: 'Manage lane priorities, mitigate breakdowns, and balance traffic.',
      emergencyLaneToggle: 'Emergency Priority Lane',
      breakdownModeToggle: 'Equipment Breakdown Mode',
      trafficRerouteToggle: 'Traffic Rerouting',
      rerouteGateLabel: 'Rerouting Gate',
      active: 'Active',
      inactive: 'Inactive',
      callNext: 'Call Vehicle',
      prioritize: 'Set Priority',
      tableHeaders: {
        token: 'Token',
        farmer: 'Farmer',
        vehicle: 'Vehicle',
        cropQuantity: 'Produce & Qty',
        timeSlot: 'Slot',
        status: 'Status',
        actions: 'Actions'
      }
    },
    weighingForm: {
      title: 'Quality Testing and Weighbridge Operations',
      subtitle: 'Record moisture levels, dockage grade, gross weight, and tare weight linked to token.',
      selectToken: 'Select Arrived Farmer Token',
      qualityScore: 'Quality Grade',
      moistureLevel: 'Moisture Content',
      moistureUnit: '%',
      dockageGrade: 'Dockage Grade',
      foreignMatter: 'Foreign Matter (%)',
      grossWeight: 'Gross Weight (Vehicle + Harvest)',
      tareWeight: 'Tare Weight (Empty Vehicle)',
      netWeight: 'Calculated Net Weight',
      mspRate: 'Minimum Support Price (per qtl)',
      moisturePenalty: 'Moisture Deduction',
      netPayout: 'Final Payable Amount',
      weightUnit: 'kg',
      approveAndIssue: 'Approve and Issue Settlement Slip',
      approvedSuccess: 'Settlement slip generated and direct payment initiated.',
      selectPrompt: 'Select a farmer token to start weighing operations'
    }
  },
  common: {
    quintal: 'Quintal',
    kg: 'kg',
    rupees: '₹',
    verified: 'Verified',
    pending: 'Pending',
    close: 'Close',
    active: 'Active',
    inactive: 'Inactive',
    helpline: 'Toll-Free Kisan Helpline: 1800-180-1551',
    allRightsReserved: 'Smart India Hackathon Prototype'
  },
  weatherInsights: {
    title: 'Smart Weather Advisory & Alert Module',
    subtitle: 'Location-specific microclimate intelligence & agricultural protection alerts',
    tabTitle: 'Weather & Advisory',
    temperature: 'Temperature',
    feelsLike: 'Feels Like',
    rainForecast: 'Precipitation Probability',
    windSpeed: 'Wind Speed',
    humidity: 'Humidity',
    uvIndex: 'UV Index',
    pressure: 'Barometric Pressure',
    rainAlertTitle: 'Rain Alert',
    rainAlertMsg: 'Rain expected: Cover harvested produce immediately.',
    heatAlertTitle: 'Heat Alert',
    heatAlertMsg: 'High temperature: Provide shade to produce and livestock.',
    advisoryHeader: 'Dynamic Agricultural Advisory',
    locationLabel: 'Registered Procurement Center',
    conditionNames: {
      sunny: 'Clear & Sunny',
      thunderstorm: 'Thunderstorm',
      rainy: 'Heavy Rain',
      cloudy: 'Partly Cloudy',
      highHeat: 'Scorching Heat',
      highWind: 'High Wind Gales'
    },
    severities: {
      critical: 'CRITICAL ALERT',
      warning: 'WEATHER WARNING',
      info: 'OPERATIONAL INFO'
    },
    rainAlert: {
      title: 'Rain Alert: Crop Protection Required',
      message: 'Rain Alert: Cover harvested produce (e.g., Paddy/Wheat) immediately if outdoors. Postpone pesticide spraying.',
      action: 'Cover outdoor grains with waterproof tarpaulin sheets and hold pesticide application until rainfall clears.'
    },
    heatAlert: {
      title: 'Heat Alert: Sunlight & Moisture Protection',
      message: 'Heat Alert: Protect harvested produce from direct sunlight. Provide adequate water to livestock.',
      action: 'Move harvested produce into shaded storage to prevent rapid grain drying and weight loss. Replenish animal water troughs.'
    },
    windAlert: {
      title: 'Wind Alert: Secure Farm Infrastructure',
      message: 'Wind Alert: Secure loose structures. Avoid sensitive irrigation techniques.',
      action: 'Fasten temporary nursery covers and postpone sprinkler irrigation to prevent drift and lodging.'
    },
    procurementAlert: {
      title: 'Operational Procurement Center Advisory',
      message: 'Alert: Heavy rain expected tomorrow at procurement center. Check for center status updates before traveling.',
      action: 'Check live center operating status on Kisan Setu before leaving your village to prevent long gate queues.'
    },
    tarpaulinAlert: {
      title: 'Moisture Protection Transit Warning',
      message: 'Tarpaulin Transit Alert: Secure waterproof tarpaulin sheets over grain bags to prevent moisture penalties at weighbridge.',
      action: 'Inspect trolley coverings before gate dispatch; wet produce above 12% moisture incurs MSP dockage deductions.'
    },
    favorableCondition: {
      title: 'Optimal Harvesting & Transit Conditions',
      message: 'Atmospheric conditions are stable and favorable for harvesting, field transport, and Mandi weighbridge processing.',
      action: 'Proceed as scheduled with harvest transport. No weather disruptions anticipated.'
    },
    simulation: {
      title: 'SIH Evaluation Weather Scenario Simulator',
      subtitle: 'Simulate extreme weather events to evaluate real-time rule engine reactivity',
      scenarios: {
        rain: 'Rain Alert (>60%)',
        heat: 'High Heat (>35°C)',
        wind: 'High Wind (>20 km/h)',
        mandiRain: 'Mandi Heavy Rain',
        favorable: 'Optimal Clear Sky'
      },
      activeScenario: 'Active Simulation Mode'
    },
    hourlyForecast: {
      title: '24-Hour Microclimate Outlook',
      now: 'Now'
    },
    logisticsImpact: {
      title: 'Procurement Logistics Impact',
      appointmentNotice: 'Linked to your scheduled slot',
      vehicleNotice: 'Vehicle protection protocol',
      viewCenterStatus: 'View Center Status'
    },
    viewFullDashboard: 'Open Weather & Advisory Hub'
  },
  stages8: {
    slotBooked: '1. Slot Booked',
    gateCheckin: '2. Gate Check-in',
    qualityTesting: '3. Quality Testing',
    grossWeighing: '4. Gross Weighing',
    unloading: '5. Unloading',
    tareWeighing: '6. Tare Weighing',
    procurement: '7. Procurement',
    digitalReceipt: '8. Digital Receipt'
  },
  adminMetricsBanner: {
    totalBookings: 'Total Bookings',
    checkedIn: 'Checked In',
    waiting: 'Waiting',
    processing: 'Processing',
    completed: 'Completed',
    delayed: 'Delayed'
  },
  gateCheckInModal: {
    title: 'Gate Entry Verification',
    subtitle: 'Verify token QR code and admit farmer vehicle to yard',
    farmerName: 'Farmer Name',
    farmerId: 'Farmer ID',
    crop: 'Crop',
    quantity: 'Quantity',
    vehicle: 'Vehicle',
    timeSlot: 'Slot',
    checkInAction: 'CHECK-IN',
    successMessage: 'Token verified and gate check-in confirmed!'
  },
  digitalReceipt: {
    title: 'Digital Procurement Settlement Receipt',
    subtitle: 'Official Minimum Support Price (MSP) Disbursal Document',
    receiptId: 'Receipt ID',
    tokenNumber: 'Token ID',
    farmerName: 'Farmer Name',
    farmerId: 'Farmer ID',
    village: 'Village',
    crop: 'Crop Type',
    dockageGrade: 'Quality Grade',
    moistureLevel: 'Moisture Content',
    foreignMatter: 'Foreign Matter',
    grossWeight: 'Gross Weight',
    tareWeight: 'Tare Weight',
    netWeight: 'Final Net Weight',
    mspRate: 'MSP Rate',
    moistureDeduction: 'Moisture Deduction',
    totalPayable: 'Total Payable Amount',
    paymentStatus: 'Payment Status',
    dbtStatus: 'DBT Direct Bank Transfer Confirmed',
    downloadPdf: 'Download PDF',
    printReceipt: 'Print Receipt',
    closeReceipt: 'Close',
    viewReceipt: 'View Digital Receipt',
    previewReceipt: 'Preview Receipt',
    receiptNotice: 'This digital certificate is cryptographically signed under SIH MSP Procurement Guidelines.',
    disbursementTime: 'Disbursal Timestamp',
    weighbridgeSlip: 'Electronic Weighbridge Slip',
    govtSeal: 'Govt. of India • Ministry of Agriculture',
    verifiedSignature: 'Digitally Verified & Approved',
    centerLabel: 'Procurement Center',
    slotLabel: 'Arrival Slot'
  },
  voiceAssistant: {
    assistantTitle: 'Kisan Setu Voice Assistant',
    assistantSubtitle: 'Hands-free voice navigation & assistance',
    listening: 'Listening... speak now',
    speaking: 'Speaking response...',
    ready: 'Tap microphone to speak',
    notSupported: 'Speech recognition is not supported on this browser',
    micPermissionDenied: 'Microphone permission denied. Please allow microphone access.',
    commandsTitle: 'Try saying one of these commands:',
    cmdBookSlot: 'Book Slot',
    cmdCheckQueue: 'Check Queue Status',
    cmdReadWeather: 'Read Weather Alert',
    cmdDigitalPass: 'Show Digital Pass',
    cmdStartGuided: 'Start Voice Guided Booking',
    playAudio: 'Play Audio',
    stopAudio: 'Stop Audio',
    guidedTitle: 'Voice Guided Booking Assistant',
    guidedStep1: 'Which crop do you want to sell today? (e.g. Wheat, Paddy, Mustard, Cotton, Pulses)',
    guidedStep2: 'How much quantity in quintals? (e.g. 35 quintals)',
    guidedStep3: 'What vehicle will you bring? (e.g. Tractor, Truck, Bullock Cart)',
    guidedConfirm: 'All details confirmed. Slot booked successfully! Your pass is ready.',
    guidedRestart: 'Start Over',
    voiceDictation: 'Click to dictate via voice',
    quickCommands: 'Quick Voice Commands',
    recognizedText: 'You said:'
  }
};

// 2. HINDI (हिंदी)
const hi: TranslationDict = {
  ...en,
  brandName: 'किसान सेतु',
  brandTagline: 'डिजिटल कृषि उपार्जन प्रणाली',
  langSwitchLabel: 'भाषा चुनें',
  activeLanguage: 'हिंदी',
  roleSwitcher: {
    farmer: 'किसान ऐप',
    admin: 'प्रशासक डैशबोर्ड',
    farmerDesc: 'पंजीकरण, स्लॉट बुकिंग एवं लाइव कतार पास',
    adminDesc: 'मंडी गेट स्कैनर, यार्ड कतार एवं तौल केंद्र संचालन'
  },
  farmerRegistration: {
    title: 'किसान पंजीकरण एवं सत्यापन',
    subtitle: 'खरीद केंद्र पर स्लॉट बुक करने के लिए अपनी जानकारी दर्ज करें।',
    fullName: 'किसान का पूरा नाम',
    fullNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
    farmerId: 'किसान पहचान पत्र',
    regenerateId: 'नई पहचान संख्या बनाएं',
    mobile: 'मोबाइल नंबर',
    mobilePlaceholder: 'दस अंकों का मोबाइल नंबर दर्ज करें',
    requestOtp: 'ओटीपी भेजें',
    verifyOtp: 'ओटीपी सत्यापित करें',
    otpLabel: 'सत्यापन कोड',
    otpHint: 'प्रोटोटाइप सत्यापन कोड: 123456',
    verified: 'सत्यापित',
    village: 'गांव',
    villageSelect: 'गांव चुनें',
    customVillage: 'अन्य गांव',
    crop: 'मुख्य फसल',
    quantity: 'अनुमानित मात्रा',
    quantityUnit: 'क्विंटल',
    vehicle: 'वाहन का प्रकार',
    loginSuccess: 'किसान विवरण सफलतापूर्वक सत्यापित हुआ।',
    continueBooking: 'स्लॉट बुकिंग के लिए आगे बढ़ें',
    validationError: 'कृपया सभी आवश्यक विवरण सही तरीके से भरें।',
    demoProfilesTitle: 'त्वरित प्रोटोटाइप विवरण'
  },
  crops: {
    PADDY: 'धान',
    WHEAT: 'गेहूं',
    MAIZE: 'मक्का',
    RED_GRAM: 'अरहर दाल',
    BENGAL_GRAM: 'चना',
    GREEN_GRAM: 'मूंग दाल',
    GROUNDNUT: 'मूंगफली',
    SOYBEAN: 'सोयाबीन',
    SOYABEAN: 'सोयाबीन',
    MUSTARD: 'सरसों',
    COTTON: 'कपास',
    PULSES: 'दालें'
  },
  cropDescriptions: {
    PADDY: 'खरीफ मौसम की मुख्य उपज',
    WHEAT: 'रबी मौसम की प्रमुख खाद्यान्न फसल',
    MAIZE: 'मोटे अनाज की उपज',
    RED_GRAM: 'तुअर दलहन उपज',
    BENGAL_GRAM: 'चना दलहन उपज',
    GREEN_GRAM: 'मूंग दलहन उपज',
    GROUNDNUT: 'तिलहन उपज',
    SOYBEAN: 'उच्च प्रोटीन तिलहन फसल',
    SOYABEAN: 'उच्च प्रोटीन तिलहन फसल',
    MUSTARD: 'तिलहन शीतकालीन उपज',
    COTTON: 'नगदी रेशा फसल',
    PULSES: 'चना, मसूर एवं मूंग'
  },
  vehicles: {
    TRACTOR: 'ट्रैक्टर-ट्रॉली',
    TRUCK: 'ट्रक',
    MINI_TRUCK: 'छोटा ट्रक',
    BULLOCK_CART: 'बैलगाड़ी',
    LARGE_TRUCK: 'बड़ा व्यावसायिक ट्रक'
  },
  vehicleUnloadTimes: {
    TRACTOR: 'पंद्रह मिनट खाली करने का समय',
    TRUCK: 'दस मिनट खाली करने का समय',
    MINI_TRUCK: 'बारह मिनट खाली करने का समय',
    BULLOCK_CART: 'पच्चीस मिनट खाली करने का समय',
    LARGE_TRUCK: 'दस मिनट खाली करने का समय'
  },
  centerStatus: {
    open: 'खुला',
    busy: 'व्यस्त',
    closed: 'बंद'
  },
  centerDetails: {
    currentQueue: 'वर्तमान कतार',
    estimatedWaiting: 'अनुमानित प्रतीक्षा समय',
    availableSlots: 'उपलब्ध स्लॉट',
    location: 'स्थान एवं दूरी',
    selectCenter: 'खरीद केंद्र का चयन करें',
    selected: 'चयनित केंद्र',
    vehiclesWaiting: 'वाहन कतार में',
    minsWait: 'मिनट',
    slotsOpenToday: 'स्लॉट आज उपलब्ध'
  },
  farmerIntake: {
    centerTitle: '१. खरीद केंद्र चुनें',
    centerSubtitle: 'लाइव कतार और प्रतीक्षा समय के आधार पर अपनी उपज बेचने का स्थान चुनें।',
    cropTitle: '२. फसल चुनें',
    cropSubtitle: 'अपनी प्राथमिक फसल चुनें। डेमो के लिए धान प्रमुख रूप से चयनित है।',
    detailsTitle: '३. मात्रा एवं वाहन विवरण',
    detailsSubtitle: 'फसल की मात्रा दर्ज करें और मंडी प्रवेश के लिए अपना वाहन चुनें।',
    demoStar: 'डेमो मुख्य फसल',
    selectedCropLabel: 'चयनित फसल',
    quantityLabel: 'अनुमानित मात्रा (क्विंटल में)',
    quantityUnit: 'क्विंटल',
    vehicleLabel: 'वाहन का चयन',
    confirmBookingBtn: 'केंद्र चयन सुरक्षित करें एवं पास प्राप्त करें',
    bookingNotice: 'क्यूआर कोड युक्त डिजिटल टोकन पास तुरंत जारी किया जाएगा।'
  },
  booking: {
    step1Title: '१. फसल का चयन एवं वजन',
    step1Subtitle: 'अपनी फसल और क्विंटल में अनुमानित मात्रा की पुष्टि करें।',
    step2Title: '२. खरीद केंद्र एवं समय स्लॉट',
    step2Subtitle: 'अपनी नजदीकी मंडी और आगमन की समय खिड़की चुनें।',
    step3Title: '३. वाहन का चयन',
    step3Subtitle: 'वे-ब्रिज खाली करने के समय के अनुसार अपना वाहन चुनें।',
    stepIndicator: 'चरण',
    nextStep: 'आगे बढ़ें',
    prevStep: 'पीछे',
    quickAdd: 'त्वरित जोड़ें:',
    selectCenter: 'खरीद केंद्र का चयन करें',
    selectDate: 'निर्धारित आगमन तिथि',
    selectSlot: 'उपलब्ध समय खिड़की',
    slotsAvailable: 'स्लॉट उपलब्ध',
    capacityBadges: {
      available: 'उपलब्ध',
      moderate: 'मध्यम',
      full: 'पूर्ण'
    },
    submitBooking: 'बुकिंग की पुष्टि करें एवं पास प्राप्त करें',
    submitting: 'पास तैयार हो रहा है...',
    bookingSuccess: 'बुकिंग पुष्ट हो गई है। आपका डिजिटल टोकन पास जारी कर दिया गया है।',
    bookingError: 'बुकिंग में त्रुटि हुई। कृपया उपलब्ध स्लॉट जांचें।',
    summaryTitle: 'बुकिंग का सारांश',
    spotsLeft: 'स्थान शेष',
    booked: 'आरक्षित'
  },
  digitalPass: {
    title: 'डिजिटल मंडी प्रवेश पास',
    subtitle: 'यह पास आपके उपकरण में सुरक्षित है और मंडी गेट पर बिना इंटरनेट मान्य है।',
    tokenNumber: 'टोकन संख्या',
    tokenHash: 'सुरक्षा कोड',
    farmerName: 'किसान का नाम',
    farmerId: 'किसान पहचान',
    village: 'गांव',
    center: 'खरीद केंद्र',
    date: 'आगमन तिथि',
    timeSlot: 'समय स्लॉट',
    crop: 'उपज',
    quantity: 'मात्रा',
    vehicle: 'वाहन',
    status: 'वर्तमान स्थिति',
    statusValues: {
      BOOKED: 'आरक्षित',
      STAGING: 'बफर यार्ड',
      MANDI_GATE: 'गेट पर स्वीकृत',
      INSPECTION: 'तौल जारी',
      COMPLETED: 'संपन्न'
    },
    downloadPass: 'पास डाउनलोड करें',
    printPass: 'पास प्रिंट करें',
    sharePass: 'पास साझा करें',
    offlineBadge: 'ऑफलाइन मान्य',
    offlineNotice: 'सुरक्षा अधिकारी इस क्यूआर कोड को बिना नेटवर्क भी सत्यापित कर सकते हैं।',
    noPassFound: 'कोई सक्रिय पास नहीं मिला',
    noPassDesc: 'वर्तमान में आपके पास कोई सक्रिय बुकिंग पास नहीं है।',
    bookSlotNow: 'अभी स्लॉट बुक करें'
  },
  queueTracker: {
    title: 'लाइव कतार प्रगति ट्रैकर',
    subtitle: 'प्रस्थान से लेकर भुगतान तक की रीयल-टाइम वाहन स्थिति।',
    yourPosition: 'आपकी कतार संख्या',
    vehiclesAhead: 'आपके आगे वाहन',
    estimatedWaitTime: 'अनुमानित प्रतीक्षा समय',
    minutes: 'मिनट',
    assignedLane: 'आवंटित वे-ब्रिज लेन',
    currentStage: 'सक्रिय चरण',
    stages: {
      booked: {
        title: '१. आरक्षित',
        desc: 'स्लॉट सुरक्षित है। उपज परिवहन के लिए तैयार करें।'
      },
      staging: {
        title: '२. बफर यार्ड',
        desc: 'मंडी के पास प्रतीक्षा क्षेत्र। गेट बुलावा आने तक रुकें।'
      },
      gate: {
        title: '३. गेट सत्यापन',
        desc: 'क्यूआर टोकन सत्यापित। मंडी परिसर में प्रवेश दिया गया।'
      },
      inspection: {
        title: '४. गुणवत्ता एवं तौल',
        desc: 'गुणवत्ता परीक्षण, खाली एवं भरे वाहन का वजन मापन।'
      },
      completed: {
        title: '५. भुगतान संपन्न',
        desc: 'तौल पर्ची जारी। बैंक खाते में राशि अंतरित।'
      }
    },
    distanceSimulator: {
      title: 'दूरी सिम्युलेटर',
      desc: 'वाहन की दूरी बदलकर देखें कि कतार की स्थिति स्वतः कैसे बदलती है।',
      home: 'गृह स्थल (१२ किमी)',
      buffer: 'बफर यार्ड (२ किमी)',
      gate: 'मंडी गेट (२०० मी)'
    }
  },
  notifications: {
    title: 'सूचनाएं एवं अलर्ट',
    noNotifications: 'वर्तमान में कोई सूचना नहीं है।',
    markAllRead: 'सभी को पढ़ा हुआ चिन्हित करें',
    dismiss: 'हटाएं',
    notifBookingTitle: 'स्लॉट सफलतापूर्वक बुक हुआ',
    notifBookingMsg: 'आपके आगमन का समय निश्चित हो गया है। डिजिटल पास तैयार है।',
    notifGateCheckinTitle: 'गेट प्रवेश सत्यापित',
    notifGateCheckinMsg: 'आपका टोकन गेट पर स्कैन किया गया। आवंटित लेन में जाएं।',
    notifInspectionTitle: 'गुणवत्ता जांच एवं तौल संपन्न',
    notifInspectionMsg: 'फसल की ग्रेडिंग और तौल पूरी हुई। भुगतान रसीद बन गई है।',
    notifBreakdownTitle: 'यातायात सूचना: वे-ब्रिज रखरखाव',
    notifBreakdownMsg: 'उपकरण रखरखाव जारी है। वाहनों को वैकल्पिक गेट पर भेजा जा रहा है।',
    notifEmergencyTitle: 'प्राथमिकता लेन सक्रिय',
    notifEmergencyMsg: 'शीघ्र निस्तारण हेतु आपातकालीन प्राथमिकता लेन खोली गई है।',
    notifTrafficTitle: 'यातायात अद्यतन',
    notifTrafficMsg: 'मंडी यार्ड में आवागमन सामान्य रूप से जारी है।'
  },
  adminDashboard: {
    title: 'मंडी प्रशासनिक डैशबोर्ड',
    subtitle: 'लाइव निगरानी, गेट सुरक्षा स्कैनर, डायनामिक कतार नियंत्रण एवं तौल संचालन।',
    liveOverview: 'अवलोकन',
    gateScanner: 'गेट स्कैनर',
    queueControl: 'कतार नियंत्रण',
    weighingInspection: 'गुणवत्ता एवं तौल',
    metrics: {
      dailyTokens: 'कुल दैनिक टोकन',
      activeQueue: 'कतार में सक्रिय वाहन',
      mandiCapacity: 'मंडी क्षमता उपयोग',
      activeWeighbridges: 'सक्रिय वे-ब्रिज संख्या',
      completedProcurement: 'पूर्ण खरीद संख्या',
      totalDisbursed: 'कुल उपार्जन मूल्य'
    },
    scanner: {
      title: 'गेट क्यूआर टोकन स्कैनर',
      subtitle: 'किसानों के प्रवेश टोकन की प्रामाणिकता जांचें और वाहनों को प्रवेश दें।',
      cameraScanner: 'लाइव कैमरा स्कैनर',
      cameraStandby: 'कैमरा स्टैंडबाय',
      startCamera: 'कैमरा शुरू करें',
      stopCamera: 'कैमरा बंद करें',
      scanWebcamBtn: 'वेबकैम से स्कैन करें',
      simulateScanBtn: 'नियम परीक्षण स्कैन (A023)',
      manualInputPlaceholder: 'टोकन संख्या (उदा. A023) या कोड दर्ज करें...',
      verifyTokenBtn: 'सत्यापित करें एवं प्रवेश दें',
      quickTestBtn: 'सैंपल टोकन स्कैन करें',
      verifying: 'सत्यापन जारी है...',
      verifiedSuccess: 'टोकन वैध पाया गया। वाहन को यार्ड में प्रवेश दिया गया।',
      invalidToken: 'अमान्य टोकन। मंडी अभिलेखों में उपलब्ध नहीं है।',
      admitVehicle: 'मंडी गेट में प्रवेश दें',
      assignedLane: 'आवंटित वे-ब्रिज लेन',
      cameraInstructions: 'किसान के डिजिटल क्यूआर कोड को स्कैन फ्रेम के अंदर रखें',
      simulationRunning: 'लेजर स्कैन का अनुकरण किया जा रहा है (A023)...'
    },
    queueManagement: {
      title: 'डायनामिक कतार एवं यातायात नियंत्रण',
      subtitle: 'लेन प्राथमिकताओं का प्रबंधन करें और भीड़ को सुगम बनाएं।',
      emergencyLaneToggle: 'आपातकालीन प्राथमिकता लेन',
      breakdownModeToggle: 'उपकरण खराबी मोड',
      trafficRerouteToggle: 'यातायात मार्ग परिवर्तन',
      rerouteGateLabel: 'मार्ग परिवर्तन गेट',
      active: 'सक्रिय',
      inactive: 'निष्क्रिय',
      callNext: 'वाहन बुलाएं',
      prioritize: 'प्राथमिकता दें',
      tableHeaders: {
        token: 'टोकन',
        farmer: 'किसान',
        vehicle: 'वाहन',
        cropQuantity: 'उपज एवं मात्रा',
        timeSlot: 'स्लॉट',
        status: 'स्थिति',
        actions: 'कार्रवाई'
      }
    },
    weighingForm: {
      title: 'गुणवत्ता परीक्षण एवं वे-ब्रिज संचालन',
      subtitle: 'नमी का स्तर, ग्रेड, कुल वजन और खाली वाहन का वजन दर्ज करें।',
      selectToken: 'उपस्थित किसान टोकन चुनें',
      qualityScore: 'गुणवत्ता ग्रेड',
      moistureLevel: 'नमी का प्रतिशत',
      moistureUnit: '%',
      dockageGrade: 'डॉकज ग्रेड',
      foreignMatter: 'विजातीय तत्व (%)',
      grossWeight: 'सकल वजन (वाहन + फसल)',
      tareWeight: 'वाहन का खाली वजन',
      netWeight: 'शुद्ध फसल वजन',
      mspRate: 'न्यूनतम समर्थन मूल्य (प्रति क्विंटल)',
      moisturePenalty: 'नमी कटौती राशि',
      netPayout: 'कुल देय राशि',
      weightUnit: 'किग्रा',
      approveAndIssue: 'स्वीकृत करें एवं अंतिम पर्ची जारी करें',
      approvedSuccess: 'रसीद जारी की गई एवं प्रत्यक्ष बैंक भुगतान शुरू हुआ।',
      selectPrompt: 'तौल प्रक्रिया शुरू करने के लिए किसान का टोकन चुनें'
    }
  },
  common: {
    quintal: 'क्विंटल',
    kg: 'किग्रा',
    rupees: '₹',
    verified: 'सत्यापित',
    pending: 'प्रतीक्षारत',
    close: 'बंद करें',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    helpline: 'टोल-फ्री किसान हेल्पलाइन: 1800-180-1551',
    allRightsReserved: 'स्मार्ट इंडिया हैकाथॉन प्रोटोटाइप'
  },
  weatherInsights: {
    title: 'स्मार्ट मौसम परामर्श एवं चेतावनी मॉड्यूल',
    subtitle: 'स्थान-विशिष्ट सूक्ष्म जलवायु पूर्वानुमान एवं कृषि सुरक्षा चेतावनी',
    tabTitle: 'मौसम एवं परामर्श',
    temperature: 'तापमान',
    feelsLike: 'अनुभूत तापमान',
    rainForecast: 'वर्षा की संभावना',
    windSpeed: 'हवा की गति',
    humidity: 'नमी / आर्द्रता',
    uvIndex: 'यूवी सूचकांक',
    pressure: 'वायुमंडलीय दबाव',
    rainAlertTitle: 'वर्षा चेतावनी',
    rainAlertMsg: 'बारिश की संभावना: कटी हुई फसल को तुरंत सुरक्षित करें।',
    heatAlertTitle: 'अत्यधिक गर्मी चेतावनी',
    heatAlertMsg: 'उच्च तापमान: फसल और मवेशियों को धूप से बचाएं।',
    advisoryHeader: 'सक्रिय कृषि परामर्श अलर्ट',
    locationLabel: 'पंजीकृत खरीद केंद्र',
    conditionNames: {
      sunny: 'साफ एवं धूप',
      thunderstorm: 'गरज के साथ तूफान',
      rainy: 'भारी वर्षा',
      cloudy: 'आंशिक बादल',
      highHeat: 'भीषण गर्मी',
      highWind: 'तेज हवा आंधी'
    },
    severities: {
      critical: 'अति आवश्यक चेतावनी',
      warning: 'मौसम चेतावनी',
      info: 'सामान्य परिचालन जानकारी'
    },
    rainAlert: {
      title: 'वर्षा चेतावनी: फसल सुरक्षा आवश्यक',
      message: 'वर्षा चेतावनी: खुले में रखी कटी हुई फसल (जैसे धान/गेहूं) को तुरंत ढकें। कीटनाशक छिड़काव स्थगित करें।',
      action: 'खुले अनाज को वाटरप्रूफ तिरपाल से सुरक्षित करें और वर्षा रुकने तक कीटनाशक का प्रयोग टालें।'
    },
    heatAlert: {
      title: 'उच्च ताप चेतावनी: धूप एवं नमी संरक्षण',
      message: 'उच्च ताप चेतावनी: कटी हुई उपज को सीधी धूप से बचाएं। पशुओं को पर्याप्त पानी उपलब्ध कराएं।',
      action: 'अनाज के सूखने और वजन घटने से बचाने के लिए छायादार स्थान पर रखें। पशुओं के लिए स्वच्छ पानी का प्रबंध करें।'
    },
    windAlert: {
      title: 'तेज हवा चेतावनी: कृषि अवसंरचना सुरक्षा',
      message: 'तेज हवा चेतावनी: अस्थायी ढांचों को सुरक्षित करें। फव्वारा व संवेदनशील सिंचाई से बचें।',
      action: 'नर्सरी शेड एवं तिरपाल को कसकर बांधें तथा तेज हवा में स्प्रिंकलर सिंचाई न करें।'
    },
    procurementAlert: {
      title: 'खरीद केंद्र रसद व परिवहन परामर्श',
      message: 'सतर्कता: कल खरीद केंद्र पर भारी वर्षा की संभावना है। प्रस्थान करने से पहले केंद्र की स्थिति की जांच करें।',
      action: 'गांव से निकलने से पहले किसान सेतु पर खरीद केंद्र की लाइव स्थिति देखें ताकि लंबी कतार से बचा जा सके।'
    },
    tarpaulinAlert: {
      title: 'नमी सुरक्षा परिवहन चेतावनी',
      message: 'ट्रैक्टर परिवहन अलर्ट: मंडी तौल पर नमी कटौती से बचने के लिए बोरियों पर वाटरप्रूफ तिरपाल अवश्य बांधें।',
      action: 'मंडी रवाना होने से पहले ट्रॉली की जांच करें; १२% से अधिक नमी पाए जाने पर एमएसपी भुगतान में कटौती हो सकती है।'
    },
    favorableCondition: {
      title: 'उत्कृष्ट कटाई एवं परिवहन अनुकूलता',
      message: 'मौसम स्थिर और अनुकूल है। कटाई, खेत से परिवहन एवं मंडी वे-ब्रिज तौल के लिए उत्तम समय है।',
      action: 'निर्धारित कार्यक्रम के अनुसार मंडी प्रस्थान करें। मौसम संबंधी कोई बाधा नहीं है।'
    },
    simulation: {
      title: 'एसआईएच मूल्यांकन मौसम परिदृश्य सिम्युलेटर',
      subtitle: 'रियल-टाइम नियम इंजन की संवेदनशीलता जांचने के लिए मौसम परिदृश्यों का परीक्षण करें',
      scenarios: {
        rain: 'वर्षा चेतावनी (>60%)',
        heat: 'अत्यधिक गर्मी (>35°C)',
        wind: 'तेज हवा (>20 km/h)',
        mandiRain: 'मंडी केंद्र भारी वर्षा',
        favorable: 'अनुकूल साफ मौसम'
      },
      activeScenario: 'सक्रिय सिमुलेशन मोड'
    },
    hourlyForecast: {
      title: '२४ घंटे का सूक्ष्म जलवायु पूर्वानुमान',
      now: 'अभी'
    },
    logisticsImpact: {
      title: 'उपार्जन रसद एवं परिवहन प्रभाव',
      appointmentNotice: 'आपके आरक्षित स्लॉट से संबद्ध',
      vehicleNotice: 'वाहन सुरक्षा दिशानिर्देश',
      viewCenterStatus: 'केंद्र स्थिति देखें'
    },
    viewFullDashboard: 'मौसम एवं परामर्श हब खोलें'
  },
  stages8: {
    slotBooked: '१. स्लॉट आरक्षित',
    gateCheckin: '२. गेट सत्यापन',
    qualityTesting: '३. गुणवत्ता परीक्षण',
    grossWeighing: '४. सकल तौल',
    unloading: '५. अनलोडिंग',
    tareWeighing: '६. खाली वाहन तौल',
    procurement: '७. उपार्जन स्वीकृत',
    digitalReceipt: '८. डिजिटल रसीद'
  },
  adminMetricsBanner: {
    totalBookings: 'कुल बुकिंग',
    checkedIn: 'गेट प्रवेशित',
    waiting: 'प्रतीक्षारत',
    processing: 'प्रक्रियाधीन',
    completed: 'संपन्न',
    delayed: 'विलंबित'
  },
  gateCheckInModal: {
    title: 'गेट प्रवेश सत्यापन',
    subtitle: 'टोकन क्यूआर कोड जांचें और वाहन को मंडी यार्ड में प्रवेश दें',
    farmerName: 'किसान का नाम',
    farmerId: 'किसान आईडी',
    crop: 'फसल',
    quantity: 'मात्रा',
    vehicle: 'वाहन',
    timeSlot: 'समय स्लॉट',
    checkInAction: 'प्रवेश सत्यापित करें (CHECK-IN)',
    successMessage: 'टोकन सत्यापित हुआ एवं गेट प्रवेश स्वीकृत किया गया!'
  },
  digitalReceipt: {
    title: 'डिजिटल उपार्जन निपटान रसीद',
    subtitle: 'न्यूनतम समर्थन मूल्य (MSP) प्रत्यक्ष बैंक भुगतान प्रमाण पत्र',
    receiptId: 'रसीद संख्या',
    tokenNumber: 'टोकन संख्या',
    farmerName: 'किसान का नाम',
    farmerId: 'किसान पहचान',
    village: 'गांव',
    crop: 'खरीदी गई फसल',
    dockageGrade: 'गुणवत्ता ग्रेड',
    moistureLevel: 'नमी प्रतिशत',
    foreignMatter: 'विजातीय तत्व',
    grossWeight: 'सकल वजन',
    tareWeight: 'खाली वाहन वजन',
    netWeight: 'अंतिम शुद्ध वजन',
    mspRate: 'एमएसपी समर्थन दर',
    moistureDeduction: 'नमी कटौती राशि',
    totalPayable: 'कुल देय राशि',
    paymentStatus: 'भुगतान स्थिति',
    dbtStatus: 'प्रत्यक्ष लाभ अंतरण (DBT) स्वीकृत',
    downloadPdf: 'रसीद डाउनलोड (PDF)',
    printReceipt: 'रसीद प्रिंट करें',
    closeReceipt: 'बंद करें',
    viewReceipt: 'डिजिटल रसीद देखें',
    previewReceipt: 'रसीद पूर्वावलोकन',
    receiptNotice: 'यह डिजिटल प्रमाण पत्र भारत सरकार के एमएसपी खरीद नियमों के तहत डिजिटल रूप से सत्यापित है।',
    disbursementTime: 'भुगतान समय',
    weighbridgeSlip: 'इलेक्ट्रॉनिक वे-ब्रिज तौल पर्ची',
    govtSeal: 'भारत सरकार • कृषि एवं किसान कल्याण मंत्रालय',
    verifiedSignature: 'डिजिटल रूप से प्रमाणित एवं स्वीकृत',
    centerLabel: 'खरीद केंद्र',
    slotLabel: 'आगमन समय'
  },
  voiceAssistant: {
    assistantTitle: 'किसान सेतु वॉइस असिस्टेंट',
    assistantSubtitle: 'हाथ-मुक्त वॉइस नेविगेशन एवं सहायता',
    listening: 'सुन रहा है... अब बोलें',
    speaking: 'उत्तर दिया जा रहा है...',
    ready: 'बोलने के लिए माइक दबाएं',
    notSupported: 'इस ब्राउज़र पर वॉइस रिकग्निशन समर्थित नहीं है',
    micPermissionDenied: 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया माइक की अनुमति दें।',
    commandsTitle: 'इनमें से कोई भी कमांड बोलें:',
    cmdBookSlot: 'स्लॉट बुक करें',
    cmdCheckQueue: 'कतार स्थिति जांचें',
    cmdReadWeather: 'मौसम अलर्ट पढ़ें',
    cmdDigitalPass: 'डिजिटल पास दिखाएं',
    cmdStartGuided: 'वॉइस निर्देशित बुकिंग शुरू करें',
    playAudio: 'ऑडियो सुनें',
    stopAudio: 'ऑडियो रोकें',
    guidedTitle: 'वॉइस निर्देशित बुकिंग सहायक',
    guidedStep1: 'आज आप कौन सी फसल बेचना चाहते हैं? (उदा. गेहूं, धान, सरसों, कपास, दालें)',
    guidedStep2: 'कितनी मात्रा क्विंटल में? (उदा. 35 क्विंटल)',
    guidedStep3: 'आप कौन सा वाहन लाएंगे? (उदा. ट्रैक्टर, ट्रक, बैलगाड़ी)',
    guidedConfirm: 'सभी विवरण दर्ज हो गए हैं। स्लॉट सफलतापूर्वक बुक हो गया है! आपका पास तैयार है।',
    guidedRestart: 'पुनः प्रारंभ करें',
    voiceDictation: 'बोलकर दर्ज करने के लिए क्लिक करें',
    quickCommands: 'त्वरित वॉइस कमांड',
    recognizedText: 'आपने कहा:'
  }
};

// 3. TELUGU (తెలుగు) - 100% PURE TELUGU DICTIONARY
const te: TranslationDict = {
  brandName: 'కిసాన్ సేతు',
  brandTagline: 'డిజిటల్ వ్యవసాయ సేకరణ వేదిక',
  langSwitchLabel: 'భాషను ఎంచుకోండి',
  activeLanguage: 'తెలుగు',
  roleSwitcher: {
    farmer: 'రైతు యాప్',
    admin: 'అడ్మిన్ డాష్‌బోర్డ్',
    farmerDesc: 'నమోదు, స్లాట్ బుకింగ్ మరియు లైవ్ క్యూ పాస్',
    adminDesc: 'మార్కెట్ యార్డ్ గేట్ స్కానర్ మరియు వేబ్రిడ్జి నిర్వహణ'
  },
  farmerRegistration: {
    title: 'రైతు నమోదు మరియు ధృవీకరణ',
    subtitle: 'సేకరణ కేంద్రంలో స్లాట్ బుక్ చేసుకోవడానికి మీ ప్రాథమిక వివరాలను నమోదు చేయండి.',
    fullName: 'రైతు పూర్తి పేరు',
    fullNamePlaceholder: 'మీ పూర్తి పేరును నమోదు చేయండి',
    farmerId: 'రైతు గుర్తింపు సంఖ్య',
    regenerateId: 'కొత్త ఐడీని రూపొందించండి',
    mobile: 'మొబైల్ నంబర్',
    mobilePlaceholder: '10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి',
    requestOtp: 'ఓటీపీ పంపండి',
    verifyOtp: 'ఓటీపీ ధృవీకరించండి',
    otpLabel: 'ధృవీకరణ కోడ్',
    otpHint: 'నమూనా ధృవీకరణ కోడ్: 123456',
    verified: 'ధృవీకరించబడింది',
    village: 'గ్రామం',
    villageSelect: 'గ్రామాన్ని ఎంచుకోండి',
    customVillage: 'ఇతర గ్రామం',
    crop: 'ప్రధాన పంట',
    quantity: 'సుమారు పరిమాణం',
    quantityUnit: 'క్వింటాళ్ళు',
    vehicle: 'వాహనం రకం',
    loginSuccess: 'రైతు వివరాలు విజయవంతంగా ధృవీకరించబడ్డాయి.',
    continueBooking: 'స్లాట్ బుకింగ్‌కు కొనసాగండి',
    validationError: 'దయచేసి అన్ని తప్పనిసరి వివరాలను సరిగ్గా పూరించండి.',
    demoProfilesTitle: 'శీఘ్ర నమూనా ప్రొఫైల్స్'
  },
  crops: {
    PADDY: 'వరి',
    WHEAT: 'గోధుమలు',
    MAIZE: 'మొక్కజొన్న',
    RED_GRAM: 'కందులు',
    BENGAL_GRAM: 'శనగలు',
    GREEN_GRAM: 'పెసలు',
    GROUNDNUT: 'వేరుశనగ',
    SOYBEAN: 'సోయాబీన్',
    SOYABEAN: 'సోయాబీన్',
    MUSTARD: 'ఆవాలు',
    COTTON: 'పత్తి',
    PULSES: 'పప్పుధాన్యాలు'
  },
  cropDescriptions: {
    PADDY: 'ఖరీఫ్ ప్రధాన పంట',
    WHEAT: 'రబీ ముఖ్య ఆహార ధాన్యం',
    MAIZE: 'ముతక ఆహార ధాన్యం',
    RED_GRAM: 'ప్రోటీన్ సమృద్ధిగా ఉండే కంది పప్పు',
    BENGAL_GRAM: 'శనగ పప్పు పంట',
    GREEN_GRAM: 'పెసర పప్పు దిగుబడి',
    GROUNDNUT: 'నూనె గింజల పంట',
    SOYBEAN: 'అధిక ప్రోటీన్ వాణిజ్య నూనె గింజలు',
    SOYABEAN: 'అధిక ప్రోటీన్ వాణిజ్య నూనె గింజలు',
    MUSTARD: 'శీతాకాలపు నూనె గింజ పంట',
    COTTON: 'వాణిజ్య పత్తి పంట',
    PULSES: 'శనగలు, కందులు మరియు పెసలు'
  },
  vehicles: {
    TRACTOR: 'ట్రాక్టర్/ట్రాలీ',
    TRUCK: 'ట్రక్కు',
    MINI_TRUCK: 'మినీ ట్రక్కు',
    BULLOCK_CART: 'ఎడ్ల బండి',
    LARGE_TRUCK: 'భారీ వాణిజ్య ట్రక్కు'
  },
  vehicleUnloadTimes: {
    TRACTOR: '15 నిమిషాల అన్‌లోడింగ్',
    TRUCK: '10 నిమిషాల అన్‌లోడింగ్',
    MINI_TRUCK: '12 నిమిషాల అన్‌లోడింగ్',
    BULLOCK_CART: '25 నిమిషాల అన్‌లోడింగ్',
    LARGE_TRUCK: '10 నిమిషాల అన్‌లోడింగ్'
  },
  centerStatus: {
    open: 'తెరిచి ఉంది',
    busy: 'రద్దీగా ఉంది',
    closed: 'మూసివేయబడింది'
  },
  centerDetails: {
    currentQueue: 'ప్రస్తుత క్యూ',
    estimatedWaiting: 'అంచనా వేచి ఉండే సమయం',
    availableSlots: 'అందుబాటులో ఉన్న స్లాట్లు',
    location: 'ప్రదేశం మరియు దూరం',
    selectCenter: 'సేకరణ కేంద్రాన్ని ఎంచుకోండి',
    selected: 'ఎంచుకున్న కేంద్రం',
    vehiclesWaiting: 'వాహనాలు వేచి ఉన్నాయి',
    minsWait: 'నిమిషాలు',
    slotsOpenToday: 'నేడు అందుబాటులో ఉన్న స్లాట్లు'
  },
  farmerIntake: {
    centerTitle: '౧. సేకరణ కేంద్రాన్ని ఎంచుకోండి',
    centerSubtitle: 'క్యూ మరియు వేచి ఉండే సమయం ఆధారంగా కేంద్రాన్ని ఎంచుకోండి.',
    cropTitle: '౨. పంటను ఎంచుకోండి',
    cropSubtitle: 'మీ ప్రధాన పంటను ఎంచుకోండి. డెమో కోసం వరి ప్రధానంగా ఎంపిక చేయబడింది.',
    detailsTitle: '౩. పరిమాణం మరియు వాహనం వివరాలు',
    detailsSubtitle: 'అంచనా పరిమాణం మరియు మీ రవాణా వాహనాన్ని ఎంచుకోండి.',
    demoStar: 'డెమో ముఖ్య పంట',
    selectedCropLabel: 'ఎంచుకున్న పంట',
    quantityLabel: 'పరిమాణం (క్వింటాళ్ళలో)',
    quantityUnit: 'క్వింటాళ్ళు',
    vehicleLabel: 'వాహనం ఎంపిక',
    confirmBookingBtn: 'కేంద్రాన్ని నిర్ధారించి డిజిటల్ పాస్ పొందండి',
    bookingNotice: 'స్కాన్ చేయగల క్యూఆర్ కోడ్ డిజిటల్ పాస్ వెంటనే జారీ చేయబడుతుంది.'
  },
  booking: {
    step1Title: '౧. పంట వివరాలు మరియు బరువు',
    step1Subtitle: 'మీ పంట మరియు క్వింటాళ్ళలో అంచనా పరిమాణాన్ని నిర్ధారించండి.',
    step2Title: '౨. సేకరణ కేంద్రం మరియు స్లాట్',
    step2Subtitle: 'సమీపంలోని మండి మరియు రాక సమయాన్ని ఎంచుకోండి.',
    step3Title: '౩. వాహనం మరియు రవాణా',
    step3Subtitle: 'వేబ్రిడ్జి ఖాళీ చేసే సమయం ఆధారంగా రవాణా మార్గాన్ని ఎంచుకోండి.',
    stepIndicator: 'దశ',
    nextStep: 'కొనసాగించండి',
    prevStep: 'వెనుకకు',
    quickAdd: 'త్వరిత జోడింపు:',
    selectCenter: 'సేకరణ కేంద్రాన్ని ఎంచుకోండి',
    selectDate: 'షెడ్యూల్ చేసిన తేదీ',
    selectSlot: 'అందుబాటులో ఉన్న సమయం',
    slotsAvailable: 'స్లాట్లు అందుబాటులో ఉన్నాయి',
    capacityBadges: {
      available: 'అందుబాటులో ఉంది',
      moderate: 'మధ్యస్థం',
      full: 'పూర్తిగా నిండింది'
    },
    submitBooking: 'బుకింగ్‌ను నిర్ధారించి పాస్ పొందండి',
    submitting: 'పాస్ రూపొందించబడుతోంది...',
    bookingSuccess: 'బుకింగ్ నిర్ధారించబడింది. మీ డిజిటల్ టోకెన్ పాస్ రూపొందించబడింది.',
    bookingError: 'బుకింగ్ విఫలమైంది. దయచేసి స్లాట్ లభ్యతను తనిఖీ చేయండి.',
    summaryTitle: 'బుకింగ్ సారాంశం',
    spotsLeft: 'మిగిలిన స్లాట్లు',
    booked: 'బుక్ చేయబడింది'
  },
  digitalPass: {
    title: 'డిజిటల్ మండి ప్రవేశ పాస్',
    subtitle: 'ఈ పాస్ మీ పరికరంలో భద్రపరచబడింది మరియు ఇంటర్నెట్ లేకపోయినా మండి గేట్ వద్ద చెల్లుతుంది.',
    tokenNumber: 'టోకెన్ సంఖ్య',
    tokenHash: 'క్రిప్టోగ్రాఫిక్ హాష్',
    farmerName: 'రైతు పేరు',
    farmerId: 'రైతు ఐడీ',
    village: 'గ్రామం',
    center: 'సేకరణ కేంద్రం',
    date: 'రాక తేదీ',
    timeSlot: 'సమయ స్లాట్',
    crop: 'దిగుబడి',
    quantity: 'పరిమాణం',
    vehicle: 'వాహనం',
    status: 'ప్రస్తుత స్థితి',
    statusValues: {
      BOOKED: 'బుక్ చేయబడింది',
      STAGING: 'బఫర్ యార్డ్',
      MANDI_GATE: 'గేట్ వద్ద అనుమతించబడింది',
      INSPECTION: 'తనిఖీ & తూకం కొనసాగుతోంది',
      COMPLETED: 'పూర్తయింది'
    },
    downloadPass: 'పాస్ డౌన్‌లోడ్',
    printPass: 'పాస్ ప్రింట్',
    sharePass: 'పాస్ షేర్',
    offlineBadge: 'ఆఫ్‌లైన్ సిద్ధం',
    offlineNotice: 'గేట్ సిబ్బంది ఇంటర్నెట్ లేకుండానే ఈ క్యూఆర్ కోడ్‌ను స్కాన్ చేసి ధృవీకరించగలరు.',
    noPassFound: 'యాక్టివ్ పాస్ కనుగొనబడలేదు',
    noPassDesc: 'ప్రస్తుతం మీ వద్ద ఎలాంటి యాక్టివ్ బుకింగ్ పాస్ లేదు.',
    bookSlotNow: 'ఇప్పుడే స్లాట్ బుక్ చేసుకోండి'
  },
  queueTracker: {
    title: 'లైవ్ క్యూ పురోగతి ట్రాకర్',
    subtitle: 'బయలుదేరడం నుండి చెల్లింపు వరకు వాహనం యొక్క నిజ-సమయ స్థితి.',
    yourPosition: 'మీ క్యూ స్థానం',
    vehiclesAhead: 'మీ కంటే ముందున్న వాహనాలు',
    estimatedWaitTime: 'అంచనా వేచి ఉండే సమయం',
    minutes: 'నిమిషాలు',
    assignedLane: 'కేటాయించిన వేబ్రిడ్జి లేన్',
    currentStage: 'ప్రస్తుత దశ',
    stages: {
      booked: {
        title: '౧. బుక్ చేయబడింది',
        desc: 'స్లాట్ నిర్ధారించబడింది. రవాణా కోసం పంటను సిద్ధం చేసుకోండి.'
      },
      staging: {
        title: '౨. బఫర్ యార్డ్',
        desc: 'మండి సమీపంలోని హోల్డింగ్ యార్డ్. గేట్ పిలుపు కోసం వేచి ఉండండి.'
      },
      gate: {
        title: '౩. గేట్ చెక్-ఇన్',
        desc: 'క్యూఆర్ టోకెన్ ధృవీకరించబడింది. సేకరణ యార్డులోకి అనుమతించబడింది.'
      },
      inspection: {
        title: '౪. నాణ్యత & తూకం',
        desc: 'నమూనా గ్రేడింగ్, ఖాళీ మరియు లోడ్ వాహన తూకం కొలత.'
      },
      completed: {
        title: '౫. పూర్తయింది',
        desc: 'తుది తూకం రసీదు జారీ చేయబడింది. నేరుగా బ్యాంక్ బదిలీ ద్వారా చెల్లింపు జరిగింది.'
      }
    },
    distanceSimulator: {
      title: 'GPS దూర సిమ్యులేటర్',
      desc: 'వాహన ప్రయాణ దూరాన్ని అనుకరించి డైనమిక్ క్యూ దశ మార్పులను చూడండి.',
      home: 'ఇంటి స్థానం (12 కి.మీ)',
      buffer: 'బఫర్ యార్డ్ (2 కి.మీ)',
      gate: 'మండి గేట్ (200 మీ)'
    }
  },
  notifications: {
    title: 'నోటిఫికేషన్‌లు మరియు హెచ్చరికలు',
    noNotifications: 'ప్రస్తుతం ఎలాంటి హెచ్చరికలు లేవు.',
    markAllRead: 'అన్నీ చదివినట్లు గుర్తించండి',
    dismiss: 'తీసివేయండి',
    notifBookingTitle: 'స్లాట్ విజయవంతంగా బుక్ చేయబడింది',
    notifBookingMsg: 'మీ రాక సమయం నిర్ధారించబడింది. డిజిటల్ పాస్ సిద్ధంగా ఉంది.',
    notifGateCheckinTitle: 'గేట్ చెక్-ఇన్ నిర్ధారించబడింది',
    notifGateCheckinMsg: 'మీ క్యూఆర్ టోకెన్ గేట్ వద్ద స్కాన్ చేయబడింది. దయచేసి కేటాయించిన లేన్‌కు వెళ్ళండి.',
    notifInspectionTitle: 'నాణ్యత తనిఖీ మరియు తూకం పూర్తయింది',
    notifInspectionMsg: 'పంట గ్రేడింగ్ మరియు తూకం పూర్తయింది. తుది చెల్లింపు రసీదు రూపొందించబడింది.',
    notifBreakdownTitle: 'ట్రాఫిక్ నోటీసు: వేబ్రిడ్జి నిర్వహణ',
    notifBreakdownMsg: 'పరికరాల నిర్వహణ జరుగుతోంది. వాహనాలు ప్రత్యామ్నాయ గేటుకు మళ్లించబడుతున్నాయి.',
    notifEmergencyTitle: 'ప్రాధాన్యతా లేన్ క్రియాశీలం',
    notifEmergencyMsg: 'వేగవంతమైన కదలిక కోసం అత్యవసర ప్రాధాన్యతా లేన్ ప్రారంభించబడింది.',
    notifTrafficTitle: 'ట్రాఫిక్ ప్రవాహ సమాచారం',
    notifTrafficMsg: 'మండి యార్డ్ ట్రాఫిక్ సాధారణ వేగంతో కదులుతోంది.'
  },
  adminDashboard: {
    title: 'మండి పరిపాలనా డాష్‌బోర్డ్',
    subtitle: 'ప్రత్యక్ష పర్యవేక్షణ, గేట్ భద్రతా స్కానర్, డైనమిక్ క్యూ నియంత్రణ మరియు వేబ్రిడ్జి తనిఖీలు.',
    liveOverview: 'అవలోకనం',
    gateScanner: 'గేట్ స్కానర్',
    queueControl: 'క్యూ నియంత్రణ',
    weighingInspection: 'నాణ్యత & తూకం',
    metrics: {
      dailyTokens: 'రోజువారీ టోకెన్లు',
      activeQueue: 'క్యూలో ఉన్న వాహనాలు',
      mandiCapacity: 'మండి సామర్థ్య వినియోగం',
      activeWeighbridges: 'క్రియాశీల వేబ్రిడ్జిలు',
      completedProcurement: 'పూర్తయిన సేకరణలు',
      totalDisbursed: 'మొత్తం సేకరణ విలువ'
    },
    scanner: {
      title: 'గేట్ క్యూఆర్ టోకెన్ స్కానర్',
      subtitle: 'రైతు ప్రవేశ టోకెన్ల ప్రామాణికతను తనిఖీ చేసి వాహనాలను యార్డులోకి అనుమతించండి.',
      cameraScanner: 'లైవ్ కెమెరా స్కానర్',
      cameraStandby: 'కెమెరా స్టాండ్‌బై',
      startCamera: 'కెమెరా ప్రారంభించండి',
      stopCamera: 'కెమెరా ఆపండి',
      scanWebcamBtn: 'వెబ్‌క్యామ్ ద్వారా స్కాన్ చేయండి',
      simulateScanBtn: 'పరీక్షా స్కాన్ అనుకరణ (A023)',
      manualInputPlaceholder: 'టోకెన్ సంఖ్య (ఉదా. A023) లేదా కోడ్ నమోదు చేయండి...',
      verifyTokenBtn: 'ధృవీకరించి అనుమతించండి',
      quickTestBtn: 'నమూనా టోకెన్లు',
      verifying: 'ధృవీకరిస్తోంది...',
      verifiedSuccess: 'టోకెన్ విజయవంతంగా ధృవీకరించబడింది. వాహనం యార్డులోకి అనుమతించబడింది.',
      invalidToken: 'చెల్లని టోకెన్. మండి రికార్డులలో గుర్తించబడలేదు.',
      admitVehicle: 'మండి గేట్ వద్ద అనుమతించండి',
      assignedLane: 'కేటాయించిన వేబ్రిడ్జి లేన్',
      cameraInstructions: 'రైతు డిజిటల్ క్యూఆర్ కోడ్‌ను స్కాన్ ఫ్రేమ్‌లో ఉంచండి',
      simulationRunning: 'లేజర్ స్కాన్ అనుకరణ జరుగుతోంది (A023)...'
    },
    queueManagement: {
      title: 'డైనమిక్ క్యూ మరియు ట్రాఫిక్ నియంత్రణలు',
      subtitle: 'లేన్ ప్రాధాన్యతలను నిర్వహించండి మరియు రద్దీని క్రమబద్ధీకరించండి.',
      emergencyLaneToggle: 'అత్యవసర ప్రాధాన్యతా లేన్',
      breakdownModeToggle: 'పరికరాల మరమ్మతు మోడ్',
      trafficRerouteToggle: 'ట్రాఫిక్ మళ్లింపు',
      rerouteGateLabel: 'మళ్లింపు గేట్',
      active: 'క్రియాశీలం',
      inactive: 'నిష్క్రియం',
      callNext: 'వాహనాన్ని పిలవండి',
      prioritize: 'ప్రాధాన్యత ఇవ్వండి',
      tableHeaders: {
        token: 'టోకెన్',
        farmer: 'రైతు',
        vehicle: 'వాహనం',
        cropQuantity: 'పంట & పరిమాణం',
        timeSlot: 'స్లాట్',
        status: 'స్థితి',
        actions: 'చర్యలు'
      }
    },
    weighingForm: {
      title: 'నాణ్యతా పరీక్ష మరియు వేబ్రిడ్జి కార్యకలాపాలు',
      subtitle: 'తేమ శాతం, గ్రేడ్, స్థూల బరువు మరియు ఖాళీ వాహన బరువును నమోదు చేయండి.',
      selectToken: 'వచ్చిన రైతు టోకెన్‌ను ఎంచుకోండి',
      qualityScore: 'నాణ్యత గ్రేడ్',
      moistureLevel: 'తేమ శాతం',
      moistureUnit: '%',
      dockageGrade: 'డ్రెస్సింగ్ గ్రేడ్',
      foreignMatter: 'ఇతర పదార్థాలు (%)',
      grossWeight: 'స్థూల బరువు (వాహనం + పంట)',
      tareWeight: 'ఖాళీ వాహన బరువు',
      netWeight: 'నికర పంట బరువు',
      mspRate: 'కనీస మద్దతు ధర (క్వింటాలుకు)',
      moisturePenalty: 'తేమ మినహాయింపు',
      netPayout: 'తుది చెల్లింపు మొత్తం',
      weightUnit: 'కిలోలు',
      approveAndIssue: 'ఆమోదించి రశీదు జారీ చేయండి',
      approvedSuccess: 'రశీదు రూపొందించబడింది మరియు ప్రత్యక్ష బ్యాంక్ బదిలీ ప్రారంభమైంది.',
      selectPrompt: 'తూకం ప్రారంభించడానికి రైతు టోకెన్‌ను ఎంచుకోండి'
    }
  },
  common: {
    quintal: 'క్వింటాల్',
    kg: 'కిలోలు',
    rupees: '₹',
    verified: 'ధృవీకరించబడింది',
    pending: 'వేచి ఉంది',
    close: 'మూసివేయండి',
    active: 'క్రియాశీలం',
    inactive: 'నిష్క్రియం',
    helpline: 'టోల్-ఫ్రీ కిసాన్ హెల్ప్‌లైన్: 1800-180-1551',
    allRightsReserved: 'స్మార్ట్ ఇండియా హ్యాకథాన్ నమూనా'
  },
  weatherInsights: {
    title: 'స్మార్ట్ వాతావరణ సలహా & హెచ్చరికల మాడ్యూల్',
    subtitle: 'ప్రాంతీయ సూక్ష్మ శీతోష్ణస్థితి సమాచారం మరియు వ్యవసాయ రక్షణ హెచ్చరికలు',
    tabTitle: 'వాతావరణం & సలహాలు',
    temperature: 'ఉష్ణోగ్రత',
    feelsLike: 'అనిపించే ఉష్ణోగ్రత',
    rainForecast: 'వర్షపాత సంభావ్యత',
    windSpeed: 'గాలి వేగం',
    humidity: 'తేమ శాతం',
    uvIndex: 'యూవీ సూచిక',
    pressure: 'వాయుపీడనం',
    rainAlertTitle: 'వర్షపు హెచ్చరిక',
    rainAlertMsg: 'వర్షం పడే అవకాశం ఉంది: కోసిన పంటను వెంటనే కప్పండి.',
    heatAlertTitle: 'తీవ్ర ఎండ హెచ్చరిక',
    heatAlertMsg: 'అధిక ఉష్ణోగ్రత: పంటలు మరియు పశువులకు నీడను కల్పించండి.',
    advisoryHeader: 'క్రియాశీల వ్యవసాయ సలహా హెచ్చరికలు',
    locationLabel: 'నమోదిత సేకరణ కేంద్రం',
    conditionNames: {
      sunny: 'స్పష్టమైన ఎండ',
      thunderstorm: 'ఉరుములతో కూడిన తుఫాను',
      rainy: 'భారీ వర్షం',
      cloudy: 'పాక్షిక మేఘావృతం',
      highHeat: 'తీవ్రమైన ఎండ',
      highWind: 'ఈదురు గాలులు'
    },
    severities: {
      critical: 'కీలక హెచ్చరిక',
      warning: 'వాతావరణ హెచ్చరిక',
      info: 'కార్యకలాపాల సమాచారం'
    },
    rainAlert: {
      title: 'వర్షపు హెచ్చరిక: పంట రక్షణ అవసరం',
      message: 'వర్షపు హెచ్చరిక: బయట ఉన్న కోత కోసిన పంటను (వరి/గోధుమ) వెంటనే కప్పండి. పురుగుమందుల పిచికారీని వాయిదా వేయండి.',
      action: 'బహిరంగ ప్రదేశంలో ఉన్న ధాన్యంపై వాటర్‌ప్రూఫ్ టార్పాలిన్ కవర్లను కప్పి, వర్షం తగ్గే వరకు పిచికారీని నిలిపివేయండి.'
    },
    heatAlert: {
      title: 'తీవ్ర ఎండ హెచ్చరిక: సూర్యరశ్మి & తేమ రక్షణ',
      message: 'ఎండ హెచ్చరిక: కోసిన పంటను నేరుగా ఎండ తగలకుండా కాపాడండి. పశువులకు తగినంత నీరు అందించండి.',
      action: 'ధాన్యం ఎండి బరువు తగ్గకుండా ఉండేందుకు నీడ ఉన్న ప్రదేశంలో భద్రపరచండి. పశువులకు తాజా నీటిని సమకూర్చండి.'
    },
    windAlert: {
      title: 'తీవ్ర గాలి హెచ్చరిక: వ్యవసాయ మౌలిక సదుపాయాల రక్షణ',
      message: 'గాలి హెచ్చరిక: తాత్కాలిక నిర్మాణాలను భద్రపరచండి. సున్నితమైన నీటిపారుదల పద్ధతులను నివారించండి.',
      action: 'నర్సరీ షెడ్లు మరియు టార్పాలిన్లను గట్టిగా కట్టండి; తీవ్రమైన గాలుల్లో స్ప్రింక్లర్ సాగును నివారించండి.'
    },
    procurementAlert: {
      title: 'సేకరణ కేంద్ర రవాణా సలహా',
      message: 'హెచ్చరిక: రేపు సేకరణ కేంద్రం వద్ద భారీ వర్షం కురిసే అవకాశం ఉంది. ప్రయాణించే ముందు కేంద్రం స్థితిని తనిఖీ చేయండి.',
      action: 'సుదీర్ఘ గేట్ క్యూలను నివారించడానికి మీ గ్రామం నుండి బయలుదేరే ముందు కిసాన్ సేతులో లైవ్ కేంద్రాన్ని పరిశీలించండి.'
    },
    tarpaulinAlert: {
      title: 'తేమ రక్షణ రవాణా హెచ్చరిక',
      message: 'టార్పాలిన్ రవాణా హెచ్చరిక: వేబ్రిడ్జి వద్ద తేమ కోతలను నివారించడానికి ధాన్యం బస్తాలపై వాటర్‌ప్రూఫ్ టార్పాలిన్ షీట్లను కప్పండి.',
      action: 'గేట్ బయలుదేరే ముందు వాహనం కవర్లను తనిఖీ చేయండి; 12% కంటే ఎక్కువ తేమ ఉంటే మద్దతు ధరలో కోత విధించబడుతుంది.'
    },
    favorableCondition: {
      title: 'అనుకూలమైన కోత & రవాణా పరిస్థితులు',
      message: 'వాతావరణం స్థిరంగా మరియు కోత, పొలం రవాణా మరియు మండి వేబ్రిడ్జి ప్రాసెసింగ్‌కు అనుకూలంగా ఉంది.',
      action: 'షెడ్యూల్ ప్రకారం పంట రవాణాను కొనసాగించండి. వాతావరణ అంతరాయాలు ఏవీ లేవు.'
    },
    simulation: {
      title: 'వాతావరణ దృశ్య అనుకరణ',
      subtitle: 'నిజ-సమయ నియమ ఇంజిన్ ప్రతిస్పందనను అంచనా వేయడానికి తీవ్ర వాతావరణాన్ని అనుకరించండి',
      scenarios: {
        rain: 'వర్షపు హెచ్చరిక (>60%)',
        heat: 'తీవ్రమైన ఎండ (>35°C)',
        wind: 'ఈదురు గాలులు (>20 km/h)',
        mandiRain: 'మండి భారీ వర్షం',
        favorable: 'అనుకూల నిర్మల ఆకాశం'
      },
      activeScenario: 'క్రియాశీల అనుకరణ మోడ్'
    },
    hourlyForecast: {
      title: '24-గంటల వాతావరణ సూచన',
      now: 'ఇప్పుడు'
    },
    logisticsImpact: {
      title: 'సేకరణ లాజిస్టిక్స్ ప్రభావం',
      appointmentNotice: 'మీ షెడ్యూల్ చేసిన స్లాట్‌కు అనుసంధానించబడింది',
      vehicleNotice: 'వాహన రక్షణ నియమావళి',
      viewCenterStatus: 'కేంద్రం స్థితిని చూడండి'
    },
    viewFullDashboard: 'వాతావరణ & సలహా కేంద్రాన్ని తెరవండి'
  },
  stages8: {
    slotBooked: '౧. స్లాట్ బుక్ చేయబడింది',
    gateCheckin: '౨. గేట్ చెక్-ఇన్',
    qualityTesting: '౩. నాణ్యత పరీక్ష',
    grossWeighing: '౪. స్థూల తూకం',
    unloading: '౫. అన్‌లోడింగ్',
    tareWeighing: '౬. ఖాళీ వాహన తూకం',
    procurement: '౭. సేకరణ ఆమోదం',
    digitalReceipt: '౮. డిజిటల్ రసీదు'
  },
  adminMetricsBanner: {
    totalBookings: 'మొత్తం బుకింగ్‌లు',
    checkedIn: 'గేట్ ప్రవేశం',
    waiting: 'వేచి ఉన్నారు',
    processing: 'ప్రక్రియలో ఉంది',
    completed: 'పూర్తయింది',
    delayed: 'ఆలస్యమైంది'
  },
  gateCheckInModal: {
    title: 'గేట్ ప్రవేశ ధృవీకరణ',
    subtitle: 'టోకెన్ క్యూఆర్ కోడ్‌ను ధృవీకరించి వాహనాన్ని మండి యార్డులోకి అనుమతించండి',
    farmerName: 'రైతు పేరు',
    farmerId: 'రైతు ఐడీ',
    crop: 'పంట',
    quantity: 'పరిమాణం',
    vehicle: 'వాహనం',
    timeSlot: 'సమయ స్లాట్',
    checkInAction: 'చెక్-ఇన్ (CHECK-IN)',
    successMessage: 'టోకెన్ ధృవీకరించబడింది మరియు గేట్ చెక్-ఇన్ నిర్ధారించబడింది!'
  },
  digitalReceipt: {
    title: 'డిజిటల్ సేకరణ రసీదు',
    subtitle: 'ప్రభుత్వ కనీస మద్దతు ధర (MSP) ధృవీకరించబడిన చెల్లింపు పత్రం',
    receiptId: 'రసీదు సంఖ్య',
    tokenNumber: 'టోకెన్ సంఖ్య',
    farmerName: 'రైతు పేరు',
    farmerId: 'రైతు ఐడీ',
    village: 'గ్రామం',
    crop: 'సేకరించిన పంట',
    dockageGrade: 'నాణ్యత గ్రేడ్',
    moistureLevel: 'తేమ శాతం',
    foreignMatter: 'ఇతర పదార్థాలు',
    grossWeight: 'స్థూల బరువు',
    tareWeight: 'ఖాళీ వాహన బరువు',
    netWeight: 'తుది నికర బరువు',
    mspRate: 'కనీస మద్దతు ధర',
    moistureDeduction: 'తేమ మినహాయింపు',
    totalPayable: 'మొత్తం చెల్లించవలసిన మొత్తం',
    paymentStatus: 'చెల్లింపు స్థితి',
    dbtStatus: 'డైరెక్ట్ బెనిఫిట్ ట్రాన్స్‌ఫర్ (DBT) విజయవంతం',
    downloadPdf: 'రసీదు డౌన్‌లోడ్ (PDF)',
    printReceipt: 'ప్రింట్ రసీదు',
    closeReceipt: 'మూసివేయండి',
    viewReceipt: 'డిజిటల్ రసీదు చూడండి',
    previewReceipt: 'రసీదు మునుజూపు',
    receiptNotice: 'ఈ రసీదు ఆధార్ ఆధారిత బ్యాంకు ఖాతాకు ప్రత్యక్ష చెల్లింపు కొరకు డిజిటల్ సంతకం చేయబడింది.',
    disbursementTime: 'చెల్లింపు సమయం',
    weighbridgeSlip: 'ఎలక్ట్రానిక్ వేబ్రిడ్జి తూకం రసీదు',
    govtSeal: 'భారత ప్రభుత్వం • వ్యవసాయ మరియు రైతు సంక్షేమ మంత్రిత్వ శాఖ',
    verifiedSignature: 'డిజిటల్ రూపంలో ధృవీకరించబడింది మరియు ఆమోదించబడింది',
    centerLabel: 'సేకరణ కేంద్రం',
    slotLabel: 'రాక సమయం'
  },
  voiceAssistant: {
    assistantTitle: 'కిసాన్ సేతు వాయిస్ అసిస్టెంట్',
    assistantSubtitle: 'హ్యాండ్స్-ఫ్రీ వాయిస్ నావిగేషన్ మరియు సహాయం',
    listening: 'వింటోంది... ఇప్పుడు మాట్లాడండి',
    speaking: 'సమాధానం చెబుతోంది...',
    ready: 'మాట్లాడటానికి మైక్రోఫోన్ నొక్కండి',
    notSupported: 'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు',
    micPermissionDenied: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి మైక్ అనుమతించండి.',
    commandsTitle: 'ఈ ఆదేశాలలో దేనినైనా చెప్పండి:',
    cmdBookSlot: 'స్లాట్ బుక్ చేయండి',
    cmdCheckQueue: 'క్యూ స్థితిని తనిఖీ చేయండి',
    cmdReadWeather: 'వాతావరణ హెచ్చరికను చదవండి',
    cmdDigitalPass: 'డిజిటల్ పాస్ చూపించండి',
    cmdStartGuided: 'వాయిస్ గైడెడ్ బుకింగ్ ప్రారంభించండి',
    playAudio: 'ఆడియో వినండి',
    stopAudio: 'ఆడియో ఆపండి',
    guidedTitle: 'వాయిస్ గైడెడ్ బుకింగ్ అసిస్టెంట్',
    guidedStep1: 'ఈరోజు మీరు ఏ పంటను అమ్మాలనుకుంటున్నారు? (ఉదా. వరి, గోధుమ, ఆవాలు, పత్తి, పప్పుధాన్యాలు)',
    guidedStep2: 'ఎన్ని క్వింటాళ్ల పరిమాణం? (ఉదా. 35 క్వింటాళ్లు)',
    guidedStep3: 'మీరు ఏ వాహనాన్ని తీసుకువస్తున్నారు? (ఉదా. ట్రాక్టర్, ట్రక్, ఎడ్ల బండి)',
    guidedConfirm: 'వివరాలన్నీ నమోదయ్యాయి. స్లాట్ విజయవంతంగా బుక్ చేయబడింది! మీ పాస్ సిద్ధంగా ఉంది.',
    guidedRestart: 'మళ్లీ ప్రారంభించండి',
    voiceDictation: 'వాయిస్ ద్వారా మాట్లాడి నమోదు చేయడానికి క్లిక్ చేయండి',
    quickCommands: 'శీఘ్ర వాయిస్ ఆదేశాలు',
    recognizedText: 'మీరు చెప్పినది:'
  }
};

// 4. PUNJABI (ਪੰਜਾਬੀ)
const pa: TranslationDict = {
  ...hi,
  brandName: 'ਕਿਸਾਨ ਸੇਤੂ',
  brandTagline: 'ਡਿਜੀਟਲ ਖੇਤੀਬਾੜੀ ਖਰੀਦ ਪ੍ਰਣਾਲੀ',
  langSwitchLabel: 'ਭਾਸ਼ਾ ਚੁਣੋ',
  activeLanguage: 'ਪੰਜਾਬੀ',
  roleSwitcher: {
    farmer: 'ਕਿਸਾਨ ਐਪ',
    admin: 'ਪ੍ਰਬੰਧਕ ਡੈਸ਼ਬੋਰਡ',
    farmerDesc: 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ, ਸਲਾਟ ਬੁਕਿੰਗ ਅਤੇ ਲਾਈਵ ਕਤਾਰ ਪਾਸ',
    adminDesc: 'ਮੰਡੀ ਗੇਟ ਸਕੈਨਰ, ਯਾਰਡ ਕਤਾਰ ਅਤੇ ਤੋਲ ਕੇਂਦਰ'
  },
  crops: {
    ...hi.crops,
    PADDY: 'ਝੋਨਾ',
    WHEAT: 'ਕਣਕ',
    MAIZE: 'ਮੱਕੀ',
    RED_GRAM: 'ਅਰਹਰ ਦਾਲ',
    BENGAL_GRAM: 'ਛੋਲੇ',
    GREEN_GRAM: 'ਮੂੰਗ ਦਾਲ',
    GROUNDNUT: 'ਮੂੰਗਫਲੀ',
    SOYBEAN: 'ਸੋਇਆਬੀਨ'
  },
  centerStatus: {
    open: 'ਖੁੱਲ੍ਹਾ',
    busy: 'ਰੁਝਿਆ',
    closed: 'ਬੰਦ'
  },
  centerDetails: {
    currentQueue: 'ਮੌਜੂਦਾ ਕਤਾਰ',
    estimatedWaiting: 'ਅੰਦਾਜ਼ਨ ਉਡੀਕ ਸਮਾਂ',
    availableSlots: 'ਉਪਲਬਧ ਸਲਾਟ',
    location: 'ਸਥਾਨ ਅਤੇ ਦੂਰੀ',
    selectCenter: 'ਖਰੀਦ ਕੇਂਦਰ ਚੁਣੋ',
    selected: 'ਚੁਣਿਆ ਗਿਆ ਕੇਂਦਰ',
    vehiclesWaiting: 'ਵਾਹਨ ਕਤਾਰ ਵਿੱਚ',
    minsWait: 'ਮਿੰਟ',
    slotsOpenToday: 'ਸਲਾਟ ਅੱਜ ਉਪਲਬਧ'
  },
  farmerIntake: {
    centerTitle: '੧. ਖਰੀਦ ਕੇਂਦਰ ਚੁਣੋ',
    centerSubtitle: 'ਲਾਈਵ ਕਤਾਰ ਅਤੇ ਉਡੀਕ ਸਮੇਂ ਦੇ ਆਧਾਰ ਤੇ ਆਪਣੀ ਫਸਲ ਵੇਚਣ ਲਈ ਕੇਂਦਰ ਚੁਣੋ।',
    cropTitle: '੨. ਫਸਲ ਚੁਣੋ',
    cropSubtitle: 'ਆਪਣੀ ਮੁੱਖ ਫਸਲ ਚੁਣੋ। ਪ੍ਰੋਟੋਟਾਈਪ ਲਈ ਝੋਨਾ ਡਿਫਾਲਟ ਹੈ।',
    detailsTitle: '੩. ਮਾਤਰਾ ਅਤੇ ਵਾਹਨ ਵੇਰਵਾ',
    detailsSubtitle: 'ਅੰਦਾਜ਼ਨ ਮਾਤਰਾ ਅਤੇ ਮੰਡੀ ਪਹੁੰਚਣ ਲਈ ਆਪਣਾ ਵਾਹਨ ਚੁਣੋ।',
    demoStar: 'ਡੈਮੋ ਮੁੱਖ ਫਸਲ',
    selectedCropLabel: 'ਚੁਣੀ ਗਈ ਫਸਲ',
    quantityLabel: 'ਮਾਤਰਾ (ਕੁਇੰਟਲ ਵਿੱਚ)',
    quantityUnit: 'ਕੁਇੰਟਲ',
    vehicleLabel: 'ਵਾਹਨ ਦੀ ਚੋਣ',
    confirmBookingBtn: 'ਕੇਂਦਰ ਚੋਣ ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਪਾਸ ਲਵੋ',
    bookingNotice: 'ਕਿਊਆਰ ਕੋਡ ਵਾਲਾ ਡਿਜੀਟਲ ਪਾਸ ਤੁਰੰਤ ਜਾਰੀ ਹੋਵੇਗਾ।'
  }
};

// 5. MARATHI (मराठी)
const mr: TranslationDict = {
  ...hi,
  brandName: 'किसान सेतू',
  brandTagline: 'डिजिटल कृषी खरेदी व्यासपीठ',
  langSwitchLabel: 'भाषा निवडा',
  activeLanguage: 'मराठी',
  roleSwitcher: {
    farmer: 'शेतकरी ॲप',
    admin: 'प्रशासक डॅशबोर्ड',
    farmerDesc: 'नोंदणी, स्लॉट बुकिंग आणि थेट रांग पास',
    adminDesc: 'मंडी गेट स्कॅनर, यार्ड रांग आणि वजन केंद्र संचालन'
  },
  crops: {
    ...hi.crops,
    PADDY: 'भात',
    WHEAT: 'गहू',
    MAIZE: 'मका',
    RED_GRAM: 'तूर डाळ',
    BENGAL_GRAM: 'हरभरा',
    GREEN_GRAM: 'मूग डाळ',
    GROUNDNUT: 'भुईमूग',
    SOYBEAN: 'सोयाबीन'
  },
  centerStatus: {
    open: 'उघडे',
    busy: 'व्यस्त',
    closed: 'बंद'
  },
  centerDetails: {
    currentQueue: 'सध्याची रांग',
    estimatedWaiting: 'अंदाजे प्रतीक्षा वेळ',
    availableSlots: 'उपलब्ध स्लॉट',
    location: 'स्थान आणि अंतर',
    selectCenter: 'खरेदी केंद्र निवडा',
    selected: 'निवडलेले केंद्र',
    vehiclesWaiting: 'वाहने रांगेत',
    minsWait: 'मिनिटे',
    slotsOpenToday: 'स्लॉट आज उपलब्ध'
  },
  farmerIntake: {
    centerTitle: '१. खरेदी केंद्र निवडा',
    centerSubtitle: 'थेट रांग आणि प्रतीक्षा वेळेच्या आधारे विक्री केंद्र निवडा.',
    cropTitle: '२. पीक निवडा',
    cropSubtitle: 'आपले मुख्य पीक निवडा. डेमोसाठी भात ठळक केले आहे.',
    detailsTitle: '३. प्रमाण आणि वाहन तपशील',
    detailsSubtitle: 'अंदाजे प्रमाण आणि बाजार समितीसाठी आपले वाहन निवडा.',
    demoStar: 'डेमो मुख्य पीक',
    selectedCropLabel: 'निवडलेले पीक',
    quantityLabel: 'प्रमाण (क्विंटलमध्ये)',
    quantityUnit: 'क्विंटल',
    vehicleLabel: 'वाहन निवड',
    confirmBookingBtn: 'केंद्र निश्चित करा आणि पास मिळवा',
    bookingNotice: 'क्यूआर कोडसह डिजिटल पास त्वरित जारी केला जाईल.'
  }
};

// 6. TAMIL (தமிழ்)
const ta: TranslationDict = {
  ...en,
  brandName: 'கிசான் சேது',
  brandTagline: 'டிஜிட்டல் விவசாய கொள்முதல் தளம்',
  langSwitchLabel: 'மொழியைத் தேர்ந்தெடுக்கவும்',
  activeLanguage: 'தமிழ்',
  crops: {
    ...en.crops,
    PADDY: 'நெல்',
    WHEAT: 'கோதுமை',
    MAIZE: 'மக்காச்சோளம்',
    RED_GRAM: 'துவரம் பருப்பு',
    BENGAL_GRAM: 'கொண்டைக்கடலை',
    GREEN_GRAM: 'பாசிப்பயறு',
    GROUNDNUT: 'வேர்க்கடலை',
    SOYBEAN: 'சோயாபீன்'
  },
  centerStatus: {
    open: 'திறந்துள்ளது',
    busy: 'நெரிசல்',
    closed: 'மூடப்பட்டுள்ளது'
  },
  centerDetails: {
    currentQueue: 'தற்போதைய வரிசை',
    estimatedWaiting: 'தோராயமான காத்திருப்பு நேரம்',
    availableSlots: 'கிடைக்கும் முன்பதிவு நேரம்',
    location: 'இடம் மற்றும் தூரம்',
    selectCenter: 'கொள்முதல் மையத்தைத் தேர்ந்தெடுக்கவும்',
    selected: 'தேர்ந்தெடுக்கப்பட்ட மையம்',
    vehiclesWaiting: 'காத்திருக்கும் வாகனங்கள்',
    minsWait: 'நிமிடங்கள்',
    slotsOpenToday: 'இன்று கிடைக்கும் நேரங்கள்'
  },
  farmerIntake: {
    centerTitle: '௧. கொள்முதல் மையத்தைத் தேர்வுசெய்க',
    centerSubtitle: 'நேரடி வரிசை மற்றும் காத்திருப்பு நேரத்தின் அடிப்படையில் மையத்தைத் தேர்ந்தெடுக்கவும்.',
    cropTitle: '௨. பயிரைத் தேர்வுசெய்க',
    cropSubtitle: 'உங்கள் முதன்மை பயிரைத் தேர்ந்தெடுக்கவும். நெல் முதன்மையாக தேர்வு செய்யப்பட்டுள்ளது.',
    detailsTitle: '௩. அளவு மற்றும் வாகன விவரங்கள்',
    detailsSubtitle: 'தோராயமான அளவு மற்றும் உங்கள் வாகன வகையைத் தேர்ந்தெடுக்கவும்.',
    demoStar: 'மாதிரி முதன்மை பயிர்',
    selectedCropLabel: 'தேர்ந்தெடுக்கப்பட்ட பயிர்',
    quantityLabel: 'அளவு (குவிண்டாலில்)',
    quantityUnit: 'குவிண்டால்',
    vehicleLabel: 'வாகனத் தேர்வு',
    confirmBookingBtn: 'மையத்தை உறுதிசெய்து பாஸைப் பெறவும்',
    bookingNotice: 'கியூஆர் குறியீடு பாஸ் உடனடியாக உருவாக்கப்படும்.'
  }
};

// 7. BENGALI (বাংলা)
const bn: TranslationDict = {
  ...en,
  brandName: 'কিসান সেতু',
  brandTagline: 'ডিজিটাল কৃষি সংগ্রহ প্ল্যাটফর্ম',
  langSwitchLabel: 'ভাষা নির্বাচন করুন',
  activeLanguage: 'বাংলা',
  crops: {
    ...en.crops,
    PADDY: 'ধান',
    WHEAT: 'গম',
    MAIZE: 'ভুট্টা',
    RED_GRAM: 'অরহর ডাল',
    BENGAL_GRAM: 'ছোলা',
    GREEN_GRAM: 'মুগ ডাল',
    GROUNDNUT: 'চীনাবাদাম',
    SOYBEAN: 'সয়াবিন'
  },
  centerStatus: {
    open: 'খোলা',
    busy: 'ব্যস্ত',
    closed: 'বন্ধ'
  },
  centerDetails: {
    currentQueue: 'বর্তমান সারি',
    estimatedWaiting: 'আনুমানিক অপেক্ষার সময়',
    availableSlots: 'উপলব্ধ স্লট',
    location: 'অবস্থান এবং দূরত্ব',
    selectCenter: 'সংগ্রহ কেন্দ্র নির্বাচন করুন',
    selected: 'নির্বাচিত কেন্দ্র',
    vehiclesWaiting: 'অপেক্ষমাণ যানবাহন',
    minsWait: 'মিনিট',
    slotsOpenToday: 'আজকের উপলব্ধ স্লট'
  },
  farmerIntake: {
    centerTitle: '১. সংগ্রহ কেন্দ্র নির্বাচন করুন',
    centerSubtitle: 'সারি এবং অপেক্ষার সময়ের উপর ভিত্তি করে কেন্দ্র বেছে নিন।',
    cropTitle: '২. ফসল নির্বাচন করুন',
    cropSubtitle: 'আপনার প্রধান ফসল নির্বাচন করুন। ডেমোর জন্য ধান হাইলাইট করা হয়েছে।',
    detailsTitle: '৩. পরিমাণ এবং যানবাহনের বিবরণ',
    detailsSubtitle: 'আনুমানিক পরিমাণ এবং আপনার পরিবহন মাধ্যম বেছে নিন।',
    demoStar: 'ডেমো প্রধান ফসল',
    selectedCropLabel: 'নির্বাচিত ফসল',
    quantityLabel: 'পরিমাণ (কুইন্টালে)',
    quantityUnit: 'কুইন্টাল',
    vehicleLabel: 'যানবাহন নির্বাচন',
    confirmBookingBtn: 'কেন্দ্র নিশ্চিত করুন এবং পাস পান',
    bookingNotice: 'কিউআর কোড যুক্ত ডিজিটাল পাস অবিলম্বে জারি করা হবে।'
  }
};

// 8. GUJARATI (ગુજરાતી)
const gu: TranslationDict = {
  ...en,
  brandName: 'કિસાન સેતુ',
  brandTagline: 'ડિજિટલ કૃષિ પ્રાપ્તિ મંચ',
  langSwitchLabel: 'ભાષા પસંદ કરો',
  activeLanguage: 'ગુજરાતી',
  crops: {
    ...en.crops,
    PADDY: 'ડાંગર',
    WHEAT: 'ઘઉં',
    MAIZE: 'મકાઈ',
    RED_GRAM: 'તુવેર દાળ',
    BENGAL_GRAM: 'ચણા',
    GREEN_GRAM: 'મગ',
    GROUNDNUT: 'મગફળી',
    SOYBEAN: 'સોયાબીન'
  },
  centerStatus: {
    open: 'ખુલ્લું',
    busy: 'વ્યસ્ત',
    closed: 'બંધ'
  },
  centerDetails: {
    currentQueue: 'વર્તમાન કતાર',
    estimatedWaiting: 'અંદાજિત પ્રતીક્ષા સમય',
    availableSlots: 'ઉપલબ્ધ સ્લોટ',
    location: 'સ્થાન અને અંતર',
    selectCenter: 'ખરીદી કેન્દ્ર પસંદ કરો',
    selected: 'પસંદ કરેલ કેન્દ્ર',
    vehiclesWaiting: 'કતારમાં વાહનો',
    minsWait: 'મિનિટ',
    slotsOpenToday: 'આજે ઉપલબ્ધ સ્લોટ'
  },
  farmerIntake: {
    centerTitle: '૧. ખરીદી કેન્દ્ર પસંદ કરો',
    centerSubtitle: 'લાઈવ કતાર અને પ્રતીક્ષા સમયના આધારે માર્કેટ યાર્ડ પસંદ કરો.',
    cropTitle: '૨. પાક પસંદ કરો',
    cropSubtitle: 'તમારો મુખ્ય પાક પસંદ કરો. ડેમો માટે ડાંગર પ્રમુખ છે.',
    detailsTitle: '૩. જથ્થો અને વાહનની વિગત',
    detailsSubtitle: 'અંદાજિત જથ્થો અને પરિવહન માટે વાહન પસંદ કરો.',
    demoStar: 'ડેમો મુખ્ય પાક',
    selectedCropLabel: 'પસંદ કરેલ પાક',
    quantityLabel: 'જથ્થો (ક્વિન્ટલમાં)',
    quantityUnit: 'ક્વિન્ટલ',
    vehicleLabel: 'વાહનની પસંદગી',
    confirmBookingBtn: 'કેન્દ્ર પસંદગી કન્ફર્મ કરો અને પાસ મેળવો',
    bookingNotice: 'ક્યુઆર કોડ સાથે ડિજિટલ પાસ તરત જ મળશે.'
  }
};

// 9. KANNADA (ಕನ್ನಡ)
const kn: TranslationDict = {
  ...en,
  brandName: 'ಕಿಸಾನ್ ಸೇತು',
  brandTagline: 'ಡಿಜಿಟಲ್ ಕೃಷಿ ಸಂಗ್ರಹಣಾ ವೇದಿಕೆ',
  langSwitchLabel: 'ಭಾಷೆಯನ್ನು ಆರಿಸಿ',
  activeLanguage: 'ಕನ್ನಡ',
  crops: {
    ...en.crops,
    PADDY: 'ಭತ್ತ',
    WHEAT: 'ಗೋಧಿ',
    MAIZE: 'ಮೆಕ್ಕೆಜೋಳ',
    RED_GRAM: 'ತೊಗರಿ ಬೇಳೆ',
    BENGAL_GRAM: 'ಕಡಲೆ',
    GREEN_GRAM: 'ಹೆಸರು ಕಾಳು',
    GROUNDNUT: 'ಕಡಲೆಕಾಯಿ',
    SOYBEAN: 'ಸೋಯಾಬೀನ್'
  },
  centerStatus: {
    open: 'ತೆರೆದಿದೆ',
    busy: 'ಕಾರ್ಯನಿರತ',
    closed: 'ಮುಚ್ಚಲಾಗಿದೆ'
  },
  centerDetails: {
    currentQueue: 'ಪ್ರಸ್ತುತ ಸರತಿ',
    estimatedWaiting: 'ಅಂದಾಜು ಕಾಯುವ ಸಮಯ',
    availableSlots: 'ಲಭ್ಯವಿರುವ ಸ್ಲಾಟ್‌ಗಳು',
    location: 'ಸ್ಥಳ ಮತ್ತು ದೂರ',
    selectCenter: 'ಸಂಗ್ರಹಣಾ ಕೇಂದ್ರ ಆಯ್ಕೆಮಾಡಿ',
    selected: 'ಆಯ್ಕೆಮಾಡಿದ ಕೇಂದ್ರ',
    vehiclesWaiting: 'ವಾಹನಗಳು ಕಾಯುತ್ತಿವೆ',
    minsWait: 'ನಿಮಿಷಗಳು',
    slotsOpenToday: 'ಇಂದು ಲಭ್ಯವಿರುವ ಸ್ಲಾಟ್‌ಗಳು'
  },
  farmerIntake: {
    centerTitle: '೧. ಸಂಗ್ರಹಣಾ ಕೇಂದ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    centerSubtitle: 'ಸರತಿ ಸಾಲು ಮತ್ತು ಕಾಯುವ ಸಮಯದ ಆಧಾರದ ಮೇಲೆ ಕೇಂದ್ರವನ್ನು ಆರಿಸಿ.',
    cropTitle: '೨. ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ',
    cropSubtitle: 'ನಿಮ್ಮ ಪ್ರಮುಖ ಬೆಳೆ ಆರಿಸಿ. ಡೆಮೊಗಾಗಿ ಭತ್ತವನ್ನು ಪೂರ್ವನಿಯೋಜಿತವಾಗಿ ಹೊಂದಿಸಲಾಗಿದೆ.',
    detailsTitle: '೩. ಪ್ರಮಾಣ ಮತ್ತು ವಾಹನದ ವಿವರಗಳು',
    detailsSubtitle: 'ಅಂದಾಜು ಪ್ರಮಾಣ ಮತ್ತು ಮಂಡಿ ಪ್ರವೇಶಕ್ಕೆ ವಾಹನವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    demoStar: 'ಡೆಮೊ ಮುಖ್ಯ ಬೆಳೆ',
    selectedCropLabel: 'ಆಯ್ಕೆಮಾಡಿದ ಬೆಳೆ',
    quantityLabel: 'ಪ್ರಮಾಣ (ಕ್ವಿಂಟಾಲ್‌ನಲ್ಲಿ)',
    quantityUnit: 'ಕ್ವಿಂಟಾಲ್',
    vehicleLabel: 'ವಾಹನದ ಆಯ್ಕೆ',
    confirmBookingBtn: 'ಕೇಂದ್ರ ದೃಢೀಕರಿಸಿ ಮತ್ತು ಪಾಸ್ ಪಡೆಯಿರಿ',
    bookingNotice: 'ಕ್ಯೂಆರ್ ಕೋಡ್ ಡಿಜಿಟಲ್ ಪಾಸ್ ತಕ್ಷಣ ರಚನೆಯಾಗುತ್ತದೆ.'
  }
};

export const translations: Record<Language, TranslationDict> = {
  en,
  hi,
  pa,
  mr,
  te,
  ta,
  bn,
  gu,
  kn
};
