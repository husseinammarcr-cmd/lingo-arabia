// Compact lesson transform — derives kept vocab/sentences from what the
// practice & quiz actually use, so the learner never sees an exercise that
// references material the lesson never taught.
import type { LessonContent, ExerciseItem, QuizItem, VocabItem, SentenceItem } from './a1-lessons';

const MAX_EXERCISES = 3;
const MAX_QUIZ = 2;
// Soft caps for the Learn step. We may keep fewer if the exercises don't
// reference that many items, or slightly more if the exercises need them.
const MIN_VOCAB = 3;
const MIN_SENTENCES = 1;
const HARD_MAX_VOCAB = 8;
const HARD_MAX_SENTENCES = 4;

const norm = (s: string | undefined | null) =>
  (s || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim();

const tokens = (s: string | undefined | null) => {
  const n = norm(s);
  if (!n) return [] as string[];
  return [n, ...n.split(/\s+/).filter((t) => t.length > 1)];
};

/** Every English/Arabic text bit an exercise references. */
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

function exerciseTokenSet(ex: ExerciseItem): Set<string> {
  const set = new Set<string>();
  collectExerciseTexts(ex).forEach((t) => tokens(t).forEach((tok) => set.add(tok)));
  return set;
}

function vocabTokenSet(v: VocabItem): Set<string> {
  const set = new Set<string>();
  [v.english, v.arabic, v.example, v.exampleAr].forEach((t) =>
    tokens(t).forEach((tok) => set.add(tok))
  );
  return set;
}

function sentenceTokenSet(s: SentenceItem): Set<string> {
  const set = new Set<string>();
  [s.english, s.arabic].forEach((t) => tokens(t).forEach((tok) => set.add(tok)));
  return set;
}

const intersects = (a: Set<string>, b: Set<string>) => {
  for (const t of a) if (b.has(t)) return true;
  return false;
};

function buildSpeakingExercise(
  vocab: VocabItem[],
  sentences: SentenceItem[]
): ExerciseItem | null {
  const sentence = sentences[0]?.english || vocab[0]?.example || vocab[0]?.english;
  if (!sentence) return null;
  const arabicHint =
    sentences[0]?.arabic || vocab[0]?.exampleAr || vocab[0]?.arabic || '';
  return {
    type: 'speaking' as ExerciseItem['type'],
    promptAr: 'انطق الجملة التالية بالإنجليزية',
    promptEn: arabicHint,
    data: { answer: sentence },
  };
}

const cache = new Map<string, LessonContent>();

export function compactLesson(lesson: LessonContent): LessonContent {
  if (cache.has(lesson.lessonId)) return cache.get(lesson.lessonId)!;

  const allVocab = lesson.vocab || [];
  const allSentences = lesson.sentences || [];
  const allExercises = lesson.exercises || [];
  const allQuiz = (lesson.quiz || []) as QuizItem[];

  // 1. Pick the practice + quiz items first, preferring those that reuse
  //    early vocab (so the learner studies a tight, coherent set).
  const earlyVocabTokens = new Set<string>();
  allVocab.slice(0, MIN_VOCAB).forEach((v) =>
    vocabTokenSet(v).forEach((t) => earlyVocabTokens.add(t))
  );
  allSentences.slice(0, MIN_SENTENCES).forEach((s) =>
    sentenceTokenSet(s).forEach((t) => earlyVocabTokens.add(t))
  );

  const scoreExercise = (ex: ExerciseItem): number =>
    intersects(exerciseTokenSet(ex), earlyVocabTokens) ? 1 : 0;

  const rankedExercises = [...allExercises]
    .map((e, i) => ({ e, i, score: scoreExercise(e) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.e);

  const rankedQuiz = [...allQuiz]
    .map((q, i) => ({ q, i, score: scoreExercise(q) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.q);

  const exercises = rankedExercises.slice(0, MAX_EXERCISES);
  const quiz = rankedQuiz.slice(0, MAX_QUIZ);

  // 2. Derive the allowed vocab/sentence set precisely from what those
  //    exercises actually reference (plus a small base so Learn isn't empty).
  const requiredTokens = new Set<string>();
  [...exercises, ...quiz].forEach((ex) =>
    exerciseTokenSet(ex).forEach((t) => requiredTokens.add(t))
  );

  const keepVocab: VocabItem[] = [];
  const keepVocabIdx = new Set<number>();
  allVocab.forEach((v, i) => {
    if (intersects(vocabTokenSet(v), requiredTokens)) {
      keepVocab.push(v);
      keepVocabIdx.add(i);
    }
  });
  // Pad with first few so we always teach at least MIN_VOCAB items.
  for (let i = 0; i < allVocab.length && keepVocab.length < MIN_VOCAB; i++) {
    if (!keepVocabIdx.has(i)) {
      keepVocab.push(allVocab[i]);
      keepVocabIdx.add(i);
    }
  }
  const vocab = keepVocab.slice(0, HARD_MAX_VOCAB);

  const keepSentences: SentenceItem[] = [];
  const keepSentenceIdx = new Set<number>();
  allSentences.forEach((s, i) => {
    if (intersects(sentenceTokenSet(s), requiredTokens)) {
      keepSentences.push(s);
      keepSentenceIdx.add(i);
    }
  });
  for (let i = 0; i < allSentences.length && keepSentences.length < MIN_SENTENCES; i++) {
    if (!keepSentenceIdx.has(i)) {
      keepSentences.push(allSentences[i]);
      keepSentenceIdx.add(i);
    }
  }
  const sentences = keepSentences.slice(0, HARD_MAX_SENTENCES);

  // 3. Safety net: drop any exercise/quiz item that still references content
  //    not present in the final kept vocab/sentences set.
  const taughtTokens = new Set<string>();
  vocab.forEach((v) => vocabTokenSet(v).forEach((t) => taughtTokens.add(t)));
  sentences.forEach((s) => sentenceTokenSet(s).forEach((t) => taughtTokens.add(t)));

  const isTaught = (ex: ExerciseItem) => {
    const texts = collectExerciseTexts(ex);
    if (texts.length === 0) return true;
    const exTok = exerciseTokenSet(ex);
    return intersects(exTok, taughtTokens);
  };

  const safeExercises = exercises.filter(isTaught);
  const safeQuiz = quiz.filter(isTaught);

  // 4. Speaking bonus uses the first kept sentence/vocab — always safe.
  const speaking = buildSpeakingExercise(vocab, sentences);
  if (speaking) safeExercises.push(speaking);

  const compact: LessonContent = {
    ...lesson,
    vocab,
    sentences,
    exercises: safeExercises,
    quiz: safeQuiz,
    passingScore: 50,
  };
  cache.set(lesson.lessonId, compact);
  return compact;
}
