export type Language = 'hi' | 'en' | 'te';

export interface TranslationDict {
  brandName: string;
  brandTagline: string;
  langSwitchLabel: string;
  activeLanguage: string;
  tabs: {
    booking: string;
    offlinePass: string;
    queueStatus: string;
    gateScanner: string;
    howItWorks: string;
  };
  wizard: {
    stepTitle: string;
    step1Title: string;
    step1Subtitle: string;
    step2Title: string;
    step2Subtitle: string;
    step3Title: string;
    step3Subtitle: string;
    crops: {
      paddy: { name: string; desc: string };
      wheat: { name: string; desc: string };
      pulses: { name: string; desc: string };
    };
    weightLabel: string;
    weightPlaceholder: string;
    weightUnit: string;
    quickAdd: string;
    selectCenterLabel: string;
    selectDateLabel: string;
    selectSlotLabel: string;
    capacityBadges: {
      available: string;
      moderate: string;
      full: string;
    };
    vehicles: {
      bullockCart: { name: string; unloadTime: string; desc: string };
      tractor: { name: string; unloadTime: string; desc: string };
      truck: { name: string; unloadTime: string; desc: string };
    };
    nextStep: string;
    prevStep: string;
    submitBooking: string;
    submitting: string;
  };
  booking: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    selectCenter: string;
    selectCenterPlaceholder: string;
    selectFarmer: string;
    selectDate: string;
    today: string;
    tomorrow: string;
    selectSlot: string;
    capacityAvailable: string;
    capacityFull: string;
    slotsLoading: string;
    noSlots: string;
    vehicleType: string;
    vehicleTractor: string;
    vehicleBullockCart: string;
    vehicleTruck: string;
    cropType: string;
    cropWheat: string;
    cropPaddy: string;
    cropMustard: string;
    cropGram: string;
    estimatedWeight: string;
    weightUnit: string;
    submitBooking: string;
    submitting: string;
    bookingSuccess: string;
    bookingError: string;
  };
  offlinePass: {
    title: string;
    subtitle: string;
    noPassFound: string;
    noPassDesc: string;
    bookNowBtn: string;
    savedOfflineBadge: string;
    officialGovtToken: string;
    tokenNumberLabel: string;
    centerLabel: string;
    slotLabel: string;
    vehicleLabel: string;
    cropWeightLabel: string;
    farmerLabel: string;
    offlineNotice: string;
    printPass: string;
    sharePass: string;
  };
  tokenPass: {
    modalTitle: string;
    officialPass: string;
    tokenHashLabel: string;
    farmerLabel: string;
    villageLabel: string;
    centerLabel: string;
    slotLabel: string;
    vehicleLabel: string;
    cropLabel: string;
    weightLabel: string;
    statusLabel: string;
    statusBooked: string;
    offlineNotice: string;
    printPass: string;
    close: string;
  };
  queueCard: {
    title: string;
    subtitle: string;
    stages: {
      home: string;
      staging: string;
      gate: string;
      inspection: string;
      payment: string;
    };
    currentDistance: string;
    activeInstruction: string;
  };
  queueVisualizer: {
    title: string;
    subtitle: string;
    currentStage: string;
    distanceAway: string;
    geofenceStatus: string;
    gpsSimulatorTitle: string;
    gpsSimulatorDesc: string;
    presetHome: string;
    presetBuffer: string;
    presetGate: string;
    stages: {
      home: { title: string; subtitle: string };
      buffer: { title: string; subtitle: string };
      gate: { title: string; subtitle: string };
      inspection: { title: string; subtitle: string };
      payment: { title: string; subtitle: string };
    };
    capacityEngineTitle: string;
    capacityEngineSubtitle: string;
    weighbridges: string;
    utilization: string;
    congestionState: string;
    unloadingBenchmarks: string;
    estimatedWaitTime: string;
    offlineTokenTitle: string;
    offlineTokenSubtitle: string;
  };
  gateScanner: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    verifyButton: string;
    verifying: string;
    scanSampleBtn: string;
    verifiedSuccess: string;
    verificationFailed: string;
    vehicleEntryAllowed: string;
    vehicleEntryDenied: string;
    markGateEntry: string;
    markedEntrySuccess: string;
    weighbridgeLabel: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  // 1. HINDI (हिंदी)
  hi: {
    brandName: 'किसान सेतु',
    brandTagline: 'Smart Procurement Gateway (स्मार्ट खरीद प्रवेश द्वार)',
    langSwitchLabel: 'भाषा बदलें (Language)',
    activeLanguage: 'हिंदी',
    tabs: {
      booking: 'स्लॉट बुकिंग (Farmer)',
      offlinePass: 'ऑफलाइन पास (PWA Pass)',
      queueStatus: 'कतार स्थिति (Queue)',
      gateScanner: 'गेट सत्यापन (Gate Staff)',
      howItWorks: 'जानकारी'
    },
    wizard: {
      stepTitle: 'चरण',
      step1Title: '1. फसल का चयन एवं अनुमानित वजन',
      step1Subtitle: 'अपनी फसल (धान, गेहूं, दालें) चुनें और अनुमानित वजन क्विंटल में दर्ज करें।',
      step2Title: '2. नजदीकी खरीद केंद्र एवं समय स्लॉट',
      step2Subtitle: 'वे-ब्रिज क्षमता के आधार पर उपलब्ध समय खिड़की चुनें।',
      step3Title: '3. वाहन के प्रकार का चयन करें',
      step3Subtitle: 'अपने परिवहन साधन (बैलगाड़ी, ट्रैक्टर, ट्रक) का चयन करें।',
      crops: {
        paddy: { name: 'धान (Paddy / Rice)', desc: 'खरीफ मुख्य उपज' },
        wheat: { name: 'गेहूं (Wheat)', desc: 'रबी प्रमुख खाद्यान्न' },
        pulses: { name: 'दालें (Pulses / चना, मूंग)', desc: 'दलहन फसल' }
      },
      weightLabel: 'अनुमानित वजन दर्ज करें (क्विंटल)',
      weightPlaceholder: 'उदा. 45',
      weightUnit: 'क्विंटल',
      quickAdd: 'त्वरित जोड़ें:',
      selectCenterLabel: 'नजदीकी खरीद केंद्र (मंडी) चुनें',
      selectDateLabel: 'खरीद की तारीख',
      selectSlotLabel: 'उपलब्ध समय स्लॉट (क्षमता स्थिति)',
      capacityBadges: {
        available: 'उपलब्ध (Available)',
        moderate: 'मध्यम (Moderate)',
        full: 'भर चुका है (Full)'
      },
      vehicles: {
        bullockCart: { name: 'बैलगाड़ी (Bullock Cart)', unloadTime: '25 मिनट अनलोडिंग', desc: 'पारंपरिक ग्रामीण वाहन' },
        tractor: { name: 'ट्रैक्टर-ट्रॉली (Tractor)', unloadTime: '15 मिनट अनलोडिंग', desc: 'हाइड्रोलिक अनलोडिंग' },
        truck: { name: 'ट्रक (Commercial Truck)', unloadTime: '10 मिनट अनलोडिंग', desc: 'तीव्र हॉपर अनलोडिंग' }
      },
      nextStep: 'अगला चरण (Next)',
      prevStep: 'पिछला (Back)',
      submitBooking: 'सुरक्षित टोकन जारी करें (Generate SHA-256 Token)',
      submitting: 'टोकन पास बन रहा है...'
    },
    booking: {
      title: 'मंडी खरीद स्लॉट बुक करें',
      subtitle: 'भीड़ और लंबी लाइनों से बचने के लिए अपनी फसल लाने का समय पहले से चुनें।',
      step1: '1. खरीद केंद्र और तारीख चुनें',
      step2: '2. समय स्लॉट चुनें',
      step3: '3. फसल और वाहन का विवरण दें',
      selectCenter: 'खरीद केंद्र (मंडी) का चयन करें',
      selectCenterPlaceholder: '-- अपनी नजदीकी मंडी चुनें --',
      selectFarmer: 'किसान प्रोफ़ाइल चुनें (Aadhaar सम्बद्ध)',
      selectDate: 'खरीद की तारीख चुनें',
      today: 'आज',
      tomorrow: 'कल',
      selectSlot: 'उपलब्ध समय खिड़की (Hourly Capacity)',
      capacityAvailable: 'स्थान शेष',
      capacityFull: 'स्लॉट भर चुका है (Full)',
      slotsLoading: 'स्लॉट लोड हो रहे हैं...',
      noSlots: 'इस तारीख के लिए कोई स्लॉट उपलब्ध नहीं है।',
      vehicleType: 'वाहन का प्रकार चुनें',
      vehicleTractor: 'ट्रैक्टर-ट्रॉली (Tractor)',
      vehicleBullockCart: 'बैलगाड़ी (Bullock Cart)',
      vehicleTruck: 'ट्रक (Truck)',
      cropType: 'फसल का नाम',
      cropWheat: 'गेहूं (Wheat)',
      cropPaddy: 'धान / चावल (Paddy)',
      cropMustard: 'सरसों (Mustard)',
      cropGram: 'चना (Gram)',
      estimatedWeight: 'अनुमानित वजन (क्विंटल)',
      weightUnit: 'क्विंटल',
      submitBooking: 'सुरक्षित टोकन जारी करें (Generate SHA-256 Token)',
      submitting: 'टोकन तैयार किया जा रहा है...',
      bookingSuccess: 'स्लॉट सफलतापूर्वक बुक हो गया! आपका ऑफलाइन टोकन जारी कर दिया गया है।',
      bookingError: 'स्लॉट बुकिंग में त्रुटि हुई। कृपया पुनः प्रयास करें।'
    },
    offlinePass: {
      title: 'किसान सेतु डिजिटल प्रवेश पास (PWA Cached)',
      subtitle: 'यह पास आपकी डिवाइस में सुरक्षित है और बिना इंटरनेट के भी मंडी गेट पर मान्य है।',
      noPassFound: 'कोई सक्रिय टोकन पास नहीं मिला',
      noPassDesc: 'आपने अभी तक कोई स्लॉट बुक नहीं किया है। कृपया पहले 3-चरणीय बुकिंग पूर्ण करें।',
      bookNowBtn: 'अभी नया स्लॉट बुक करें',
      savedOfflineBadge: 'ऑफ़लाइन सुरक्षित (PWA Cached)',
      officialGovtToken: 'भारत सरकार - ई-उपार्जन डिजिटल प्रवेश टोकन',
      tokenNumberLabel: 'SHA-256 एन्क्रिप्टेड टोकन संख्या',
      centerLabel: 'खरीद केंद्र (मंडी)',
      slotLabel: 'तय समय खिड़की',
      vehicleLabel: 'वाहन का प्रकार',
      cropWeightLabel: 'फसल एवं कुल वजन',
      farmerLabel: 'किसान का नाम',
      offlineNotice: 'मंडी गेट सुरक्षा अधिकारी इस क्यूआर कोड को बिना नेटवर्क के भी ऑफलाइन स्कैन और सत्यापित कर सकते हैं।',
      printPass: 'प्रिंट / पीडीएफ सेव करें',
      sharePass: 'पास साझा करें'
    },
    tokenPass: {
      modalTitle: 'किसान प्रवेश पास (Offline Mandi Pass)',
      officialPass: 'भारत सरकार - ई-उपार्जन डिजिटल प्रवेश टोकन',
      tokenHashLabel: 'SHA-256 एन्क्रिप्टेड डिजिटल टोकन स्ट्रिंग',
      farmerLabel: 'किसान का नाम',
      villageLabel: 'गाँव / क्षेत्र',
      centerLabel: 'खरीद केंद्र (मंडी)',
      slotLabel: 'तय समय खिड़की',
      vehicleLabel: 'वाहन का प्रकार',
      cropLabel: 'फसल एवं वजन',
      weightLabel: 'वजन',
      statusLabel: 'स्थिति',
      statusBooked: 'स्लॉट आरक्षित (BOOKED)',
      offlineNotice: 'यह टोकन ऑफलाइन सत्यापन योग्य है। इंटरनेट न होने पर भी मंडी गेट पर क्यूआर कोड या टोकन संख्या मान्य होगी।',
      printPass: 'पास डाउनलोड / प्रिंट करें',
      close: 'बंद करें'
    },
    queueCard: {
      title: 'लाइव कतार एवं प्रगति ट्रैकर (Queue Progress)',
      subtitle: 'घर से लेकर सीधे बैंक खाते में भुगतान तक की 5-चरणीय रीयल-टाइम स्थिति।',
      stages: {
        home: '1. घर पर (Home)',
        staging: '2. बफर यार्ड (Staging)',
        gate: '3. मंडी गेट (Mandi Gate)',
        inspection: '4. गुणवत्ता जांच (Inspection)',
        payment: '5. भुगतान संपन्न (Payment Done)'
      },
      currentDistance: 'मंडी से वर्तमान दूरी',
      activeInstruction: 'निर्देश'
    },
    queueVisualizer: {
      title: 'लाइव कतार एवं जियोफेंस्ड बफर ट्रैकर',
      subtitle: 'मंडी में अपनी फसल के आगमन से लेकर भुगतान तक की चरणबद्ध स्थिति को लाइव ट्रैक करें।',
      currentStage: 'वर्तमान चरण',
      distanceAway: 'मंडी से दूरी',
      geofenceStatus: 'जियोफेंस बफर स्थिति',
      gpsSimulatorTitle: 'जीपीएस दूरी सिम्युलेटर (GPS Distance Simulator)',
      gpsSimulatorDesc: 'किसान के वाहन की दूरी बदलकर देखें कि जियोफेंस इंजन स्वचालित रूप से स्थिति कैसे बदलता है।',
      presetHome: 'घर पर (12 किमी)',
      presetBuffer: 'बफर यार्ड (2.5 किमी)',
      presetGate: 'मंडी गेट (200 मी)',
      stages: {
        home: {
          title: '1. घर पर (Booked)',
          subtitle: 'स्लॉट आरक्षित, प्रस्थान की प्रतीक्षा'
        },
        buffer: {
          title: '2. बफर यार्ड (Staging)',
          subtitle: 'होल्डिंग क्षेत्र (500मी - 5किमी)'
        },
        gate: {
          title: '3. मंडी गेट (Mandi Gate)',
          subtitle: 'गेट पर स्कैनिंग हेतु तैयार (<500मी)'
        },
        inspection: {
          title: '4. गुणवत्ता जांच (Inspection)',
          subtitle: 'वे-ब्रिज तौल एवं नमी ग्रेडिंग'
        },
        payment: {
          title: '5. भुगतान संपन्न (Payment Done)',
          subtitle: 'सीधे बैंक खाते में डीबीटी'
        }
      },
      capacityEngineTitle: 'डायनामिक वे-ब्रिज क्षमता एवं कतार विश्लेषण',
      capacityEngineSubtitle: 'वाहन अनलोडिंग गति और सक्रिय वे-ब्रिज के आधार पर कतार की भीड़ का स्वतः नियंत्रण।',
      weighbridges: 'सक्रिय वे-ब्रिज',
      utilization: 'क्षमता उपयोग',
      congestionState: 'कतार का दबाव',
      unloadingBenchmarks: 'वाहन अनलोडिंग मानक समय',
      estimatedWaitTime: 'अनुमानित प्रतीक्षा समय',
      offlineTokenTitle: 'ऑफलाइन क्रिप्टोग्राफिक टोकन',
      offlineTokenSubtitle: 'बिना इंटरनेट के मंडी गेट पर सत्यापन योग्य SHA-256 टोकन।'
    },
    gateScanner: {
      title: 'मंडी गेट टोकन स्कैनर एवं प्रवेश सत्यापन',
      subtitle: 'प्रवेश द्वार पर किसानों के SHA-256 टोकन की प्रामाणिकता जांचें एवं भीड़ को नियंत्रित करें।',
      inputPlaceholder: '64-अंकीय SHA-256 टोकन स्ट्रिंग दर्ज करें या पेस्ट करें...',
      verifyButton: 'टोकन सत्यापित करें (Verify Token)',
      verifying: 'जांच जारी है...',
      scanSampleBtn: 'सैंपल टोकन से त्वरित जांच करें',
      verifiedSuccess: 'प्रवेश स्वीकृत! टोकन पूर्णतः वैध और प्रामाणिक है।',
      verificationFailed: 'अमान्य टोकन! इस टोकन की कोई पुष्टि नहीं हुई।',
      vehicleEntryAllowed: 'वाहन प्रवेश की अनुमति है',
      vehicleEntryDenied: 'वाहन प्रवेश अस्वीकृत',
      markGateEntry: 'मंडी गेट प्रवेश दर्ज करें (Mark MANDI_GATE)',
      markedEntrySuccess: 'स्थिति सफलतापूर्वक MANDI_GATE में अपडेट की गई!',
      weighbridgeLabel: 'उपलब्ध वे-ब्रिज संख्या'
    },
    howItWorks: {
      title: 'किसान सेतु कैसे काम करता है?',
      subtitle: 'डिजिटल शेड्यूलिंग और 256-बिट ऑफलाइन टोकन के माध्यम से पारदर्शी खरीद।'
    }
  },

  // 2. ENGLISH
  en: {
    brandName: 'Kisan Setu',
    brandTagline: 'Smart Procurement Gateway',
    langSwitchLabel: 'Switch Language',
    activeLanguage: 'English',
    tabs: {
      booking: 'Slot Booking (Farmer)',
      offlinePass: 'Offline Pass (PWA Pass)',
      queueStatus: 'Queue Status (Live)',
      gateScanner: 'Gate Scanner (Staff)',
      howItWorks: 'How It Works'
    },
    wizard: {
      stepTitle: 'Step',
      step1Title: '1. Crop Type & Estimated Weight',
      step1Subtitle: 'Choose your harvest (Paddy, Wheat, Pulses) and specify total weight in quintals.',
      step2Title: '2. Procurement Center & Time Slot',
      step2Subtitle: 'Select nearest Mandi and available time window with neutral capacity indicators.',
      step3Title: '3. Vehicle Type Selection',
      step3Subtitle: 'Choose your transport mode for weighbridge turnaround time estimation.',
      crops: {
        paddy: { name: 'Paddy (వరి / धान)', desc: 'Kharif Staple Crop' },
        wheat: { name: 'Wheat (गेहूं / గోధుమలు)', desc: 'Rabi Foodgrain' },
        pulses: { name: 'Pulses (दालें / పప్పుదినుసులు)', desc: 'Gram, Lentils, Moong' }
      },
      weightLabel: 'Estimated Crop Weight (in Quintals)',
      weightPlaceholder: 'e.g. 45',
      weightUnit: 'Quintals',
      quickAdd: 'Quick Add:',
      selectCenterLabel: 'Select Procurement Center (Mandi)',
      selectDateLabel: 'Arrival Date',
      selectSlotLabel: 'Available Time Window (Capacity Managed)',
      capacityBadges: {
        available: 'Available',
        moderate: 'Moderate',
        full: 'Full'
      },
      vehicles: {
        bullockCart: { name: 'Bullock Cart (ఎడ్లబండి)', unloadTime: '25 mins unload', desc: 'Traditional rural cart' },
        tractor: { name: 'Tractor-Trolley (ట్రాక్టర్)', unloadTime: '15 mins unload', desc: 'Hydraulic tipping trailer' },
        truck: { name: 'Commercial Truck (లారీ)', unloadTime: '10 mins unload', desc: 'High-speed hopper discharge' }
      },
      nextStep: 'Next Step',
      prevStep: 'Back',
      submitBooking: 'Generate Secure Token (SHA-256)',
      submitting: 'Issuing Digital Pass...'
    },
    booking: {
      title: 'Book Mandi Procurement Slot',
      subtitle: 'Pre-schedule your crop arrival to eliminate traffic gridlocks and waiting times.',
      step1: '1. Select Center & Date',
      step2: '2. Select Available Slot',
      step3: '3. Vehicle & Crop Details',
      selectCenter: 'Select Procurement Center (Mandi)',
      selectCenterPlaceholder: '-- Select your nearest Mandi --',
      selectFarmer: 'Farmer Account (Aadhaar Verified)',
      selectDate: 'Select Arrival Date',
      today: 'Today',
      tomorrow: 'Tomorrow',
      selectSlot: 'Available Time Window (Capacity Managed)',
      capacityAvailable: 'spots left',
      capacityFull: 'Slot Full',
      slotsLoading: 'Checking capacity...',
      noSlots: 'No slots available for this date.',
      vehicleType: 'Select Vehicle Type',
      vehicleTractor: 'Tractor-Trolley',
      vehicleBullockCart: 'Bullock Cart',
      vehicleTruck: 'Commercial Truck',
      cropType: 'Crop Name',
      cropWheat: 'Wheat (गेहूं)',
      cropPaddy: 'Paddy / Rice (धान)',
      cropMustard: 'Mustard (सरसों)',
      cropGram: 'Gram / Chickpeas (चना)',
      estimatedWeight: 'Estimated Weight (Quintals)',
      weightUnit: 'Quintals',
      submitBooking: 'Generate Secure Token (SHA-256)',
      submitting: 'Generating secure pass...',
      bookingSuccess: 'Slot booked successfully! Your offline token pass is ready.',
      bookingError: 'Booking failed. Please retry.'
    },
    offlinePass: {
      title: 'Kisan Setu Offline Digital Pass (PWA Cached)',
      subtitle: 'This pass is cached locally on your mobile device and is scannable without cellular data.',
      noPassFound: 'No Active Token Pass Found',
      noPassDesc: 'You have not reserved a slot yet. Please complete the 3-step booking flow.',
      bookNowBtn: 'Book New Slot Now',
      savedOfflineBadge: 'Offline Ready (PWA Cached)',
      officialGovtToken: 'Government of India - E-Procurement Entry Token',
      tokenNumberLabel: 'SHA-256 Encrypted Token String',
      centerLabel: 'Procurement Center (Mandi)',
      slotLabel: 'Scheduled Window',
      vehicleLabel: 'Vehicle Type',
      cropWeightLabel: 'Crop & Net Weight',
      farmerLabel: 'Farmer Name',
      offlineNotice: 'Mandi gate staff can verify this QR code and SHA-256 token hash offline without live internet.',
      printPass: 'Print / Save PDF',
      sharePass: 'Share Pass'
    },
    tokenPass: {
      modalTitle: 'Farmer Entry Pass (Offline Mandi Pass)',
      officialPass: 'Government of India - E-Procurement Digital Entry Token',
      tokenHashLabel: 'SHA-256 Encrypted Offline Token Digest',
      farmerLabel: 'Farmer Name',
      villageLabel: 'Village / Region',
      centerLabel: 'Procurement Center',
      slotLabel: 'Scheduled Window',
      vehicleLabel: 'Vehicle Type',
      cropLabel: 'Crop & Weight',
      weightLabel: 'Weight',
      statusLabel: 'Status',
      statusBooked: 'BOOKED & CONFIRMED',
      offlineNotice: 'This token is cryptographically verifiable offline. Gate scanner verifies SHA-256 signature without live internet.',
      printPass: 'Print / Save Pass',
      close: 'Close'
    },
    queueCard: {
      title: 'Dynamic Queue Progress Card',
      subtitle: '5-stage progression tracking your vehicle from home to staging buffer, gate, and DBT payout.',
      stages: {
        home: '1. Home (Booked)',
        staging: '2. Staging Buffer',
        gate: '3. Mandi Gate',
        inspection: '4. Quality Inspection',
        payment: '5. Payment Complete'
      },
      currentDistance: 'Current Distance from Mandi',
      activeInstruction: 'Instruction'
    },
    queueVisualizer: {
      title: 'Live Queue & Geofenced Buffer Tracker',
      subtitle: 'Track your arrival stages seamlessly from departure to buffer staging, weighbridge, and instant DBT payout.',
      currentStage: 'Current Stage',
      distanceAway: 'Distance to Mandi',
      geofenceStatus: 'Geofence Buffer Status',
      gpsSimulatorTitle: 'Interactive GPS Distance Simulator',
      gpsSimulatorDesc: 'Simulate vehicle approach distance to test dynamic geofence state transitions in real time.',
      presetHome: 'At Home (12 km)',
      presetBuffer: 'Buffer Yard (2.5 km)',
      presetGate: 'Mandi Gate (200 m)',
      stages: {
        home: {
          title: '1. At Home (Booked)',
          subtitle: 'Slot Confirmed, Awaiting Departure'
        },
        buffer: {
          title: '2. Buffer Yard (Staging)',
          subtitle: 'Holding Zone (500m - 5km)'
        },
        gate: {
          title: '3. Mandi Gate (Ready to Scan)',
          subtitle: 'Admitted into Entry Yard (<500m)'
        },
        inspection: {
          title: '4. Quality & Weighment',
          subtitle: 'Moisture Testing & Gross Weighing'
        },
        payment: {
          title: '5. Direct DBT Payout',
          subtitle: 'Funds Released to Bank Account'
        }
      },
      capacityEngineTitle: 'Dynamic Weighbridge & Congestion Analysis',
      capacityEngineSubtitle: 'Throughput management driven by vehicle unloading speeds and active weighbridge availability.',
      weighbridges: 'Active Weighbridges',
      utilization: 'Capacity Load',
      congestionState: 'Queue Pressure',
      unloadingBenchmarks: 'Standard Unloading Benchmarks',
      estimatedWaitTime: 'Estimated Gate Wait',
      offlineTokenTitle: 'Offline Cryptographic Token',
      offlineTokenSubtitle: 'Zero-connectivity SHA-256 verified pass.'
    },
    gateScanner: {
      title: 'Mandi Gate Token Scanner & Staging',
      subtitle: 'Verify farmer vehicle SHA-256 tokens instantly to authorize yard entry.',
      inputPlaceholder: 'Enter or paste 64-char SHA-256 token string...',
      verifyButton: 'Verify Token',
      verifying: 'Verifying with Mandi ledger...',
      scanSampleBtn: 'Load Sample Token for Testing',
      verifiedSuccess: 'Entry Authorized! Token signature is cryptographically verified.',
      verificationFailed: 'Invalid Token! No booking found with this digest.',
      vehicleEntryAllowed: 'Vehicle Entry Authorized',
      vehicleEntryDenied: 'Vehicle Entry Denied',
      markGateEntry: 'Admit Vehicle into Mandi Gate',
      markedEntrySuccess: 'Vehicle arrival recorded as MANDI_GATE!',
      weighbridgeLabel: 'Available Weighbridges'
    },
    howItWorks: {
      title: 'How Kisan Setu Works',
      subtitle: 'Eliminating mandi gridlocks through pre-slotting and cryptographic offline tokenization.'
    }
  },

  // 3. TELUGU (తెలుగు)
  te: {
    brandName: 'కిసాన్ సేతు',
    brandTagline: 'Smart Procurement Gateway (స్మార్ట్ ప్రొక్యూర్మెంట్ గేట్‌వే)',
    langSwitchLabel: 'భాషను మార్చండి (Language)',
    activeLanguage: 'తెలుగు',
    tabs: {
      booking: 'స్లాట్ బుకింగ్ (Farmer)',
      offlinePass: 'ఆఫ్‌లైన్ పాస్ (PWA Pass)',
      queueStatus: 'వరుస క్రమం (Queue)',
      gateScanner: 'గేట్ ధృవీకరణ (Staff)',
      howItWorks: 'వివరాలు'
    },
    wizard: {
      stepTitle: 'దశ',
      step1Title: '1. పంట రకం మరియు అంచనా బరువు',
      step1Subtitle: 'మీ పంటను (వరి, గోధుమలు, పప్పుదినుసులు) ఎంచుకుని, క్వింటాళ్లలో బరువు నమోదు చేయండి.',
      step2Title: '2. కొనుగోలు కేంద్రం మరియు సమయ స్లాట్',
      step2Subtitle: 'వే-బ్రిడ్జ్ సామర్థ్యం ఆధారంగా అందుబాటులో ఉన్న సమయ విండోను ఎంచుకోండి.',
      step3Title: '3. వాహనం రకం ఎంపిక',
      step3Subtitle: 'మీ రవాణా వాహనాన్ని (ఎడ్లబండి, ట్రాక్టర్, లారీ) ఎంచుకోండి.',
      crops: {
        paddy: { name: 'వరి / ధాన్యం (Paddy)', desc: 'ఖరీఫ్ ప్రధాన పంట' },
        wheat: { name: 'గోధుమలు (Wheat)', desc: 'రబీ ఆహార పంట' },
        pulses: { name: 'పప్పుదినుసులు (Pulses / కందులు, మినుములు)', desc: 'పప్పు పంటలు' }
      },
      weightLabel: 'అంచనా వేసిన పంట బరువు (క్వింటాళ్లలో)',
      weightPlaceholder: 'ఉదా. 45',
      weightUnit: 'క్వింటాళ్లు',
      quickAdd: 'త్వరిత జోడింపు:',
      selectCenterLabel: 'సమీప కొనుగోలు కేంద్రాన్ని (మండి) ఎంచుకోండి',
      selectDateLabel: 'విక్రయ తేదీ',
      selectSlotLabel: 'అందుబాటులో ఉన్న సమయ స్లాట్ (సామర్థ్య బ్యాడ్జ్)',
      capacityBadges: {
        available: 'అందుబాటులో ఉంది (Available)',
        moderate: 'మధ్యస్థం (Moderate)',
        full: 'పూర్తయింది (Full)'
      },
      vehicles: {
        bullockCart: { name: 'ఎడ్లబండి (Bullock Cart)', unloadTime: '25 నిమిషాలు అన్‌లోడింగ్', desc: 'సాంప్రదాయ గ్రామీణ రవాణా' },
        tractor: { name: 'ట్రాక్టర్-ట్రాలీ (Tractor)', unloadTime: '15 నిమిషాలు అన్‌లోడింగ్', desc: 'హైడ్రాలిక్ అన్‌లోడింగ్' },
        truck: { name: 'లారీ / ట్రక్ (Commercial Truck)', unloadTime: '10 నిమిషాలు అన్‌లోడింగ్', desc: 'వేగవంతమైన డిశ్చార్జ్' }
      },
      nextStep: 'తదుపరి దశ (Next)',
      prevStep: 'వెనుకకు (Back)',
      submitBooking: 'సురక్షిత టోకెన్ జారీ చేయండి (Generate SHA-256 Token)',
      submitting: 'టోకెన్ పాస్ తయారవుతోంది...'
    },
    booking: {
      title: 'మండి కొనుగోలు స్లాట్‌ను బుక్ చేయండి',
      subtitle: 'ట్రాఫిక్ జామ్‌లు మరియు నిరీక్షణ సమయాలను నివారించడానికి ముందుగానే స్లాట్ రిజర్వ్ చేసుకోండి.',
      step1: '1. కొనుగోలు కేంద్రం మరియు తేదీ',
      step2: '2. సమయ స్లాట్ ఎంపిక',
      step3: '3. వాహనం మరియు పంట వివరాలు',
      selectCenter: 'కొనుగోలు కేంద్రాన్ని (మండి) ఎంచుకోండి',
      selectCenterPlaceholder: '-- మీ సమీప మండీని ఎంచుకోండి --',
      selectFarmer: 'రైతు ఖాతా (ఆధార్ ధృవీకరించబడింది)',
      selectDate: 'రాక తేదీ',
      today: 'ఈ రోజు',
      tomorrow: 'రేపు',
      selectSlot: 'అందుబాటులో ఉన్న సమయ స్లాట్',
      capacityAvailable: 'స్లాట్లు ఖాళీగా ఉన్నాయి',
      capacityFull: 'స్లాట్ పూర్తయింది',
      slotsLoading: 'సామర్థ్యం పరిశీలిస్తోంది...',
      noSlots: 'ఈ తేదీకి స్లాట్లు అందుబాటులో లేవు.',
      vehicleType: 'వాహనం రకం',
      vehicleTractor: 'ట్రాక్టర్-ట్రాలీ',
      vehicleBullockCart: 'ఎడ్లబండి',
      vehicleTruck: 'లారీ / ట్రక్',
      cropType: 'పంట పేరు',
      cropWheat: 'గోధుమలు (Wheat)',
      cropPaddy: 'వరి / ధాన్యం (Paddy)',
      cropMustard: 'ఆవాలు (Mustard)',
      cropGram: 'శనగలు (Gram)',
      estimatedWeight: 'అంచనా బరువు (క్వింటాళ్లలో)',
      weightUnit: 'క్వింటాళ్లు',
      submitBooking: 'సురక్షిత టోకెన్ జారీ చేయండి (SHA-256)',
      submitting: 'టోకెన్ తయారవుతోంది...',
      bookingSuccess: 'స్లాట్ విజయవంతంగా బుక్ చేయబడింది!',
      bookingError: 'బుకింగ్ విఫలమైంది.'
    },
    offlinePass: {
      title: 'కిసాన్ సేతు డిజిటల్ ప్రవేశ పాస్ (PWA Cached)',
      subtitle: 'ఈ పాస్ మీ పరికరంలో భద్రపరచబడింది మరియు ఇంటర్నెట్ లేకపోయినా మండి గేట్ వద్ద చెల్లుబాటు అవుతుంది.',
      noPassFound: 'ఎలాంటి యాక్టివ్ టోకెన్ పాస్ కనుగొనబడలేదు',
      noPassDesc: 'మీరు ఇంకా ఎలాంటి స్లాట్‌ను రిజర్వ్ చేయలేదు. దయచేసి 3-దశల బుకింగ్‌ను పూర్తి చేయండి.',
      bookNowBtn: 'ఇప్పుడే కొత్త స్లాట్ బుక్ చేయండి',
      savedOfflineBadge: 'ఆఫ్‌లైన్ భద్రత (PWA Cached)',
      officialGovtToken: 'భారత ప్రభుత్వం - ఈ-సేకరణ డిజిటల్ ప్రవేశ టోకెన్',
      tokenNumberLabel: 'SHA-256 ఎన్‌క్రిప్ట్ చేసిన టోకెన్ సంఖ్య',
      centerLabel: 'కొనుగోలు కేంద్రం (మండి)',
      slotLabel: 'కేటాయించిన సమయం',
      vehicleLabel: 'వాహనం రకం',
      cropWeightLabel: 'పంట మరియు బరువు',
      farmerLabel: 'రైతు పేరు',
      offlineNotice: 'మండి గేట్ వద్ద ఇంటర్నెట్ లేకపోయినా భద్రతా సిబ్బంది ఈ క్యూఆర్ కోడ్‌ను సులభంగా స్కాన్ చేయవచ్చు.',
      printPass: 'ప్రింట్ / పిడిఎఫ్ డౌన్‌లోడ్',
      sharePass: 'పాస్ షేర్ చేయండి'
    },
    tokenPass: {
      modalTitle: 'రైతు ప్రవేశ పాస్ (Offline Mandi Pass)',
      officialPass: 'భారత ప్రభుత్వం - ఈ-సేకరణ డిజిటల్ ప్రవేశ టోకెన్',
      tokenHashLabel: 'SHA-256 ఎన్‌క్రిప్ట్ చేసిన ఆఫ్‌లైన్ టోకెన్ డైజెస్ట్',
      farmerLabel: 'రైతు పేరు',
      villageLabel: 'గ్రామం / ప్రాంతం',
      centerLabel: 'కొనుగోలు కేంద్రం',
      slotLabel: 'షెడ్యూల్ చేసిన సమయం',
      vehicleLabel: 'వాహనం రకం',
      cropLabel: 'పంట & బరువు',
      weightLabel: 'బరువు',
      statusLabel: 'స్థితి',
      statusBooked: 'బుకింగ్ పూర్తయింది',
      offlineNotice: 'ఈ టోకెన్ ఇంటర్నెట్ లేకుండా ఆఫ్‌లైన్‌లో ధృవీకరించబడుతుంది.',
      printPass: 'పాస్ ప్రింట్ చేయండి',
      close: 'మూసివేయండి'
    },
    queueCard: {
      title: 'లైవ్ క్యూ మరియు పురోగతి కార్డ్ (Queue Progress)',
      subtitle: 'ఇంటి నుండి బఫర్ యార్డ్, మండి గేట్ మరియు నేరుగా బ్యాంక్ ఖాతాలో జమ అయ్యే వరకు 5-దశల స్థితి.',
      stages: {
        home: '1. ఇంట్లో (Home)',
        staging: '2. బఫర్ యార్డ్ (Staging Buffer)',
        gate: '3. మండి గేట్ (Mandi Gate)',
        inspection: '4. నాణ్యత తనిఖీ (Quality Inspection)',
        payment: '5. చెల్లింపు పూర్తయింది (Payment Complete)'
      },
      currentDistance: 'మండి నుండి ప్రస్తుత దూరం',
      activeInstruction: 'సూచన'
    },
    queueVisualizer: {
      title: 'లైవ్ క్యూ & జియోఫెన్స్ బఫర్ ట్రాకర్',
      subtitle: 'మండికి రావడం నుండి వే-బ్రిడ్జ్ మరియు ఖాతాలో డీబీటీ జమ వరకు దశలను ట్రాక్ చేయండి.',
      currentStage: 'ప్రస్తుత దశ',
      distanceAway: 'మండి నుండి దూరం',
      geofenceStatus: 'జియోఫెన్స్ బఫర్ స్థితి',
      gpsSimulatorTitle: 'ఇంటరాక్టివ్ GPS దూర సిమ్యులేటర్',
      gpsSimulatorDesc: 'వాహనం దూరాన్ని మార్చడం ద్వారా జియోఫెన్స్ స్టేజ్ మార్పులను పరిశీలించండి.',
      presetHome: 'ఇంట్లో (12 కిమీ)',
      presetBuffer: 'బఫర్ యార్డ్ (2.5 కిమీ)',
      presetGate: 'మండి గేట్ (200 మీ)',
      stages: {
        home: {
          title: '1. ఇంట్లో (Booked)',
          subtitle: 'స్లాట్ ఖరారైంది, ప్రయాణానికి వేచి ఉంది'
        },
        buffer: {
          title: '2. బఫర్ యార్డ్ (Staging)',
          subtitle: 'హోల్డింగ్ జోన్ (500మీ - 5కిమీ)'
        },
        gate: {
          title: '3. మండి గేట్ (Ready to Scan)',
          subtitle: 'గేట్ వద్ద స్కానింగ్ సిద్ధం (<500మీ)'
        },
        inspection: {
          title: '4. నాణ్యత & తూకం',
          subtitle: 'తేమ శాతం మరియు వే-బ్రిడ్జ్ తూకం'
        },
        payment: {
          title: '5. డీబీటీ చెల్లింపు',
          subtitle: 'ఖాతాలో నేరుగా నగదు జమ'
        }
      },
      capacityEngineTitle: 'డైనమిక్ వే-బ్రిడ్జ్ సామర్థ్య విశ్లేషణ',
      capacityEngineSubtitle: 'అన్‌లోడింగ్ సమయం మరియు క్రియాశీల వే-బ్రిడ్జిల ఆధారంగా నిర్వహణ.',
      weighbridges: 'క్రియాశీల వే-బ్రిడ్జిలు',
      utilization: 'సామర్థ్యం వినియోగం',
      congestionState: 'క్యూ ఒత్తిడి',
      unloadingBenchmarks: 'ప్రామాణిక అన్‌లోడింగ్ సమయాలు',
      estimatedWaitTime: 'అంచనా వేసిన నిరీక్షణ సమయం',
      offlineTokenTitle: 'ఆఫ్‌లైన్ క్రిప్టోగ్రాఫిక్ టోకెన్',
      offlineTokenSubtitle: 'ఇంటర్నెట్ రహిత SHA-256 ధృవీకరణ పాస్.'
    },
    gateScanner: {
      title: 'మండి గేట్ టోకెన్ స్కానర్ & ధృవీకరణ',
      subtitle: 'రైతు వాహనాల SHA-256 టోకెన్‌ను తక్షణమే స్కాన్ చేసి ప్రవేశాన్ని అనుమతించండి.',
      inputPlaceholder: '64-అక్షరాల SHA-256 టోకెన్ స్ట్రింగ్‌ను నమోదు చేయండి...',
      verifyButton: 'టోకెన్ ధృవీకరించండి (Verify Token)',
      verifying: 'తనిఖీ జరుగుతోంది...',
      scanSampleBtn: 'నమూనా టోకెన్‌తో పరీక్షించండి',
      verifiedSuccess: 'ప్రవేశం అనుమతించబడింది! టోకెన్ పూర్తిగా చెల్లుబాటు అయ్యింది.',
      verificationFailed: 'చెల్లని టోకెన్! ఈ టోకెన్ ధృవీకరించబడలేదు.',
      vehicleEntryAllowed: 'వాహన ప్రవేశం అనుమతించబడింది',
      vehicleEntryDenied: 'వాహన ప్రవేశం తిరస్కరించబడింది',
      markGateEntry: 'మండి గేట్ ప్రవేశాన్ని నమోదు చేయండి',
      markedEntrySuccess: 'స్థితి MANDI_GATE గా విజయవంతంగా అప్‌డేట్ చేయబడింది!',
      weighbridgeLabel: 'అందుబాటులో ఉన్న వే-బ్రిడ్జిలు'
    },
    howItWorks: {
      title: 'కిసాన్ సేతు ఎలా పనిచేస్తుంది?',
      subtitle: 'డిజిటల్ షెడ్యూలింగ్ మరియు క్రిప్టోగ్రాఫిక్ టోకెనైజేషన్ ద్వారా ట్రాఫిక్ రహిత మండి సేవలు.'
    }
  }
};
