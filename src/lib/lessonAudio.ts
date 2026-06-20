/**
 * Lesson audio playback using server-side TTS.
 * Replaces browser Web Speech API (speechSynthesis) with natural-voice MP3
 * streamed from https://api.lingoarab.com/tts.
 *
 * Caches blob URLs per text so repeated plays are instant.
 */

const TTS_ENDPOINT = 'https://api.lingoarab.com/tts';

const urlCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

function stopCurrent() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      /* ignore */
    }
    currentAudio = null;
  }
}

async function getAudioUrl(text: string): Promise<string> {
  const key = text.trim();
  const cached = urlCache.get(key);
  if (cached) return cached;

  const res = await fetch(TTS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: key }),
  });
  if (!res.ok) throw new Error('TTS request failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  urlCache.set(key, url);
  return url;
}

/**
 * Play a piece of lesson text as natural audio.
 * Resolves when playback ends (or rejects on error).
 */
export async function playLessonAudio(text: string): Promise<void> {
  const clean = (text || '').trim();
  if (!clean) return;

  stopCurrent();

  let url: string;
  try {
    url = await getAudioUrl(clean);
  } catch (e) {
    console.error('خطأ بتشغيل الصوت:', e);
    throw e;
  }

  return new Promise<void>((resolve, reject) => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
      resolve();
    };
    audio.onerror = (e) => {
      if (currentAudio === audio) currentAudio = null;
      console.error('خطأ بتشغيل الصوت:', e);
      reject(e);
    };
    audio.play().catch((e) => {
      if (currentAudio === audio) currentAudio = null;
      console.error('خطأ بتشغيل الصوت:', e);
      reject(e);
    });
  });
}

export function stopLessonAudio() {
  stopCurrent();
}
