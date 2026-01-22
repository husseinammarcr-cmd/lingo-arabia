import { LessonContent } from './a1-lessons';

export const A2_U1_L1: LessonContent = {
  lessonId: 'A2-u01-l01', passingScore: 70,
  vocab: [
    { english: 'went', arabic: 'ذهب', example: 'I went to school.', exampleAr: 'ذهبت للمدرسة.' },
    { english: 'ate', arabic: 'أكل', example: 'I ate breakfast.', exampleAr: 'أكلت الفطور.' },
    { english: 'saw', arabic: 'رأى', example: 'I saw a movie.', exampleAr: 'شاهدت فيلماً.' },
  ],
  sentences: [{ english: 'I went to the park yesterday.', arabic: 'ذهبت للحديقة أمس.' }],
  exercises: [{ type: 'mcq', promptAr: 'ما ماضي go؟', data: { options: ['went', 'goed', 'gone', 'going'], correct: 0 } }],
  quiz: [{ type: 'mcq', promptAr: 'ما ماضي eat؟', data: { options: ['ate', 'eated', 'eaten', 'eating'], correct: 0 }, points: 10 }],
};
export const A2_U1_L2: LessonContent = { lessonId: 'A2-u01-l02', passingScore: 70, vocab: [], sentences: [], exercises: [], quiz: [] };
export const A2_U1_L3: LessonContent = { lessonId: 'A2-u01-l03', passingScore: 70, vocab: [], sentences: [], exercises: [], quiz: [] };
export const A2_U1_L4: LessonContent = { lessonId: 'A2-u01-l04', passingScore: 70, vocab: [], sentences: [], exercises: [], quiz: [] };
export const A2_U1_L5: LessonContent = { lessonId: 'A2-u01-l05', passingScore: 70, vocab: [], sentences: [], exercises: [], quiz: [] };

export const a2Unit1Lessons: Record<string, LessonContent> = {
  'A2-u01-l01': A2_U1_L1, 'A2-u01-l02': A2_U1_L2, 'A2-u01-l03': A2_U1_L3, 'A2-u01-l04': A2_U1_L4, 'A2-u01-l05': A2_U1_L5,
};
