import { useCallback, useState } from 'react';
import { playLessonAudio, stopLessonAudio } from '@/lib/lessonAudio';

/**
 * Hook for playing lesson text as natural audio via the server-side TTS
 * endpoint (https://api.lingoarab.com/tts). Replaces the previous Web Speech
 * API implementation. The public API is kept stable so existing callers
 * (AudioButton, etc.) keep working without UI changes.
 */
export const useSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);

  const isSupported = typeof window !== 'undefined' && typeof fetch !== 'undefined';

  const speak = useCallback((text: string, _options?: { rate?: number; lang?: string }) => {
    const cleanText = (text || '').trim();
    if (!cleanText) {
      console.warn('[useSpeech] empty text');
      return false;
    }
    if (!isSupported) return false;

    setIsLoading(true);
    playLessonAudio(cleanText)
      .catch((e) => console.error('[useSpeech] play failed:', e))
      .finally(() => setIsLoading(false));
    return true;
  }, [isSupported]);

  const stop = useCallback(() => {
    stopLessonAudio();
  }, []);

  return {
    speak,
    stop,
    isSupported,
    isReady: true,
    voiceCount: 1,
    isLoading,
  };
};
