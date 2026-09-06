'use client';

import React, { useState } from 'react';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import { useLanguage } from '../../context/LanguageContext';
import { Mic, MicOff } from 'lucide-react';

interface VoiceDictationButtonProps {
  onDictated: (text: string) => void;
  className?: string;
  fieldLabel?: string;
}

export function VoiceDictationButton({
  onDictated,
  className = '',
  fieldLabel
}: VoiceDictationButtonProps) {
  const { startDictation, isListening, stopListening } = useVoiceAssistant();
  const { t } = useLanguage();
  const [isActiveForThisField, setIsActiveForThisField] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isActiveForThisField && isListening) {
      stopListening();
      setIsActiveForThisField(false);
    } else {
      setIsActiveForThisField(true);
      startDictation((text) => {
        onDictated(text);
        setIsActiveForThisField(false);
      });
    }
  };

  const isFieldRecording = isActiveForThisField && isListening;

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isFieldRecording ? t.voiceAssistant.stopAudio : t.voiceAssistant.voiceDictation}
      aria-label={fieldLabel ? `${t.voiceAssistant.voiceDictation} (${fieldLabel})` : t.voiceAssistant.voiceDictation}
      className={`p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
        isFieldRecording
          ? 'bg-red-600 border-red-700 text-white animate-pulse shadow-md'
          : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
      } ${className}`}
    >
      {isFieldRecording ? (
        <MicOff className="w-4 h-4 text-white" />
      ) : (
        <Mic className="w-4 h-4 text-emerald-800" />
      )}
    </button>
  );
}
