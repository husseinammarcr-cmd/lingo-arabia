// Compact lesson transform — keeps lessons short AND only includes
// exercises/quiz items that reference vocab/sentences the user actually studied.
import type { LessonContent, ExerciseItem, QuizItem, VocabItem, SentenceItem } from './a1-lessons';

const MAX_VOCAB = 4;
const MAX_SENTENCES = 2;
const MAX_EXERCISES = 3;
const MAX_QUIZ = 2;

/**
 * Inject a speaking exercise that asks the user to pronounce the first sentence
 * (or first vocab example) of the lesson.
 */
function buildSpeakingExercise(lesson: LessonContent): ExerciseItem | null {
  const sentence =
    lesson.sentences?.[0]?.english ||
    lesson.vocab?.[0]?.example ||
    lesson.vocab?.[0]?.english;
  if (!sentence) return null;
  const arabicHint =
    lesson.sentences?.[0]?.arabic ||
    lesson.vocab?.[0]?.exampleAr ||
    lesson.vocab?.[0]?.arabic ||
    '';
  return {
    type: 'speaking' as ExerciseItem['type'],
    promptAr: 'انطق الجملة التالية بالإنجليزية',
    promptEn: arabicHint,
    data: {
      answer: sentence,
    },
  };
}

const norm = (s: string | undefined | null) =>
  (s || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim();

function buildAllowedSet(vocab: VocabItem[], sentences: SentenceItem[]): Set<string> {
  const set = new Set<string>();
  const addTokens = (text?: string) => {
    const n = norm(text);
    if (!n) return;
    set.add(n);
    n.split(/\s+/).forEach((tok) => { if (tok.length > 1) set.add(tok); });
  };
  vocab.forEach((v) => {
    addTokens(v.english);
    addTokens(v.arabic);
    addTokens(v.example);
    addTokens(v.exampleAr);
  });
  sentences.forEach((s) => {
    addTokens(s.english);
    addTokens(s.arabic);
  });
  return set;
}

/**
 * Collect every English text bit an exercise references (answer, options, words, pairs…).
 */
function collectExerciseTexts(ex: ExerciseItem): string[] {
  const out: string[] = [];
  const d = ex.data || {};
  if (d.answer) out.push(d.answer);
  if (d.alternatives) out.push(...d.alternatives);
  if (d.options) out.push(...d.options);
  if (d.words) out.push(...d.words);
  if (d.pairs) d.pairs.forEach((p) => { out.push(p.english); out.push(p.arabic); });
  if (ex.promptEn) out.push(ex.promptEn);
  return out;
}

function exerciseIsTaught(ex: ExerciseItem, allowed: Set<string>): boolean {
  const texts = collectExerciseTexts(ex);
  if (texts.length === 0) return true; // nothing to verify against
  // Pass if any meaningful token in the exercise appears in studied content.
  return texts.some((t) => {
    const n = norm(t);
    if (!n) return false;
    if (allowed.has(n)) return true;
    return n.split(/\s+/).some((tok) => tok.length > 1 && allowed.has(tok));
  });
}

const cache = new Map<string, LessonContent>();

export function compactLesson(lesson: LessonContent): LessonContent {
  if (cache.has(lesson.lessonId)) return cache.get(lesson.lessonId)!;

  const vocab = (lesson.vocab || []).slice(0, MAX_VOCAB);
  const sentences = (lesson.sentences || []).slice(0, MAX_SENTENCES);

  const allowed = buildAllowedSet(vocab, sentences);

  // Only keep exercises/quiz items whose content the user has actually studied.
  const taughtExercises = (lesson.exercises || []).filter((e) => exerciseIsTaught(e, allowed));
  const taughtQuiz = (lesson.quiz || []).filter((q) => exerciseIsTaught(q, allowed));

  const exercises = taughtExercises.slice(0, MAX_EXERCISES);
  const quiz = taughtQuiz.slice(0, MAX_QUIZ) as QuizItem[];

  // Add speaking exercise as bonus practice (uses kept sentence/vocab — always safe).
  const speaking = buildSpeakingExercise(lesson);
  if (speaking) exercises.push(speaking);

  const compact: LessonContent = {
    ...lesson,
    vocab,
    sentences,
    exercises,
    quiz,
    passingScore: 50, // open-progression friendly threshold for badge/needs_review
  };
  cache.set(lesson.lessonId, compact);
  return compact;
}
