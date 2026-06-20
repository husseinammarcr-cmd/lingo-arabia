// Compact lesson transform — makes lessons shorter and adds speaking exercise
import type { LessonContent, ExerciseItem, QuizItem } from './a1-lessons';

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

const cache = new Map<string, LessonContent>();

export function compactLesson(lesson: LessonContent): LessonContent {
  if (cache.has(lesson.lessonId)) return cache.get(lesson.lessonId)!;

  const vocab = (lesson.vocab || []).slice(0, MAX_VOCAB);
  const sentences = (lesson.sentences || []).slice(0, MAX_SENTENCES);
  const exercises = (lesson.exercises || []).slice(0, MAX_EXERCISES);
  const quiz = (lesson.quiz || []).slice(0, MAX_QUIZ);

  // Add speaking exercise as bonus practice (4th)
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
