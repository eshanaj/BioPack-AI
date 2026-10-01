import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { speechEngine } from '../engine/speech.ts';
import { useI18n } from '../locales/i18n.tsx';

interface VoiceButtonProps {
  textToSpeak: string;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  textToSpeak,
  label,
  size = 'sm',
  className = ''
}) => {
  const { language, t } = useI18n();
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const unsubscribe = speechEngine.subscribe(state => {
      setSpeaking(state.isSpeaking);
      setPaused(state.isPaused);
    });
    return unsubscribe;
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!speaking) {
      speechEngine.speak(textToSpeak, language);
    } else if (speaking && !paused) {
      speechEngine.pause();
    } else {
      speechEngine.resume();
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    speechEngine.stop();
  };

  const isSmall = size === 'sm';

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        title={speaking ? (paused ? t.voice.resume : t.voice.pause) : t.voice.listen}
        aria-label={label || t.voice.listen}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-150 cursor-pointer ${
          speaking
            ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-[#0c382a] dark:hover:bg-[#124936] dark:text-emerald-200 dark:border-[#17523d]'
        } ${isSmall ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'}`}
      >
        {speaking ? (
          paused ? (
            <Play className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          ) : (
            <Pause className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4 animate-pulse'} />
          )
        ) : (
          <Volume2 className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4 text-emerald-700'} />
        )}
        <span>{label || (speaking ? (paused ? t.voice.resume : t.voice.pause) : t.voice.listen)}</span>
      </button>

      {speaking && (
        <button
          type="button"
          onClick={handleStop}
          title={t.voice.stop}
          aria-label={t.voice.stop}
          className="p-1 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <VolumeX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
