// Placement Test Questions - 30 questions across A1-B2 levels
// Mixed vocabulary, grammar, and reading comprehension

export interface PlacementQuestion {
  id: number;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  type: 'vocabulary' | 'grammar' | 'reading';
  questionAr: string;
  questionEn?: string;
  options: { id: string; text: string; textAr?: string }[];
  correctAnswer: string;
  explanation?: string;
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // A1 Level - Basic (Questions 1-8)
  {
    id: 1,
    level: 'A1',
    type: 'vocabulary',
    questionAr: 'ما معنى كلمة "Hello"؟',
    options: [
      { id: 'a', text: 'مرحباً', textAr: 'مرحباً' },
      { id: 'b', text: 'وداعاً', textAr: 'وداعاً' },
      { id: 'c', text: 'شكراً', textAr: 'شكراً' },
      { id: 'd', text: 'آسف', textAr: 'آسف' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 2,
    level: 'A1',
    type: 'vocabulary',
    questionAr: 'كيف تقول "أنا" بالإنجليزية؟',
    options: [
      { id: 'a', text: 'You' },
      { id: 'b', text: 'He' },
      { id: 'c', text: 'I' },
      { id: 'd', text: 'We' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 3,
    level: 'A1',
    type: 'grammar',
    questionAr: 'اختر الجملة الصحيحة:',
    options: [
      { id: 'a', text: 'I am a student.' },
      { id: 'b', text: 'I is a student.' },
      { id: 'c', text: 'I are a student.' },
      { id: 'd', text: 'I be a student.' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 4,
    level: 'A1',
    type: 'vocabulary',
    questionAr: 'ما هو عكس كلمة "big" (كبير)؟',
    options: [
      { id: 'a', text: 'tall' },
      { id: 'b', text: 'small' },
      { id: 'c', text: 'long' },
      { id: 'd', text: 'wide' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 5,
    level: 'A1',
    type: 'grammar',
    questionAr: 'أكمل: She ___ a teacher.',
    options: [
      { id: 'a', text: 'am' },
      { id: 'b', text: 'is' },
      { id: 'c', text: 'are' },
      { id: 'd', text: 'be' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 6,
    level: 'A1',
    type: 'vocabulary',
    questionAr: 'ما معنى "water"؟',
    options: [
      { id: 'a', text: 'نار', textAr: 'نار' },
      { id: 'b', text: 'هواء', textAr: 'هواء' },
      { id: 'c', text: 'ماء', textAr: 'ماء' },
      { id: 'd', text: 'تراب', textAr: 'تراب' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 7,
    level: 'A1',
    type: 'grammar',
    questionAr: 'أكمل: They ___ my friends.',
    options: [
      { id: 'a', text: 'am' },
      { id: 'b', text: 'is' },
      { id: 'c', text: 'are' },
      { id: 'd', text: 'was' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 8,
    level: 'A1',
    type: 'vocabulary',
    questionAr: 'كم عدد الأيام في الأسبوع بالإنجليزية؟',
    options: [
      { id: 'a', text: 'Five' },
      { id: 'b', text: 'Six' },
      { id: 'c', text: 'Seven' },
      { id: 'd', text: 'Eight' },
    ],
    correctAnswer: 'c',
  },

  // A2 Level - Elementary (Questions 9-16)
  {
    id: 9,
    level: 'A2',
    type: 'grammar',
    questionAr: 'أكمل: I ___ to school yesterday.',
    options: [
      { id: 'a', text: 'go' },
      { id: 'b', text: 'goes' },
      { id: 'c', text: 'went' },
      { id: 'd', text: 'going' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 10,
    level: 'A2',
    type: 'vocabulary',
    questionAr: 'ما معنى "sometimes"؟',
    options: [
      { id: 'a', text: 'دائماً', textAr: 'دائماً' },
      { id: 'b', text: 'أبداً', textAr: 'أبداً' },
      { id: 'c', text: 'أحياناً', textAr: 'أحياناً' },
      { id: 'd', text: 'عادةً', textAr: 'عادةً' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 11,
    level: 'A2',
    type: 'grammar',
    questionAr: 'اختر الجملة الصحيحة:',
    options: [
      { id: 'a', text: 'She can sings well.' },
      { id: 'b', text: 'She can sing well.' },
      { id: 'c', text: 'She can to sing well.' },
      { id: 'd', text: 'She can singing well.' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 12,
    level: 'A2',
    type: 'vocabulary',
    questionAr: 'ما الفرق بين "borrow" و "lend"؟',
    options: [
      { id: 'a', text: 'borrow = يعطي، lend = يأخذ' },
      { id: 'b', text: 'borrow = يستعير، lend = يُعير' },
      { id: 'c', text: 'نفس المعنى' },
      { id: 'd', text: 'borrow = يشتري، lend = يبيع' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 13,
    level: 'A2',
    type: 'grammar',
    questionAr: 'أكمل: There ___ some milk in the fridge.',
    options: [
      { id: 'a', text: 'is' },
      { id: 'b', text: 'are' },
      { id: 'c', text: 'be' },
      { id: 'd', text: 'have' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 14,
    level: 'A2',
    type: 'reading',
    questionAr: '"I wake up at 7 AM every day. Then I have breakfast and go to work." - ماذا يفعل الشخص أولاً؟',
    options: [
      { id: 'a', text: 'يذهب للعمل' },
      { id: 'b', text: 'يتناول الفطور' },
      { id: 'c', text: 'يستيقظ' },
      { id: 'd', text: 'ينام' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 15,
    level: 'A2',
    type: 'grammar',
    questionAr: 'أكمل: This book is ___ than that one.',
    options: [
      { id: 'a', text: 'interesting' },
      { id: 'b', text: 'more interesting' },
      { id: 'c', text: 'most interesting' },
      { id: 'd', text: 'interestinger' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 16,
    level: 'A2',
    type: 'vocabulary',
    questionAr: 'ما معنى "appointment"؟',
    options: [
      { id: 'a', text: 'هدية' },
      { id: 'b', text: 'موعد' },
      { id: 'c', text: 'مفاجأة' },
      { id: 'd', text: 'رحلة' },
    ],
    correctAnswer: 'b',
  },

  // B1 Level - Intermediate (Questions 17-24)
  {
    id: 17,
    level: 'B1',
    type: 'grammar',
    questionAr: 'أكمل: If I ___ rich, I would travel the world.',
    options: [
      { id: 'a', text: 'am' },
      { id: 'b', text: 'was' },
      { id: 'c', text: 'were' },
      { id: 'd', text: 'will be' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 18,
    level: 'B1',
    type: 'vocabulary',
    questionAr: 'ما معنى "although"؟',
    options: [
      { id: 'a', text: 'لأن' },
      { id: 'b', text: 'على الرغم من' },
      { id: 'c', text: 'بسبب' },
      { id: 'd', text: 'حتى' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 19,
    level: 'B1',
    type: 'grammar',
    questionAr: 'اختر الجملة الصحيحة:',
    options: [
      { id: 'a', text: 'The house was building in 1990.' },
      { id: 'b', text: 'The house was built in 1990.' },
      { id: 'c', text: 'The house was build in 1990.' },
      { id: 'd', text: 'The house is building in 1990.' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 20,
    level: 'B1',
    type: 'reading',
    questionAr: '"Despite the bad weather, they decided to continue with the trip." - ماذا يعني هذا؟',
    options: [
      { id: 'a', text: 'ألغوا الرحلة بسبب الطقس' },
      { id: 'b', text: 'استمروا في الرحلة رغم الطقس السيء' },
      { id: 'c', text: 'انتظروا تحسن الطقس' },
      { id: 'd', text: 'غيروا وجهة الرحلة' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 21,
    level: 'B1',
    type: 'grammar',
    questionAr: 'أكمل: He asked me where I ___.',
    options: [
      { id: 'a', text: 'live' },
      { id: 'b', text: 'lived' },
      { id: 'c', text: 'am living' },
      { id: 'd', text: 'do live' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 22,
    level: 'B1',
    type: 'vocabulary',
    questionAr: 'ما معنى "to postpone"؟',
    options: [
      { id: 'a', text: 'يُلغي' },
      { id: 'b', text: 'يُقدّم' },
      { id: 'c', text: 'يُؤجّل' },
      { id: 'd', text: 'يُكرر' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 23,
    level: 'B1',
    type: 'grammar',
    questionAr: 'أكمل: I wish I ___ speak French.',
    options: [
      { id: 'a', text: 'can' },
      { id: 'b', text: 'could' },
      { id: 'c', text: 'will' },
      { id: 'd', text: 'would' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 24,
    level: 'B1',
    type: 'vocabulary',
    questionAr: 'ما الفرق بين "effect" و "affect"؟',
    options: [
      { id: 'a', text: 'effect = فعل، affect = اسم' },
      { id: 'b', text: 'effect = اسم، affect = فعل' },
      { id: 'c', text: 'نفس المعنى تماماً' },
      { id: 'd', text: 'effect = سلبي، affect = إيجابي' },
    ],
    correctAnswer: 'b',
  },

  // B2 Level - Upper Intermediate (Questions 25-30)
  {
    id: 25,
    level: 'B2',
    type: 'grammar',
    questionAr: 'أكمل: Had I known about the meeting, I ___ attended.',
    options: [
      { id: 'a', text: 'will have' },
      { id: 'b', text: 'would have' },
      { id: 'c', text: 'would' },
      { id: 'd', text: 'had' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 26,
    level: 'B2',
    type: 'vocabulary',
    questionAr: 'ما معنى "to take something for granted"؟',
    options: [
      { id: 'a', text: 'يأخذ شيئاً بالقوة' },
      { id: 'b', text: 'يعتبر شيئاً مسلّماً به' },
      { id: 'c', text: 'يرفض شيئاً' },
      { id: 'd', text: 'يعطي شيئاً بسخاء' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 27,
    level: 'B2',
    type: 'reading',
    questionAr: '"The unprecedented growth in technology has fundamentally altered the way we communicate." - ما المقصود بـ "unprecedented"؟',
    options: [
      { id: 'a', text: 'بطيء' },
      { id: 'b', text: 'متوقع' },
      { id: 'c', text: 'غير مسبوق' },
      { id: 'd', text: 'مؤقت' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 28,
    level: 'B2',
    type: 'grammar',
    questionAr: 'اختر الجملة الصحيحة:',
    options: [
      { id: 'a', text: 'Not only she speaks English, but also French.' },
      { id: 'b', text: 'Not only does she speak English, but also French.' },
      { id: 'c', text: 'Not only she does speak English, but also French.' },
      { id: 'd', text: 'She not only speaks English, but also French.' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 29,
    level: 'B2',
    type: 'vocabulary',
    questionAr: 'ما معنى "to beat around the bush"؟',
    options: [
      { id: 'a', text: 'يضرب الشجيرات' },
      { id: 'b', text: 'يتحدث بوضوح' },
      { id: 'c', text: 'يتجنب الموضوع الرئيسي' },
      { id: 'd', text: 'يمشي في الغابة' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 30,
    level: 'B2',
    type: 'grammar',
    questionAr: 'أكمل: By this time next year, I ___ my degree.',
    options: [
      { id: 'a', text: 'will complete' },
      { id: 'b', text: 'will have completed' },
      { id: 'c', text: 'complete' },
      { id: 'd', text: 'am completing' },
    ],
    correctAnswer: 'b',
  },
];

export const calculateLevel = (score: number, total: number): 'A1' | 'A2' | 'B1' | 'B2' => {
  const percentage = (score / total) * 100;
  
  if (percentage >= 85) return 'B2';
  if (percentage >= 65) return 'B1';
  if (percentage >= 45) return 'A2';
  return 'A1';
};

export const getLevelRecommendation = (level: 'A1' | 'A2' | 'B1' | 'B2'): string => {
  const recommendations: Record<string, string> = {
    'A1': 'أنت في المستوى المبتدئ. ستتعلم أساسيات اللغة الإنجليزية من التحيات والأرقام والتعبيرات اليومية البسيطة.',
    'A2': 'لديك معرفة أساسية جيدة! ستتعلم التعبير عن نفسك في مواقف يومية والتحدث عن الماضي والمستقبل.',
    'B1': 'أنت في المستوى المتوسط. ستتمكن من التعبير عن آرائك والتعامل مع مواقف متنوعة في السفر والعمل.',
    'B2': 'مستواك متقدم! ستتعلم التعبير بطلاقة ومناقشة مواضيع معقدة وفهم نصوص متقدمة.',
  };
  return recommendations[level];
};

export const getLevelDescription = (level: 'A1' | 'A2' | 'B1' | 'B2'): { title: string; subtitle: string } => {
  const descriptions: Record<string, { title: string; subtitle: string }> = {
    'A1': { title: 'مبتدئ', subtitle: 'Beginner' },
    'A2': { title: 'أساسي', subtitle: 'Elementary' },
    'B1': { title: 'متوسط', subtitle: 'Intermediate' },
    'B2': { title: 'فوق المتوسط', subtitle: 'Upper-Intermediate' },
  };
  return descriptions[level];
};
