'use client';

import React from 'react';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface PlayAudioButtonProps {
  textToSpeak: string;
  highlightKey?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'icon';
}

export function PlayAudioButton({
  textToSpeak,
  highlightKey,
  label,
  className = '',
  size = 'md'
}: PlayAudioButtonProps) {
  const { speak, stopSpeaking, isSpeaking, activeHighlightKey } = useVoiceAssistant();
  const { t } = useLanguage();

  const isCurrentAudio = isSpeaking && activeHighlightKey === highlightKey;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentAudio) {
      stopSpeaking();
    } else {
      speak(textToSpeak, highlightKey);
    }
  };

  if (size === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={isCurrentAudio ? t.voiceAssistant.stopAudio : t.voiceAssistant.playAudio}
        aria-label={isCurrentAudio ? t.voiceAssistant.stopAudio : t.voiceAssistant.playAudio}
        className={`p-2 rounded-xl transition-all flex items-center justify-center ${
          isCurrentAudio
            ? 'bg-amber-500 text-white shadow-md animate-pulse scale-105'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300'
        } ${className}`}
      >
        {isCurrentAudio ? (
          <VolumeX className="w-4 h-4 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-emerald-800" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isCurrentAudio ? t.voiceAssistant.stopAudio : t.voiceAssistant.playAudio}
      className={`inline-flex items-center space-x-2 font-bold transition-all rounded-xl active:scale-95 ${
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
      } ${
        isCurrentAudio
          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md animate-pulse ring-2 ring-amber-300'
          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-xs'
      } ${className}`}
    >
      {isCurrentAudio ? (
        <VolumeX className="w-4 h-4 text-white shrink-0" />
      ) : (
        <Volume2 className="w-4 h-4 text-emerald-700 shrink-0" />
      )}
      <span>{label || (isCurrentAudio ? t.voiceAssistant.stopAudio : t.voiceAssistant.playAudio)}</span>
    </button>
  );
}
