// A1 Unit 6: Places & Directions - الأماكن والاتجاهات
import { LessonContent } from './a1-lessons';

const unit6Lesson1: LessonContent = {
  id: 'A1-u06-l01',
  unitId: 'A1-u06',
  title_en: 'Common Places',
  title_ar: 'الأماكن الشائعة',
  vocabulary: [
    { en: 'hospital', ar: 'مستشفى' },
    { en: 'school', ar: 'مدرسة' },
    { en: 'bank', ar: 'بنك' },
    { en: 'supermarket', ar: 'سوبرماركت' },
    { en: 'pharmacy', ar: 'صيدلية' },
    { en: 'restaurant', ar: 'مطعم' },
    { en: 'park', ar: 'حديقة' },
    { en: 'library', ar: 'مكتبة' },
    { en: 'mosque', ar: 'مسجد' },
    { en: 'police station', ar: 'مركز شرطة' }
  ],
  sentences: [
    { en: 'The hospital is near here.', ar: 'المستشفى قريب من هنا.' },
    { en: 'I go to school every day.', ar: 'أذهب إلى المدرسة كل يوم.' },
    { en: 'The bank opens at nine.', ar: 'البنك يفتح الساعة التاسعة.' },
    { en: 'There is a pharmacy next to the supermarket.', ar: 'هناك صيدلية بجانب السوبرماركت.' },
    { en: 'The park is beautiful.', ar: 'الحديقة جميلة.' },
    { en: 'I read books at the library.', ar: 'أقرأ الكتب في المكتبة.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "hospital" in Arabic?',
      prompt_ar: 'ما هي "hospital" بالعربية؟',
      options: ['مدرسة', 'مستشفى', 'صيدلية', 'مطعم'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مكتبة" in English?',
      prompt_ar: 'ما هي "مكتبة" بالإنجليزية؟',
      options: ['school', 'bank', 'library', 'park'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'The ___ is near here. (hospital)',
      prompt_ar: 'ال___ قريب من هنا.',
      answer: 'hospital'
    },
    {
      type: 'matching',
      prompt_en: 'Match the places',
      prompt_ar: 'طابق الأماكن',
      pairs: [
        { en: 'bank', ar: 'بنك' },
        { en: 'park', ar: 'حديقة' },
        { en: 'mosque', ar: 'مسجد' },
        { en: 'restaurant', ar: 'مطعم' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: is / The / beautiful / park',
      prompt_ar: 'رتب الكلمات',
      words: ['is', 'The', 'beautiful', 'park'],
      correctOrder: ['The', 'park', 'is', 'beautiful']
    },
    {
      type: 'mcq',
      prompt_en: 'Where do you buy medicine?',
      prompt_ar: 'أين تشتري الدواء؟',
      options: ['library', 'pharmacy', 'bank', 'park'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I read books at the ___.',
      prompt_ar: 'أقرأ الكتب في ال___.',
      answer: 'library'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مسجد" in English?',
      prompt_ar: 'ما هي "مسجد" بالإنجليزية؟',
      options: ['church', 'mosque', 'temple', 'school'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "supermarket" in Arabic?',
      prompt_ar: 'ما هي "supermarket" بالعربية؟',
      options: ['صيدلية', 'سوبرماركت', 'مطعم', 'بنك'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "حديقة" in English?',
      prompt_ar: 'ما هي "حديقة" بالإنجليزية؟',
      options: ['garden', 'park', 'forest', 'farm'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'The ___ opens at nine. (bank)',
      prompt_ar: 'ال___ يفتح الساعة التاسعة.',
      answer: 'bank'
    },
    {
      type: 'matching',
      prompt_en: 'Match the places',
      prompt_ar: 'طابق الأماكن',
      pairs: [
        { en: 'hospital', ar: 'مستشفى' },
        { en: 'school', ar: 'مدرسة' },
        { en: 'pharmacy', ar: 'صيدلية' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'Where do police officers work?',
      prompt_ar: 'أين يعمل رجال الشرطة؟',
      options: ['hospital', 'police station', 'school', 'bank'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: every / to / go / I / school / day',
      prompt_ar: 'رتب الكلمات',
      words: ['every', 'to', 'go', 'I', 'school', 'day'],
      correctOrder: ['I', 'go', 'to', 'school', 'every', 'day']
    }
  ]
};

const unit6Lesson2: LessonContent = {
  id: 'A1-u06-l02',
  unitId: 'A1-u06',
  title_en: 'Directions',
  title_ar: 'الاتجاهات',
  vocabulary: [
    { en: 'right', ar: 'يمين' },
    { en: 'left', ar: 'يسار' },
    { en: 'straight', ar: 'مستقيم' },
    { en: 'near', ar: 'قريب' },
    { en: 'far', ar: 'بعيد' },
    { en: 'next to', ar: 'بجانب' },
    { en: 'behind', ar: 'خلف' },
    { en: 'in front of', ar: 'أمام' },
    { en: 'between', ar: 'بين' },
    { en: 'corner', ar: 'زاوية' }
  ],
  sentences: [
    { en: 'Turn right at the corner.', ar: 'انعطف يميناً عند الزاوية.' },
    { en: 'Go straight ahead.', ar: 'امشِ مستقيماً.' },
    { en: 'The bank is next to the pharmacy.', ar: 'البنك بجانب الصيدلية.' },
    { en: 'The school is behind the mosque.', ar: 'المدرسة خلف المسجد.' },
    { en: 'It is not far from here.', ar: 'ليس بعيداً من هنا.' },
    { en: 'The park is between the hospital and the library.', ar: 'الحديقة بين المستشفى والمكتبة.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "right" in Arabic?',
      prompt_ar: 'ما هي "right" بالعربية؟',
      options: ['يسار', 'يمين', 'مستقيم', 'خلف'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "بجانب" in English?',
      prompt_ar: 'ما هي "بجانب" بالإنجليزية؟',
      options: ['behind', 'in front of', 'next to', 'between'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'Turn ___ at the corner. (right)',
      prompt_ar: 'انعطف ___ عند الزاوية.',
      answer: 'right'
    },
    {
      type: 'matching',
      prompt_en: 'Match the directions',
      prompt_ar: 'طابق الاتجاهات',
      pairs: [
        { en: 'left', ar: 'يسار' },
        { en: 'straight', ar: 'مستقيم' },
        { en: 'near', ar: 'قريب' },
        { en: 'far', ar: 'بعيد' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: straight / Go / ahead',
      prompt_ar: 'رتب الكلمات',
      words: ['straight', 'Go', 'ahead'],
      correctOrder: ['Go', 'straight', 'ahead']
    },
    {
      type: 'mcq',
      prompt_en: 'What is the opposite of "near"?',
      prompt_ar: 'ما عكس "قريب"؟',
      options: ['left', 'right', 'far', 'straight'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'The school is ___ the mosque. (behind)',
      prompt_ar: 'المدرسة ___ المسجد.',
      answer: 'behind'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "أمام" in English?',
      prompt_ar: 'ما هي "أمام" بالإنجليزية؟',
      options: ['behind', 'in front of', 'next to', 'between'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "left" in Arabic?',
      prompt_ar: 'ما هي "left" بالعربية؟',
      options: ['يمين', 'يسار', 'مستقيم', 'قريب'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "خلف" in English?',
      prompt_ar: 'ما هي "خلف" بالإنجليزية؟',
      options: ['in front of', 'next to', 'behind', 'between'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'It is not ___ from here. (far)',
      prompt_ar: 'ليس ___ من هنا.',
      answer: 'far'
    },
    {
      type: 'matching',
      prompt_en: 'Match the directions',
      prompt_ar: 'طابق الاتجاهات',
      pairs: [
        { en: 'corner', ar: 'زاوية' },
        { en: 'between', ar: 'بين' },
        { en: 'in front of', ar: 'أمام' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مستقيم" in English?',
      prompt_ar: 'ما هي "مستقيم" بالإنجليزية؟',
      options: ['right', 'left', 'straight', 'corner'],
      correctIndex: 2
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: next / is / The / pharmacy / bank / to / the',
      prompt_ar: 'رتب الكلمات',
      words: ['next', 'is', 'The', 'pharmacy', 'bank', 'to', 'the'],
      correctOrder: ['The', 'bank', 'is', 'next', 'to', 'the', 'pharmacy']
    }
  ]
};

const unit6Lesson3: LessonContent = {
  id: 'A1-u06-l03',
  unitId: 'A1-u06',
  title_en: 'Asking for Directions',
  title_ar: 'السؤال عن الاتجاهات',
  vocabulary: [
    { en: 'where', ar: 'أين' },
    { en: 'how', ar: 'كيف' },
    { en: 'excuse me', ar: 'عفواً' },
    { en: 'can you help', ar: 'هل يمكنك المساعدة' },
    { en: 'I am looking for', ar: 'أبحث عن' },
    { en: 'I am lost', ar: 'أنا تائه' },
    { en: 'which way', ar: 'أي طريق' },
    { en: 'address', ar: 'عنوان' },
    { en: 'map', ar: 'خريطة' },
    { en: 'thank you', ar: 'شكراً' }
  ],
  sentences: [
    { en: 'Excuse me, where is the hospital?', ar: 'عفواً، أين المستشفى؟' },
    { en: 'Can you help me please?', ar: 'هل يمكنك مساعدتي من فضلك؟' },
    { en: 'I am looking for the bank.', ar: 'أبحث عن البنك.' },
    { en: 'I am lost. Which way to the park?', ar: 'أنا تائه. أي طريق للحديقة؟' },
    { en: 'Do you have a map?', ar: 'هل لديك خريطة؟' },
    { en: 'What is your address?', ar: 'ما هو عنوانك؟' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "where" in Arabic?',
      prompt_ar: 'ما هي "where" بالعربية؟',
      options: ['كيف', 'متى', 'أين', 'لماذا'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "عفواً" in English?',
      prompt_ar: 'ما هي "عفواً" بالإنجليزية؟',
      options: ['thank you', 'excuse me', 'please', 'sorry'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: '___, where is the hospital? (Excuse me)',
      prompt_ar: '___، أين المستشفى؟',
      answer: 'Excuse me'
    },
    {
      type: 'matching',
      prompt_en: 'Match the phrases',
      prompt_ar: 'طابق العبارات',
      pairs: [
        { en: 'I am lost', ar: 'أنا تائه' },
        { en: 'map', ar: 'خريطة' },
        { en: 'address', ar: 'عنوان' },
        { en: 'thank you', ar: 'شكراً' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: is / where / the / hospital',
      prompt_ar: 'رتب الكلمات',
      words: ['is', 'where', 'the', 'hospital'],
      correctOrder: ['where', 'is', 'the', 'hospital']
    },
    {
      type: 'mcq',
      prompt_en: 'What do you say when you need help finding a place?',
      prompt_ar: 'ماذا تقول عندما تحتاج مساعدة لإيجاد مكان؟',
      options: ['I am tired', 'I am looking for', 'I am hungry', 'I am happy'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I am ___ for the bank. (looking)',
      prompt_ar: 'أ___ عن البنك.',
      answer: 'looking'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "خريطة" in English?',
      prompt_ar: 'ما هي "خريطة" بالإنجليزية؟',
      options: ['address', 'map', 'direction', 'street'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "how" in Arabic?',
      prompt_ar: 'ما هي "how" بالعربية؟',
      options: ['أين', 'كيف', 'متى', 'ماذا'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "أبحث عن" in English?',
      prompt_ar: 'ما هي "أبحث عن" بالإنجليزية؟',
      options: ['I am tired', 'I am looking for', 'I am lost', 'I am going'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'Can you ___ me please? (help)',
      prompt_ar: 'هل يمكنك ___ من فضلك؟',
      answer: 'help'
    },
    {
      type: 'matching',
      prompt_en: 'Match the phrases',
      prompt_ar: 'طابق العبارات',
      pairs: [
        { en: 'where', ar: 'أين' },
        { en: 'which way', ar: 'أي طريق' },
        { en: 'excuse me', ar: 'عفواً' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "عنوان" in English?',
      prompt_ar: 'ما هي "عنوان" بالإنجليزية؟',
      options: ['map', 'street', 'address', 'direction'],
      correctIndex: 2
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: looking / am / I / bank / the / for',
      prompt_ar: 'رتب الكلمات',
      words: ['looking', 'am', 'I', 'bank', 'the', 'for'],
      correctOrder: ['I', 'am', 'looking', 'for', 'the', 'bank']
    }
  ]
};

const unit6Lesson4: LessonContent = {
  id: 'A1-u06-l04',
  unitId: 'A1-u06',
  title_en: 'Transportation',
  title_ar: 'وسائل النقل',
  vocabulary: [
    { en: 'car', ar: 'سيارة' },
    { en: 'bus', ar: 'حافلة' },
    { en: 'taxi', ar: 'تاكسي' },
    { en: 'train', ar: 'قطار' },
    { en: 'plane', ar: 'طائرة' },
    { en: 'bicycle', ar: 'دراجة' },
    { en: 'walk', ar: 'يمشي' },
    { en: 'drive', ar: 'يقود' },
    { en: 'station', ar: 'محطة' },
    { en: 'airport', ar: 'مطار' }
  ],
  sentences: [
    { en: 'I go to work by car.', ar: 'أذهب إلى العمل بالسيارة.' },
    { en: 'The bus station is near.', ar: 'محطة الحافلات قريبة.' },
    { en: 'I take a taxi to the airport.', ar: 'آخذ تاكسي إلى المطار.' },
    { en: 'The train is fast.', ar: 'القطار سريع.' },
    { en: 'I like to walk in the park.', ar: 'أحب أن أمشي في الحديقة.' },
    { en: 'He drives to school.', ar: 'يقود إلى المدرسة.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "car" in Arabic?',
      prompt_ar: 'ما هي "car" بالعربية؟',
      options: ['حافلة', 'قطار', 'سيارة', 'طائرة'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "محطة" in English?',
      prompt_ar: 'ما هي "محطة" بالإنجليزية؟',
      options: ['airport', 'station', 'bus', 'train'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I go to work by ___. (car)',
      prompt_ar: 'أذهب إلى العمل بال___.',
      answer: 'car'
    },
    {
      type: 'matching',
      prompt_en: 'Match the transportation',
      prompt_ar: 'طابق وسائل النقل',
      pairs: [
        { en: 'bus', ar: 'حافلة' },
        { en: 'train', ar: 'قطار' },
        { en: 'plane', ar: 'طائرة' },
        { en: 'bicycle', ar: 'دراجة' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: is / The / fast / train',
      prompt_ar: 'رتب الكلمات',
      words: ['is', 'The', 'fast', 'train'],
      correctOrder: ['The', 'train', 'is', 'fast']
    },
    {
      type: 'mcq',
      prompt_en: 'Where do planes land?',
      prompt_ar: 'أين تهبط الطائرات؟',
      options: ['station', 'hospital', 'airport', 'school'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'The bus ___ is near. (station)',
      prompt_ar: '___ الحافلات قريبة.',
      answer: 'station'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يمشي" in English?',
      prompt_ar: 'ما هي "يمشي" بالإنجليزية؟',
      options: ['run', 'walk', 'drive', 'fly'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "taxi" in Arabic?',
      prompt_ar: 'ما هي "taxi" بالعربية؟',
      options: ['حافلة', 'تاكسي', 'قطار', 'سيارة'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مطار" in English?',
      prompt_ar: 'ما هي "مطار" بالإنجليزية؟',
      options: ['station', 'airport', 'hospital', 'school'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I take a ___ to the airport. (taxi)',
      prompt_ar: 'آخذ ___ إلى المطار.',
      answer: 'taxi'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'walk', ar: 'يمشي' },
        { en: 'drive', ar: 'يقود' },
        { en: 'station', ar: 'محطة' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "دراجة" in English?',
      prompt_ar: 'ما هي "دراجة" بالإنجليزية؟',
      options: ['car', 'bus', 'bicycle', 'train'],
      correctIndex: 2
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: to / like / walk / I / park / the / in',
      prompt_ar: 'رتب الكلمات',
      words: ['to', 'like', 'walk', 'I', 'park', 'the', 'in'],
      correctOrder: ['I', 'like', 'to', 'walk', 'in', 'the', 'park']
    }
  ]
};

const unit6Lesson5: LessonContent = {
  id: 'A1-u06-l05',
  unitId: 'A1-u06',
  title_en: 'At the City',
  title_ar: 'في المدينة',
  vocabulary: [
    { en: 'city', ar: 'مدينة' },
    { en: 'street', ar: 'شارع' },
    { en: 'building', ar: 'مبنى' },
    { en: 'bridge', ar: 'جسر' },
    { en: 'traffic', ar: 'مرور' },
    { en: 'traffic light', ar: 'إشارة مرور' },
    { en: 'crosswalk', ar: 'ممر المشاة' },
    { en: 'downtown', ar: 'وسط المدينة' },
    { en: 'neighborhood', ar: 'حي' },
    { en: 'square', ar: 'ميدان' }
  ],
  sentences: [
    { en: 'The city is big.', ar: 'المدينة كبيرة.' },
    { en: 'I live on a quiet street.', ar: 'أسكن في شارع هادئ.' },
    { en: 'There is a lot of traffic downtown.', ar: 'هناك مرور كثير في وسط المدينة.' },
    { en: 'Wait at the traffic light.', ar: 'انتظر عند إشارة المرور.' },
    { en: 'The building is tall.', ar: 'المبنى عالٍ.' },
    { en: 'Cross at the crosswalk.', ar: 'اعبر عند ممر المشاة.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "city" in Arabic?',
      prompt_ar: 'ما هي "city" بالعربية؟',
      options: ['قرية', 'مدينة', 'حي', 'شارع'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "شارع" in English?',
      prompt_ar: 'ما هي "شارع" بالإنجليزية؟',
      options: ['building', 'bridge', 'street', 'square'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'The ___ is big. (city)',
      prompt_ar: 'ال___ كبيرة.',
      answer: 'city'
    },
    {
      type: 'matching',
      prompt_en: 'Match the city words',
      prompt_ar: 'طابق كلمات المدينة',
      pairs: [
        { en: 'building', ar: 'مبنى' },
        { en: 'bridge', ar: 'جسر' },
        { en: 'traffic', ar: 'مرور' },
        { en: 'square', ar: 'ميدان' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: is / The / tall / building',
      prompt_ar: 'رتب الكلمات',
      words: ['is', 'The', 'tall', 'building'],
      correctOrder: ['The', 'building', 'is', 'tall']
    },
    {
      type: 'mcq',
      prompt_en: 'Where should you cross the street safely?',
      prompt_ar: 'أين يجب أن تعبر الشارع بأمان؟',
      options: ['traffic light', 'crosswalk', 'bridge', 'downtown'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'Wait at the traffic ___. (light)',
      prompt_ar: 'انتظر عند ___ المرور.',
      answer: 'light'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "وسط المدينة" in English?',
      prompt_ar: 'ما هي "وسط المدينة" بالإنجليزية؟',
      options: ['neighborhood', 'downtown', 'street', 'square'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "street" in Arabic?',
      prompt_ar: 'ما هي "street" بالعربية؟',
      options: ['مبنى', 'جسر', 'شارع', 'ميدان'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مرور" in English?',
      prompt_ar: 'ما هي "مرور" بالإنجليزية؟',
      options: ['building', 'traffic', 'bridge', 'street'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I live on a quiet ___. (street)',
      prompt_ar: 'أسكن في ___ هادئ.',
      answer: 'street'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'neighborhood', ar: 'حي' },
        { en: 'traffic light', ar: 'إشارة مرور' },
        { en: 'crosswalk', ar: 'ممر المشاة' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "جسر" in English?',
      prompt_ar: 'ما هي "جسر" بالإنجليزية؟',
      options: ['building', 'bridge', 'street', 'square'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: downtown / lot / There / of / is / traffic / a',
      prompt_ar: 'رتب الكلمات',
      words: ['downtown', 'lot', 'There', 'of', 'is', 'traffic', 'a'],
      correctOrder: ['There', 'is', 'a', 'lot', 'of', 'traffic', 'downtown']
    }
  ]
};

export const a1Unit6Lessons: Record<string, LessonContent> = {
  'A1-u06-l01': unit6Lesson1,
  'A1-u06-l02': unit6Lesson2,
  'A1-u06-l03': unit6Lesson3,
  'A1-u06-l04': unit6Lesson4,
  'A1-u06-l05': unit6Lesson5,
};
