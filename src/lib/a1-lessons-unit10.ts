// A1 Unit 10: Review - المراجعة
import { LessonContent } from './a1-lessons';

const unit10Lesson1: LessonContent = {
  id: 'A1-u10-l01',
  unitId: 'A1-u10',
  title_en: 'Greetings & People Review',
  title_ar: 'مراجعة التحيات والأشخاص',
  vocabulary: [
    { en: 'hello', ar: 'مرحبا' },
    { en: 'goodbye', ar: 'مع السلامة' },
    { en: 'family', ar: 'عائلة' },
    { en: 'friend', ar: 'صديق' },
    { en: 'teacher', ar: 'معلم' },
    { en: 'student', ar: 'طالب' },
    { en: 'nice to meet you', ar: 'سررت بلقائك' },
    { en: 'how are you', ar: 'كيف حالك' },
    { en: 'thank you', ar: 'شكراً' },
    { en: 'please', ar: 'من فضلك' }
  ],
  sentences: [
    { en: 'Hello, how are you?', ar: 'مرحبا، كيف حالك؟' },
    { en: 'I am fine, thank you.', ar: 'أنا بخير، شكراً.' },
    { en: 'Nice to meet you.', ar: 'سررت بلقائك.' },
    { en: 'This is my family.', ar: 'هذه عائلتي.' },
    { en: 'She is my friend.', ar: 'هي صديقتي.' },
    { en: 'He is my teacher.', ar: 'هو معلمي.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "hello" in Arabic?',
      prompt_ar: 'ما هي "hello" بالعربية؟',
      options: ['مع السلامة', 'مرحبا', 'شكراً', 'من فضلك'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "عائلة" in English?',
      prompt_ar: 'ما هي "عائلة" بالإنجليزية؟',
      options: ['friend', 'teacher', 'family', 'student'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: '___, how are you? (Hello)',
      prompt_ar: '___، كيف حالك؟',
      answer: 'Hello'
    },
    {
      type: 'matching',
      prompt_en: 'Match the greetings',
      prompt_ar: 'طابق التحيات',
      pairs: [
        { en: 'goodbye', ar: 'مع السلامة' },
        { en: 'thank you', ar: 'شكراً' },
        { en: 'please', ar: 'من فضلك' },
        { en: 'how are you', ar: 'كيف حالك' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: you / meet / Nice / to',
      prompt_ar: 'رتب الكلمات',
      words: ['you', 'meet', 'Nice', 'to'],
      correctOrder: ['Nice', 'to', 'meet', 'you']
    },
    {
      type: 'mcq',
      prompt_en: 'What do you say when leaving?',
      prompt_ar: 'ماذا تقول عند المغادرة؟',
      options: ['hello', 'goodbye', 'thank you', 'please'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I am fine, ___ you. (thank)',
      prompt_ar: 'أنا بخير، ___ لك.',
      answer: 'thank'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "صديق" in English?',
      prompt_ar: 'ما هي "صديق" بالإنجليزية؟',
      options: ['family', 'friend', 'teacher', 'student'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "goodbye" in Arabic?',
      prompt_ar: 'ما هي "goodbye" بالعربية؟',
      options: ['مرحبا', 'شكراً', 'مع السلامة', 'من فضلك'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "معلم" in English?',
      prompt_ar: 'ما هي "معلم" بالإنجليزية؟',
      options: ['student', 'teacher', 'friend', 'family'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'This is my ___. (family)',
      prompt_ar: 'هذه ___.',
      answer: 'family'
    },
    {
      type: 'matching',
      prompt_en: 'Match the people',
      prompt_ar: 'طابق الأشخاص',
      pairs: [
        { en: 'friend', ar: 'صديق' },
        { en: 'teacher', ar: 'معلم' },
        { en: 'student', ar: 'طالب' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "من فضلك" in English?',
      prompt_ar: 'ما هي "من فضلك" بالإنجليزية؟',
      options: ['thank you', 'please', 'hello', 'goodbye'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: my / is / She / friend',
      prompt_ar: 'رتب الكلمات',
      words: ['my', 'is', 'She', 'friend'],
      correctOrder: ['She', 'is', 'my', 'friend']
    }
  ]
};

const unit10Lesson2: LessonContent = {
  id: 'A1-u10-l02',
  unitId: 'A1-u10',
  title_en: 'Daily Life Review',
  title_ar: 'مراجعة الحياة اليومية',
  vocabulary: [
    { en: 'wake up', ar: 'يستيقظ' },
    { en: 'eat', ar: 'يأكل' },
    { en: 'drink', ar: 'يشرب' },
    { en: 'work', ar: 'يعمل' },
    { en: 'study', ar: 'يدرس' },
    { en: 'sleep', ar: 'ينام' },
    { en: 'breakfast', ar: 'فطور' },
    { en: 'lunch', ar: 'غداء' },
    { en: 'dinner', ar: 'عشاء' },
    { en: 'time', ar: 'وقت' }
  ],
  sentences: [
    { en: 'I wake up at 6 AM.', ar: 'أستيقظ الساعة السادسة صباحاً.' },
    { en: 'I eat breakfast every day.', ar: 'آكل الفطور كل يوم.' },
    { en: 'I work from 9 to 5.', ar: 'أعمل من 9 إلى 5.' },
    { en: 'I study English at night.', ar: 'أدرس الإنجليزية ليلاً.' },
    { en: 'I drink coffee in the morning.', ar: 'أشرب القهوة في الصباح.' },
    { en: 'What time is it?', ar: 'كم الساعة؟' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "wake up" in Arabic?',
      prompt_ar: 'ما هي "wake up" بالعربية؟',
      options: ['ينام', 'يأكل', 'يستيقظ', 'يشرب'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "فطور" in English?',
      prompt_ar: 'ما هي "فطور" بالإنجليزية؟',
      options: ['lunch', 'dinner', 'breakfast', 'food'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'I ___ up at 6 AM. (wake)',
      prompt_ar: 'أ___ الساعة السادسة صباحاً.',
      answer: 'wake'
    },
    {
      type: 'matching',
      prompt_en: 'Match the daily activities',
      prompt_ar: 'طابق الأنشطة اليومية',
      pairs: [
        { en: 'eat', ar: 'يأكل' },
        { en: 'drink', ar: 'يشرب' },
        { en: 'work', ar: 'يعمل' },
        { en: 'study', ar: 'يدرس' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: day / breakfast / every / I / eat',
      prompt_ar: 'رتب الكلمات',
      words: ['day', 'breakfast', 'every', 'I', 'eat'],
      correctOrder: ['I', 'eat', 'breakfast', 'every', 'day']
    },
    {
      type: 'mcq',
      prompt_en: 'What meal do you eat in the evening?',
      prompt_ar: 'أي وجبة تأكل في المساء؟',
      options: ['breakfast', 'lunch', 'dinner', 'snack'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'I ___ from 9 to 5. (work)',
      prompt_ar: 'أ___ من 9 إلى 5.',
      answer: 'work'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "ينام" in English?',
      prompt_ar: 'ما هي "ينام" بالإنجليزية؟',
      options: ['wake up', 'sleep', 'eat', 'drink'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "eat" in Arabic?',
      prompt_ar: 'ما هي "eat" بالعربية؟',
      options: ['يشرب', 'يأكل', 'ينام', 'يعمل'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "غداء" in English?',
      prompt_ar: 'ما هي "غداء" بالإنجليزية؟',
      options: ['breakfast', 'lunch', 'dinner', 'time'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I ___ coffee in the morning. (drink)',
      prompt_ar: 'أ___ القهوة في الصباح.',
      answer: 'drink'
    },
    {
      type: 'matching',
      prompt_en: 'Match the meals',
      prompt_ar: 'طابق الوجبات',
      pairs: [
        { en: 'breakfast', ar: 'فطور' },
        { en: 'lunch', ar: 'غداء' },
        { en: 'dinner', ar: 'عشاء' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "وقت" in English?',
      prompt_ar: 'ما هي "وقت" بالإنجليزية؟',
      options: ['day', 'time', 'night', 'hour'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: night / at / English / study / I',
      prompt_ar: 'رتب الكلمات',
      words: ['night', 'at', 'English', 'study', 'I'],
      correctOrder: ['I', 'study', 'English', 'at', 'night']
    }
  ]
};

const unit10Lesson3: LessonContent = {
  id: 'A1-u10-l03',
  unitId: 'A1-u10',
  title_en: 'Places & Directions Review',
  title_ar: 'مراجعة الأماكن والاتجاهات',
  vocabulary: [
    { en: 'hospital', ar: 'مستشفى' },
    { en: 'school', ar: 'مدرسة' },
    { en: 'bank', ar: 'بنك' },
    { en: 'right', ar: 'يمين' },
    { en: 'left', ar: 'يسار' },
    { en: 'straight', ar: 'مستقيم' },
    { en: 'near', ar: 'قريب' },
    { en: 'far', ar: 'بعيد' },
    { en: 'where', ar: 'أين' },
    { en: 'street', ar: 'شارع' }
  ],
  sentences: [
    { en: 'Where is the hospital?', ar: 'أين المستشفى؟' },
    { en: 'Turn right at the corner.', ar: 'انعطف يميناً عند الزاوية.' },
    { en: 'Go straight ahead.', ar: 'امشِ مستقيماً.' },
    { en: 'The bank is near.', ar: 'البنك قريب.' },
    { en: 'The school is on this street.', ar: 'المدرسة في هذا الشارع.' },
    { en: 'It is not far from here.', ar: 'ليس بعيداً من هنا.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "hospital" in Arabic?',
      prompt_ar: 'ما هي "hospital" بالعربية؟',
      options: ['مدرسة', 'بنك', 'مستشفى', 'شارع'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يمين" in English?',
      prompt_ar: 'ما هي "يمين" بالإنجليزية؟',
      options: ['left', 'right', 'straight', 'near'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: '___ is the hospital? (Where)',
      prompt_ar: '___ المستشفى؟',
      answer: 'Where'
    },
    {
      type: 'matching',
      prompt_en: 'Match the directions',
      prompt_ar: 'طابق الاتجاهات',
      pairs: [
        { en: 'right', ar: 'يمين' },
        { en: 'left', ar: 'يسار' },
        { en: 'straight', ar: 'مستقيم' },
        { en: 'near', ar: 'قريب' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: corner / Turn / the / right / at',
      prompt_ar: 'رتب الكلمات',
      words: ['corner', 'Turn', 'the', 'right', 'at'],
      correctOrder: ['Turn', 'right', 'at', 'the', 'corner']
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
      prompt_en: 'Go ___ ahead. (straight)',
      prompt_ar: 'امشِ ___.',
      answer: 'straight'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "شارع" in English?',
      prompt_ar: 'ما هي "شارع" بالإنجليزية؟',
      options: ['school', 'bank', 'street', 'hospital'],
      correctIndex: 2
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "school" in Arabic?',
      prompt_ar: 'ما هي "school" بالعربية؟',
      options: ['مستشفى', 'مدرسة', 'بنك', 'شارع'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "بعيد" in English?',
      prompt_ar: 'ما هي "بعيد" بالإنجليزية؟',
      options: ['near', 'far', 'left', 'right'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'The bank is ___. (near)',
      prompt_ar: 'البنك ___.',
      answer: 'near'
    },
    {
      type: 'matching',
      prompt_en: 'Match the places',
      prompt_ar: 'طابق الأماكن',
      pairs: [
        { en: 'hospital', ar: 'مستشفى' },
        { en: 'school', ar: 'مدرسة' },
        { en: 'bank', ar: 'بنك' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "أين" in English?',
      prompt_ar: 'ما هي "أين" بالإنجليزية؟',
      options: ['what', 'where', 'when', 'how'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: street / is / The / this / school / on',
      prompt_ar: 'رتب الكلمات',
      words: ['street', 'is', 'The', 'this', 'school', 'on'],
      correctOrder: ['The', 'school', 'is', 'on', 'this', 'street']
    }
  ]
};

const unit10Lesson4: LessonContent = {
  id: 'A1-u10-l04',
  unitId: 'A1-u10',
  title_en: 'Hobbies & Shopping Review',
  title_ar: 'مراجعة الهوايات والتسوق',
  vocabulary: [
    { en: 'football', ar: 'كرة القدم' },
    { en: 'music', ar: 'موسيقى' },
    { en: 'read', ar: 'يقرأ' },
    { en: 'buy', ar: 'يشتري' },
    { en: 'price', ar: 'سعر' },
    { en: 'cheap', ar: 'رخيص' },
    { en: 'expensive', ar: 'غالي' },
    { en: 'store', ar: 'متجر' },
    { en: 'hobby', ar: 'هواية' },
    { en: 'like', ar: 'يحب' }
  ],
  sentences: [
    { en: 'I like playing football.', ar: 'أحب لعب كرة القدم.' },
    { en: 'Music is my hobby.', ar: 'الموسيقى هوايتي.' },
    { en: 'I read books every day.', ar: 'أقرأ الكتب كل يوم.' },
    { en: 'I want to buy a new phone.', ar: 'أريد شراء هاتف جديد.' },
    { en: 'What is the price?', ar: 'ما السعر؟' },
    { en: 'This store is expensive.', ar: 'هذا المتجر غالي.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "football" in Arabic?',
      prompt_ar: 'ما هي "football" بالعربية؟',
      options: ['موسيقى', 'كرة القدم', 'قراءة', 'تسوق'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يشتري" in English?',
      prompt_ar: 'ما هي "يشتري" بالإنجليزية؟',
      options: ['sell', 'buy', 'read', 'like'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I ___ playing football. (like)',
      prompt_ar: 'أ___ لعب كرة القدم.',
      answer: 'like'
    },
    {
      type: 'matching',
      prompt_en: 'Match the hobbies and shopping',
      prompt_ar: 'طابق الهوايات والتسوق',
      pairs: [
        { en: 'music', ar: 'موسيقى' },
        { en: 'read', ar: 'يقرأ' },
        { en: 'price', ar: 'سعر' },
        { en: 'store', ar: 'متجر' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: hobby / my / Music / is',
      prompt_ar: 'رتب الكلمات',
      words: ['hobby', 'my', 'Music', 'is'],
      correctOrder: ['Music', 'is', 'my', 'hobby']
    },
    {
      type: 'mcq',
      prompt_en: 'What is the opposite of "cheap"?',
      prompt_ar: 'ما عكس "رخيص"؟',
      options: ['expensive', 'new', 'old', 'good'],
      correctIndex: 0
    },
    {
      type: 'fill_blank',
      prompt_en: 'I ___ books every day. (read)',
      prompt_ar: 'أ___ الكتب كل يوم.',
      answer: 'read'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "هواية" in English?',
      prompt_ar: 'ما هي "هواية" بالإنجليزية؟',
      options: ['music', 'hobby', 'sport', 'game'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "music" in Arabic?',
      prompt_ar: 'ما هي "music" بالعربية؟',
      options: ['كرة القدم', 'موسيقى', 'قراءة', 'هواية'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "غالي" in English?',
      prompt_ar: 'ما هي "غالي" بالإنجليزية؟',
      options: ['cheap', 'expensive', 'new', 'good'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'What is the ___? (price)',
      prompt_ar: 'ما ال___؟',
      answer: 'price'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'hobby', ar: 'هواية' },
        { en: 'like', ar: 'يحب' },
        { en: 'buy', ar: 'يشتري' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "متجر" in English?',
      prompt_ar: 'ما هي "متجر" بالإنجليزية؟',
      options: ['market', 'store', 'mall', 'shop'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: phone / buy / new / want / I / to / a',
      prompt_ar: 'رتب الكلمات',
      words: ['phone', 'buy', 'new', 'want', 'I', 'to', 'a'],
      correctOrder: ['I', 'want', 'to', 'buy', 'a', 'new', 'phone']
    }
  ]
};

const unit10Lesson5: LessonContent = {
  id: 'A1-u10-l05',
  unitId: 'A1-u10',
  title_en: 'Final A1 Review',
  title_ar: 'المراجعة النهائية A1',
  vocabulary: [
    { en: 'name', ar: 'اسم' },
    { en: 'country', ar: 'بلد' },
    { en: 'language', ar: 'لغة' },
    { en: 'learn', ar: 'يتعلم' },
    { en: 'speak', ar: 'يتكلم' },
    { en: 'understand', ar: 'يفهم' },
    { en: 'English', ar: 'الإنجليزية' },
    { en: 'Arabic', ar: 'العربية' },
    { en: 'good', ar: 'جيد' },
    { en: 'congratulations', ar: 'مبروك' }
  ],
  sentences: [
    { en: 'What is your name?', ar: 'ما اسمك؟' },
    { en: 'I am learning English.', ar: 'أنا أتعلم الإنجليزية.' },
    { en: 'I can speak Arabic.', ar: 'أستطيع تكلم العربية.' },
    { en: 'I understand a little.', ar: 'أفهم قليلاً.' },
    { en: 'You are very good!', ar: 'أنت جيد جداً!' },
    { en: 'Congratulations on completing A1!', ar: 'مبروك على إكمال A1!' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "name" in Arabic?',
      prompt_ar: 'ما هي "name" بالعربية؟',
      options: ['بلد', 'لغة', 'اسم', 'عمل'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يتعلم" in English?',
      prompt_ar: 'ما هي "يتعلم" بالإنجليزية؟',
      options: ['speak', 'understand', 'learn', 'read'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'What is your ___? (name)',
      prompt_ar: 'ما ___؟',
      answer: 'name'
    },
    {
      type: 'matching',
      prompt_en: 'Match the language words',
      prompt_ar: 'طابق كلمات اللغة',
      pairs: [
        { en: 'speak', ar: 'يتكلم' },
        { en: 'understand', ar: 'يفهم' },
        { en: 'English', ar: 'الإنجليزية' },
        { en: 'Arabic', ar: 'العربية' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: learning / am / English / I',
      prompt_ar: 'رتب الكلمات',
      words: ['learning', 'am', 'English', 'I'],
      correctOrder: ['I', 'am', 'learning', 'English']
    },
    {
      type: 'mcq',
      prompt_en: 'What do you say to celebrate success?',
      prompt_ar: 'ماذا تقول للاحتفال بالنجاح؟',
      options: ['goodbye', 'hello', 'congratulations', 'sorry'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'I can ___ Arabic. (speak)',
      prompt_ar: 'أستطيع ___ العربية.',
      answer: 'speak'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "جيد" in English?',
      prompt_ar: 'ما هي "جيد" بالإنجليزية؟',
      options: ['bad', 'good', 'nice', 'great'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "country" in Arabic?',
      prompt_ar: 'ما هي "country" بالعربية؟',
      options: ['لغة', 'اسم', 'بلد', 'مدينة'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يفهم" in English?',
      prompt_ar: 'ما هي "يفهم" بالإنجليزية؟',
      options: ['speak', 'understand', 'learn', 'read'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I ___ a little. (understand)',
      prompt_ar: 'أ___ قليلاً.',
      answer: 'understand'
    },
    {
      type: 'matching',
      prompt_en: 'Match the final review words',
      prompt_ar: 'طابق كلمات المراجعة النهائية',
      pairs: [
        { en: 'language', ar: 'لغة' },
        { en: 'learn', ar: 'يتعلم' },
        { en: 'good', ar: 'جيد' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مبروك" in English?',
      prompt_ar: 'ما هي "مبروك" بالإنجليزية؟',
      options: ['thank you', 'congratulations', 'welcome', 'goodbye'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: A1 / on / Congratulations / completing',
      prompt_ar: 'رتب الكلمات',
      words: ['A1', 'on', 'Congratulations', 'completing'],
      correctOrder: ['Congratulations', 'on', 'completing', 'A1']
    }
  ]
};

export const a1Unit10Lessons: Record<string, LessonContent> = {
  'A1-u10-l01': unit10Lesson1,
  'A1-u10-l02': unit10Lesson2,
  'A1-u10-l03': unit10Lesson3,
  'A1-u10-l04': unit10Lesson4,
  'A1-u10-l05': unit10Lesson5,
};
