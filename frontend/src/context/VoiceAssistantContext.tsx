'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from './LanguageContext';
import { useSyncStore, createNewBooking, CropKey, VehicleTypeKey } from '../lib/syncStore';

export interface VoiceAssistantContextType {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  assistantResponse: string;
  activeHighlightKey: string | null;
  guidedStep: number | null; // null = regular mode, 0 = crop, 1 = qty, 2 = vehicle, 3 = completed
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  speak: (text: string, highlightKey?: string, onComplete?: () => void) => void;
  stopSpeaking: () => void;
  startGuidedBooking: () => void;
  cancelGuidedBooking: () => void;
  startDictation: (onResult: (text: string) => void) => void;
  activeTabSetter?: (tab: 'register' | 'booking' | 'offlinePass' | 'queue' | 'weather') => void;
  registerTabSetter: (setter: (tab: 'register' | 'booking' | 'offlinePass' | 'queue' | 'weather') => void) => void;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

// Web Audio API Chime generator (Pure client synthesis without any external assets)
function playAudioChime(type: 'start' | 'stop' | 'success') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'start') {
      // Ascending dual tone (440Hz -> 880Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'stop') {
      // Descending dual tone (880Hz -> 440Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'success') {
      // Major chord chime (C5 -> E5 -> G5)
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.1, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    }
  } catch (e) {
    // Graceful silent ignore if audio context blocked by browser policy
  }
}

export function VoiceAssistantProvider({ children }: { children: React.ReactNode }) {
  const { language, t } = useLanguage();
  const sync = useSyncStore();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [activeHighlightKey, setActiveHighlightKey] = useState<string | null>(null);
  const [guidedStep, setGuidedStep] = useState<number | null>(null);
  const [guidedData, setGuidedData] = useState<{
    crop?: CropKey;
    quantity?: number;
    vehicleType?: VehicleTypeKey;
  }>({});
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const activeTabSetterRef = useRef<((tab: 'register' | 'booking' | 'offlinePass' | 'queue' | 'weather') => void) | null>(null);
  const customDictationHandlerRef = useRef<((text: string) => void) | null>(null);

  // Map language to BCP 47 Speech recognition/synthesis code
  const getLocaleCode = useCallback((lang: string) => {
    switch (lang) {
      case 'te':
        return 'te-IN';
      case 'hi':
        return 'hi-IN';
      case 'pa':
        return 'pa-IN';
      case 'mr':
        return 'mr-IN';
      case 'ta':
        return 'ta-IN';
      case 'bn':
        return 'bn-IN';
      case 'gu':
        return 'gu-IN';
      case 'kn':
        return 'kn-IN';
      default:
        return 'en-IN';
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        setIsSupported(false);
        return;
      }

      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        playAudioChime('start');
      };

      rec.onend = () => {
        setIsListening(false);
        playAudioChime('stop');
      };

      rec.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Text-To-Speech Synthesis
  const speak = useCallback(
    (text: string, highlightKey?: string, onComplete?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      setAssistantResponse(text);
      if (highlightKey) {
        setActiveHighlightKey(highlightKey);
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const locale = getLocaleCode(language);
      utterance.lang = locale;
      utterance.rate = 0.95; // Slightly slower, clear cadence for accessibility
      utterance.pitch = 1.0;

      // Try selecting a native voice matching the locale if available
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang === locale || v.lang.startsWith(locale.split('-')[0]));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (highlightKey) {
          // Keep highlight visible briefly after speaking completes
          setTimeout(() => setActiveHighlightKey(null), 2500);
        }
        if (onComplete) {
          onComplete();
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setActiveHighlightKey(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [language, getLocaleCode]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveHighlightKey(null);
    }
  }, []);

  // Dispatch Recognized Intent & Actions
  const handleCommandIntent = useCallback(
    (commandText: string) => {
      const lower = commandText.toLowerCase().trim();

      // Custom Dictation Mode (e.g. for input field)
      if (customDictationHandlerRef.current) {
        customDictationHandlerRef.current(commandText);
        customDictationHandlerRef.current = null;
        return;
      }

      // Guided Booking Stepper Handling
      if (guidedStep !== null) {
        handleGuidedStepResponse(lower);
        return;
      }

      // 1. "Book Slot" / "స్లాట్ బుక్ చేయండి" / "स्लॉट बुक करें"
      if (
        lower.includes('book') ||
        lower.includes('slot') ||
        lower.includes('बुकिंग') ||
        lower.includes('స్లాట్') ||
        lower.includes('బుక్') ||
        lower.includes('ప్రాప్తం')
      ) {
        activeTabSetterRef.current?.('booking');
        const confirmMsg =
          language === 'te'
            ? 'స్లాట్ బుకింగ్ ఫారం తెరవబడింది. దయచేసి వివరాలను ఎంచుకోండి.'
            : language === 'hi'
            ? 'स्लॉट बुकिंग फॉर्म खुल गया है। कृपया खरीद केंद्र और फसल विवरण चुनें।'
            : 'Slot booking form opened. Please select your center and crop.';
        speak(confirmMsg, 'booking-section');
        return;
      }

      // 2. "Check Queue Status" / "క్యూ స్థితిని తనిఖీ చేయండి" / "कतार स्थिति जांचें"
      if (
        lower.includes('queue') ||
        lower.includes('status') ||
        lower.includes('wait') ||
        lower.includes('line') ||
        lower.includes('कतार') ||
        lower.includes('स्थिति') ||
        lower.includes('క్యూ') ||
        lower.includes('స్థితి')
      ) {
        activeTabSetterRef.current?.('queue');
        const active = sync.activeBooking || sync.bookings[0];
        const queueMsg = active
          ? language === 'te'
            ? `క్యూ స్థితి: మీ టోకెన్ ${active.tokenNumber}. మీ వాహనం స్థానం #${active.queuePosition || 1}. అంచనా ప్రతీక్షా సమయం 15 నిమిషాలు.`
            : language === 'hi'
            ? `कतार स्थिति: आपका टोकन ${active.tokenNumber} है। कतार में आपका स्थान #${active.queuePosition || 1} है। अनुमानित प्रतीक्षा समय 15 मिनट है।`
            : `Queue Status: Your token is ${active.tokenNumber}. You are at position #${active.queuePosition || 1}. Estimated wait time is 15 minutes.`
          : language === 'te'
          ? 'క్యూ సమాచారం: ప్రస్తుతం ఎలాంటి యాక్టివ్ టోకెన్ నమోదు కాలేదు. స్లాట్ బుక్ చేసుకోండి.'
          : language === 'hi'
          ? 'कतार जानकारी: वर्तमान में कोई सक्रिय टोकन नहीं है। कृपया स्लॉट बुक करें।'
          : 'Queue Info: No active booking found. Please book an arrival slot.';

        speak(queueMsg, 'queue-tracker-card');
        return;
      }

      // 3. "Read Weather" / "వాతావరణాన్ని చదవండి" / "मौसम पढ़ें"
      if (
        lower.includes('weather') ||
        lower.includes('rain') ||
        lower.includes('मौसम') ||
        lower.includes('बारिश') ||
        lower.includes('వాతావరణ') ||
        lower.includes('వర్షం')
      ) {
        activeTabSetterRef.current?.('weather');
        const weatherMsg =
          language === 'te'
            ? 'నేటి వాతావరణ నివేదిక: కోటా మండి పరిధిలో ఉష్ణోగ్రత 34 డిగ్రీల సెల్సియస్. వర్ష సూచన 12 శాతం. ధాన్యం నిల్వకు మరియు రవాణాకు అనుకూల వాతావరణం.'
            : language === 'hi'
            ? 'आज का मौसम विवरण: कोटा मंडी क्षेत्र में तापमान 34 डिग्री सेल्सियस है। बारिश की संभावना 12 प्रतिशत है। फसल उपार्जन एवं परिवहन के लिए मौसम अनुकूल है।'
            : 'Today\'s Weather Report: Mandi temperature is 34 degrees Celsius with 12 percent chance of precipitation. Favorable conditions for crop transport.';

        speak(weatherMsg, 'weather-advisory-card');
        return;
      }

      // 4. "Digital Pass" / "డిజిటల్ పాస్" / "डिजिटल पास"
      if (
        lower.includes('pass') ||
        lower.includes('qr') ||
        lower.includes('ticket') ||
        lower.includes('పాస్') ||
        lower.includes('पास') ||
        lower.includes('पर्ची')
      ) {
        activeTabSetterRef.current?.('offlinePass');
        const active = sync.activeBooking || sync.bookings[0];
        const passMsg = active
          ? language === 'te'
            ? `డిజిటల్ పాస్: టోకెన్ ${active.tokenNumber}. రాక సమయం ${active.timeSlot}. క్యూఆర్ కోడ్ ప్రవేశానికి సిద్ధంగా ఉంది.`
            : language === 'hi'
            ? `डिजिटल पास: टोकन ${active.tokenNumber}. आगमन समय ${active.timeSlot}. क्यूआर कोड मंडी प्रवेश हेतु तैयार है।`
            : `Digital Pass: Token ${active.tokenNumber} for arrival at ${active.timeSlot}. QR code is ready for gate entry.`
          : language === 'te'
          ? 'డిజిటల్ పాస్ సిద్ధంగా లేదు. దయచేసి మొదట స్లాట్ బుక్ చేయండి.'
          : language === 'hi'
          ? 'डिजिटल पास उपलब्ध नहीं है। कृपया पहले स्लॉट बुक करें।'
          : 'No active pass found. Please book a slot first.';

        speak(passMsg, 'digital-pass-card');
        return;
      }

      // 5. "Start Guided Booking" / "వాయిస్ సహాయం" / "वॉइस सहायता"
      if (
        lower.includes('guided') ||
        lower.includes('help') ||
        lower.includes('मदद') ||
        lower.includes('सहायता') ||
        lower.includes('సహాయం')
      ) {
        startGuidedBooking();
        return;
      }

      // Fallback response with prompt suggestions
      const fallbackHelp =
        language === 'te'
          ? 'మీరు "స్లాట్ బుక్ చేయండి", "క్యూ స్థితిని తనిఖీ చేయండి", లేదా "వాతావరణాన్ని చదవండి" అని చెప్పవచ్చు.'
          : language === 'hi'
          ? 'आप "स्लॉट बुक करें", "कतार स्थिति जांचें", या "मौसम पढ़ें" बोल सकते हैं।'
          : 'You can say "Book Slot", "Check Queue Status", or "Read Weather Alert".';
      speak(fallbackHelp);
    },
    [guidedStep, language, sync, speak]
  );

  // Guided Voice Booking Workflow for low-literacy farmers
  const handleGuidedStepResponse = (text: string) => {
    if (guidedStep === 0) {
      // Step 0: Crop Selection
      let selectedCrop: CropKey = 'PADDY';
      if (text.includes('wheat') || text.includes('गेहूं') || text.includes('గోధుమ')) selectedCrop = 'WHEAT';
      else if (text.includes('mustard') || text.includes('सरसों') || text.includes('ఆవాలు')) selectedCrop = 'MUSTARD';
      else if (text.includes('cotton') || text.includes('कपास') || text.includes('పత్తి')) selectedCrop = 'COTTON';
      else if (text.includes('pulse') || text.includes('दाल') || text.includes('పప్పు')) selectedCrop = 'PULSES';

      setGuidedData((prev) => ({ ...prev, crop: selectedCrop }));
      setGuidedStep(1);

      const prompt2 =
        language === 'te'
          ? `ధన్యవాదాలు, మీరు ${t.crops[selectedCrop]} ఎంచుకున్నారు. ఇప్పుడు పరిమాణం ఎన్ని క్వింటాళ్లు? ఉదాహరణకు, 35 క్వింటాళ్లు అని చెప్పండి.`
          : language === 'hi'
          ? `धन्यवाद, आपने ${t.crops[selectedCrop]} चुना है। अब कितनी मात्रा क्विंटल में है? उदाहरण के लिए, 35 क्विंटल बोलें।`
          : `Selected ${t.crops[selectedCrop]}. Now, what is the estimated quantity in quintals? For example, say 35 quintals.`;

      speak(prompt2, 'guided-voice-modal', () => {
        // Automatically re-trigger listening for next answer
        setTimeout(() => startListening(), 400);
      });
    } else if (guidedStep === 1) {
      // Step 1: Quantity Selection
      const numbers = text.match(/\d+/);
      const qty = numbers ? parseInt(numbers[0], 10) : 35;
      setGuidedData((prev) => ({ ...prev, quantity: qty }));
      setGuidedStep(2);

      const prompt3 =
        language === 'te'
          ? `${qty} క్వింటాళ్లు నమోదు చేయబడింది. మీరు ఏ వాహనాన్ని తీసుకువస్తున్నారు? ట్రాక్టర్, ట్రక్ లేదా ఎడ్ల బండి అని చెప్పండి.`
          : language === 'hi'
          ? `${qty} क्विंटल दर्ज किया गया। आप कौन सा वाहन लाएंगे? ट्रैक्टर, ट्रक या बैलगाड़ी बोलें।`
          : `${qty} quintals recorded. What vehicle will you bring? Say Tractor, Truck, or Bullock Cart.`;

      speak(prompt3, 'guided-voice-modal', () => {
        setTimeout(() => startListening(), 400);
      });
    } else if (guidedStep === 2) {
      // Step 2: Vehicle Selection & Auto-Booking
      let vehicle: VehicleTypeKey = 'TRACTOR';
      if (text.includes('truck') || text.includes('ट्रक') || text.includes('ట్రక్')) vehicle = 'TRUCK';
      else if (text.includes('cart') || text.includes('बैल') || text.includes('ఎడ్ల')) vehicle = 'BULLOCK_CART';

      const finalCrop = guidedData.crop || 'PADDY';
      const finalQty = guidedData.quantity || 35;

      // Finalize booking directly
      const newBooking = createNewBooking({
        centerId: 'center-01',
        centerName: 'Mandi Procurement Center #1 (Kota Main)',
        date: '08 Sept 2026',
        timeSlot: '10:00 AM',
        crop: finalCrop,
        quantity: finalQty,
        vehicleType: vehicle
      });

      playAudioChime('success');
      setGuidedStep(null);
      setGuidedData({});
      activeTabSetterRef.current?.('offlinePass');

      const successMsg =
        language === 'te'
          ? `అద్భుతం! మీ స్లాట్ విజయవంతంగా బుక్ చేయబడింది. మీ టోకెన్ సంఖ్య ${newBooking.tokenNumber}. మీ డిజిటల్ పాస్ తెరవబడింది.`
          : language === 'hi'
          ? `शानदार! आपका स्लॉट सफलतापूर्वक बुक हो गया है। आपका टोकन नंबर ${newBooking.tokenNumber} है। आपका डिजिटल पास तैयार है।`
          : `Success! Slot booked successfully. Your token is ${newBooking.tokenNumber}. Digital pass is ready.`;

      speak(successMsg, 'digital-pass-card');
    }
  };

  const startGuidedBooking = () => {
    setGuidedStep(0);
    setGuidedData({});
    activeTabSetterRef.current?.('booking');

    const prompt1 =
      language === 'te'
        ? 'కిసాన్ సేతు వాయిస్ బుకింగ్ అసిస్టెంట్‌కు స్వాగతం. ఈరోజు మీరు ఏ పంటను అమ్మాలనుకుంటున్నారు? వరి, గోధుమ, ఆవాలు లేదా పత్తి అని చెప్పండి.'
        : language === 'hi'
        ? 'किसान सेतु वॉइस बुकिंग सहायक में आपका स्वागत है। आज आप कौन सी फसल बेचना चाहते हैं? गेहूं, धान, सरसों या कपास बोलें।'
        : 'Welcome to Kisan Setu Voice Guided Booking. Which crop do you want to sell today? Say Wheat, Paddy, Mustard, or Cotton.';

    speak(prompt1, 'guided-voice-modal', () => {
      setTimeout(() => startListening(), 400);
    });
  };

  const cancelGuidedBooking = () => {
    setGuidedStep(null);
    setGuidedData({});
    stopSpeaking();
  };

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = getLocaleCode(language);
      recognitionRef.current.start();

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          handleCommandIntent(currentTranscript);
        }
      };
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  }, [language, getLocaleCode, handleCommandIntent]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Voice Dictation directly for any text input field
  const startDictation = useCallback(
    (onResult: (text: string) => void) => {
      customDictationHandlerRef.current = onResult;
      startListening();
    },
    [startListening]
  );

  const registerTabSetter = useCallback(
    (setter: (tab: 'register' | 'booking' | 'offlinePass' | 'queue' | 'weather') => void) => {
      activeTabSetterRef.current = setter;
    },
    []
  );

  return (
    <VoiceAssistantContext.Provider
      value={{
        isListening,
        isSpeaking,
        transcript,
        assistantResponse,
        activeHighlightKey,
        guidedStep,
        isSupported,
        startListening,
        stopListening,
        toggleListening,
        speak,
        stopSpeaking,
        startGuidedBooking,
        cancelGuidedBooking,
        startDictation,
        registerTabSetter
      }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
}

export function useVoiceAssistant() {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  }
  return context;
}
