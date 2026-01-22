// A1 Unit 8: Hobbies - الهوايات
import { LessonContent } from './a1-lessons';

const unit8Lesson1: LessonContent = {
  id: 'A1-u08-l01',
  unitId: 'A1-u08',
  title_en: 'Sports',
  title_ar: 'الرياضة',
  vocabulary: [
    { en: 'football', ar: 'كرة القدم' },
    { en: 'basketball', ar: 'كرة السلة' },
    { en: 'swimming', ar: 'سباحة' },
    { en: 'running', ar: 'جري' },
    { en: 'tennis', ar: 'تنس' },
    { en: 'gym', ar: 'صالة رياضية' },
    { en: 'exercise', ar: 'تمرين' },
    { en: 'team', ar: 'فريق' },
    { en: 'match', ar: 'مباراة' },
    { en: 'win', ar: 'يفوز' }
  ],
  sentences: [
    { en: 'I play football every week.', ar: 'ألعب كرة القدم كل أسبوع.' },
    { en: 'Swimming is my favorite sport.', ar: 'السباحة رياضتي المفضلة.' },
    { en: 'I go to the gym in the morning.', ar: 'أذهب إلى الصالة الرياضية في الصباح.' },
    { en: 'Our team won the match.', ar: 'فريقنا فاز بالمباراة.' },
    { en: 'I like running in the park.', ar: 'أحب الجري في الحديقة.' },
    { en: 'Exercise is good for health.', ar: 'التمرين مفيد للصحة.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "football" in Arabic?',
      prompt_ar: 'ما هي "football" بالعربية؟',
      options: ['كرة السلة', 'كرة القدم', 'تنس', 'سباحة'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "سباحة" in English?',
      prompt_ar: 'ما هي "سباحة" بالإنجليزية؟',
      options: ['running', 'swimming', 'football', 'tennis'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I play ___ every week. (football)',
      prompt_ar: 'ألعب ___ كل أسبوع.',
      answer: 'football'
    },
    {
      type: 'matching',
      prompt_en: 'Match the sports',
      prompt_ar: 'طابق الرياضات',
      pairs: [
        { en: 'basketball', ar: 'كرة السلة' },
        { en: 'running', ar: 'جري' },
        { en: 'tennis', ar: 'تنس' },
        { en: 'gym', ar: 'صالة رياضية' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: sport / favorite / is / Swimming / my',
      prompt_ar: 'رتب الكلمات',
      words: ['sport', 'favorite', 'is', 'Swimming', 'my'],
      correctOrder: ['Swimming', 'is', 'my', 'favorite', 'sport']
    },
    {
      type: 'mcq',
      prompt_en: 'Where do you exercise indoors?',
      prompt_ar: 'أين تمارس الرياضة داخلياً؟',
      options: ['park', 'street', 'gym', 'school'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'Our ___ won the match. (team)',
      prompt_ar: '___ فاز بالمباراة.',
      answer: 'team'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مباراة" in English?',
      prompt_ar: 'ما هي "مباراة" بالإنجليزية؟',
      options: ['team', 'match', 'win', 'sport'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "basketball" in Arabic?',
      prompt_ar: 'ما هي "basketball" بالعربية؟',
      options: ['كرة القدم', 'كرة السلة', 'تنس', 'جري'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "تمرين" in English?',
      prompt_ar: 'ما هي "تمرين" بالإنجليزية؟',
      options: ['match', 'team', 'exercise', 'win'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'I go to the ___ in the morning. (gym)',
      prompt_ar: 'أذهب إلى ال___ في الصباح.',
      answer: 'gym'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'team', ar: 'فريق' },
        { en: 'match', ar: 'مباراة' },
        { en: 'win', ar: 'يفوز' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يفوز" in English?',
      prompt_ar: 'ما هي "يفوز" بالإنجليزية؟',
      options: ['lose', 'win', 'play', 'run'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: is / Exercise / health / for / good',
      prompt_ar: 'رتب الكلمات',
      words: ['is', 'Exercise', 'health', 'for', 'good'],
      correctOrder: ['Exercise', 'is', 'good', 'for', 'health']
    }
  ]
};

const unit8Lesson2: LessonContent = {
  id: 'A1-u08-l02',
  unitId: 'A1-u08',
  title_en: 'Music and Art',
  title_ar: 'الموسيقى والفن',
  vocabulary: [
    { en: 'music', ar: 'موسيقى' },
    { en: 'song', ar: 'أغنية' },
    { en: 'sing', ar: 'يغني' },
    { en: 'dance', ar: 'يرقص' },
    { en: 'play guitar', ar: 'يعزف الجيتار' },
    { en: 'piano', ar: 'بيانو' },
    { en: 'draw', ar: 'يرسم' },
    { en: 'paint', ar: 'يلون' },
    { en: 'art', ar: 'فن' },
    { en: 'concert', ar: 'حفلة موسيقية' }
  ],
  sentences: [
    { en: 'I love listening to music.', ar: 'أحب الاستماع للموسيقى.' },
    { en: 'She sings beautiful songs.', ar: 'هي تغني أغاني جميلة.' },
    { en: 'I play the piano.', ar: 'أعزف البيانو.' },
    { en: 'He likes to draw and paint.', ar: 'هو يحب أن يرسم ويلون.' },
    { en: 'We went to a concert last night.', ar: 'ذهبنا لحفلة موسيقية الليلة الماضية.' },
    { en: 'Art is my favorite hobby.', ar: 'الفن هوايتي المفضلة.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "music" in Arabic?',
      prompt_ar: 'ما هي "music" بالعربية؟',
      options: ['أغنية', 'موسيقى', 'فن', 'رقص'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يغني" in English?',
      prompt_ar: 'ما هي "يغني" بالإنجليزية؟',
      options: ['dance', 'play', 'sing', 'draw'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'I love listening to ___. (music)',
      prompt_ar: 'أحب الاستماع لل___.',
      answer: 'music'
    },
    {
      type: 'matching',
      prompt_en: 'Match the music words',
      prompt_ar: 'طابق كلمات الموسيقى',
      pairs: [
        { en: 'song', ar: 'أغنية' },
        { en: 'dance', ar: 'يرقص' },
        { en: 'piano', ar: 'بيانو' },
        { en: 'concert', ar: 'حفلة موسيقية' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: the / I / piano / play',
      prompt_ar: 'رتب الكلمات',
      words: ['the', 'I', 'piano', 'play'],
      correctOrder: ['I', 'play', 'the', 'piano']
    },
    {
      type: 'mcq',
      prompt_en: 'What do you do with a brush and colors?',
      prompt_ar: 'ماذا تفعل بالفرشاة والألوان؟',
      options: ['sing', 'dance', 'paint', 'play'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'She ___ beautiful songs. (sings)',
      prompt_ar: 'هي ___ أغاني جميلة.',
      answer: 'sings'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "فن" in English?',
      prompt_ar: 'ما هي "فن" بالإنجليزية؟',
      options: ['music', 'art', 'dance', 'song'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "song" in Arabic?',
      prompt_ar: 'ما هي "song" بالعربية؟',
      options: ['موسيقى', 'أغنية', 'رقص', 'فن'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يرسم" in English?',
      prompt_ar: 'ما هي "يرسم" بالإنجليزية؟',
      options: ['paint', 'draw', 'sing', 'dance'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: '___ is my favorite hobby. (Art)',
      prompt_ar: 'ال___ هوايتي المفضلة.',
      answer: 'Art'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'draw', ar: 'يرسم' },
        { en: 'paint', ar: 'يلون' },
        { en: 'play guitar', ar: 'يعزف الجيتار' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "حفلة موسيقية" in English?',
      prompt_ar: 'ما هي "حفلة موسيقية" بالإنجليزية؟',
      options: ['song', 'dance', 'concert', 'music'],
      correctIndex: 2
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: and / He / to / likes / paint / draw',
      prompt_ar: 'رتب الكلمات',
      words: ['and', 'He', 'to', 'likes', 'paint', 'draw'],
      correctOrder: ['He', 'likes', 'to', 'draw', 'and', 'paint']
    }
  ]
};

const unit8Lesson3: LessonContent = {
  id: 'A1-u08-l03',
  unitId: 'A1-u08',
  title_en: 'Reading and Writing',
  title_ar: 'القراءة والكتابة',
  vocabulary: [
    { en: 'read', ar: 'يقرأ' },
    { en: 'write', ar: 'يكتب' },
    { en: 'book', ar: 'كتاب' },
    { en: 'novel', ar: 'رواية' },
    { en: 'story', ar: 'قصة' },
    { en: 'poem', ar: 'قصيدة' },
    { en: 'magazine', ar: 'مجلة' },
    { en: 'newspaper', ar: 'جريدة' },
    { en: 'author', ar: 'مؤلف' },
    { en: 'library', ar: 'مكتبة' }
  ],
  sentences: [
    { en: 'I read books every day.', ar: 'أقرأ الكتب كل يوم.' },
    { en: 'She writes stories for children.', ar: 'هي تكتب قصصاً للأطفال.' },
    { en: 'I love reading novels.', ar: 'أحب قراءة الروايات.' },
    { en: 'The library has many books.', ar: 'المكتبة فيها كتب كثيرة.' },
    { en: 'He is a famous author.', ar: 'هو مؤلف مشهور.' },
    { en: 'I read the newspaper every morning.', ar: 'أقرأ الجريدة كل صباح.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "read" in Arabic?',
      prompt_ar: 'ما هي "read" بالعربية؟',
      options: ['يكتب', 'يقرأ', 'يرسم', 'يشاهد'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "كتاب" in English?',
      prompt_ar: 'ما هي "كتاب" بالإنجليزية؟',
      options: ['magazine', 'newspaper', 'book', 'story'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'I ___ books every day. (read)',
      prompt_ar: 'أ___ الكتب كل يوم.',
      answer: 'read'
    },
    {
      type: 'matching',
      prompt_en: 'Match the reading words',
      prompt_ar: 'طابق كلمات القراءة',
      pairs: [
        { en: 'novel', ar: 'رواية' },
        { en: 'story', ar: 'قصة' },
        { en: 'poem', ar: 'قصيدة' },
        { en: 'author', ar: 'مؤلف' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: novels / I / reading / love',
      prompt_ar: 'رتب الكلمات',
      words: ['novels', 'I', 'reading', 'love'],
      correctOrder: ['I', 'love', 'reading', 'novels']
    },
    {
      type: 'mcq',
      prompt_en: 'Where do you borrow books?',
      prompt_ar: 'من أين تستعير الكتب؟',
      options: ['school', 'library', 'gym', 'park'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'The ___ has many books. (library)',
      prompt_ar: 'ال___ فيها كتب كثيرة.',
      answer: 'library'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "جريدة" in English?',
      prompt_ar: 'ما هي "جريدة" بالإنجليزية؟',
      options: ['magazine', 'newspaper', 'book', 'novel'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "write" in Arabic?',
      prompt_ar: 'ما هي "write" بالعربية؟',
      options: ['يقرأ', 'يكتب', 'يرسم', 'يلعب'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "قصة" in English?',
      prompt_ar: 'ما هي "قصة" بالإنجليزية؟',
      options: ['poem', 'novel', 'story', 'book'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'She ___ stories for children. (writes)',
      prompt_ar: 'هي ___ قصصاً للأطفال.',
      answer: 'writes'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'magazine', ar: 'مجلة' },
        { en: 'newspaper', ar: 'جريدة' },
        { en: 'library', ar: 'مكتبة' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مؤلف" in English?',
      prompt_ar: 'ما هي "مؤلف" بالإنجليزية؟',
      options: ['reader', 'writer', 'author', 'student'],
      correctIndex: 2
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: morning / the / read / I / newspaper / every',
      prompt_ar: 'رتب الكلمات',
      words: ['morning', 'the', 'read', 'I', 'newspaper', 'every'],
      correctOrder: ['I', 'read', 'the', 'newspaper', 'every', 'morning']
    }
  ]
};

const unit8Lesson4: LessonContent = {
  id: 'A1-u08-l04',
  unitId: 'A1-u08',
  title_en: 'Games and Technology',
  title_ar: 'الألعاب والتكنولوجيا',
  vocabulary: [
    { en: 'video games', ar: 'ألعاب الفيديو' },
    { en: 'computer', ar: 'حاسوب' },
    { en: 'phone', ar: 'هاتف' },
    { en: 'internet', ar: 'إنترنت' },
    { en: 'app', ar: 'تطبيق' },
    { en: 'social media', ar: 'وسائل التواصل' },
    { en: 'watch videos', ar: 'يشاهد فيديوهات' },
    { en: 'play online', ar: 'يلعب أونلاين' },
    { en: 'download', ar: 'يحمّل' },
    { en: 'screen', ar: 'شاشة' }
  ],
  sentences: [
    { en: 'I play video games on weekends.', ar: 'ألعب ألعاب الفيديو في نهاية الأسبوع.' },
    { en: 'I use my computer for work.', ar: 'أستخدم حاسوبي للعمل.' },
    { en: 'I watch videos on my phone.', ar: 'أشاهد فيديوهات على هاتفي.' },
    { en: 'I downloaded a new app.', ar: 'حمّلت تطبيقاً جديداً.' },
    { en: 'I check social media every day.', ar: 'أتفقد وسائل التواصل كل يوم.' },
    { en: 'I need internet to play online.', ar: 'أحتاج إنترنت لألعب أونلاين.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "video games" in Arabic?',
      prompt_ar: 'ما هي "video games" بالعربية؟',
      options: ['حاسوب', 'هاتف', 'ألعاب الفيديو', 'تطبيق'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "حاسوب" in English?',
      prompt_ar: 'ما هي "حاسوب" بالإنجليزية؟',
      options: ['phone', 'computer', 'screen', 'app'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I play video ___ on weekends. (games)',
      prompt_ar: 'ألعب ___ الفيديو في نهاية الأسبوع.',
      answer: 'games'
    },
    {
      type: 'matching',
      prompt_en: 'Match the technology words',
      prompt_ar: 'طابق كلمات التكنولوجيا',
      pairs: [
        { en: 'phone', ar: 'هاتف' },
        { en: 'internet', ar: 'إنترنت' },
        { en: 'app', ar: 'تطبيق' },
        { en: 'screen', ar: 'شاشة' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: phone / my / on / videos / watch / I',
      prompt_ar: 'رتب الكلمات',
      words: ['phone', 'my', 'on', 'videos', 'watch', 'I'],
      correctOrder: ['I', 'watch', 'videos', 'on', 'my', 'phone']
    },
    {
      type: 'mcq',
      prompt_en: 'What do you need to play online?',
      prompt_ar: 'ماذا تحتاج لتلعب أونلاين؟',
      options: ['book', 'internet', 'pen', 'food'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I ___ a new app. (downloaded)',
      prompt_ar: '___ تطبيقاً جديداً.',
      answer: 'downloaded'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "وسائل التواصل" in English?',
      prompt_ar: 'ما هي "وسائل التواصل" بالإنجليزية؟',
      options: ['internet', 'social media', 'video games', 'app'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "computer" in Arabic?',
      prompt_ar: 'ما هي "computer" بالعربية؟',
      options: ['هاتف', 'تلفاز', 'حاسوب', 'شاشة'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يحمّل" in English?',
      prompt_ar: 'ما هي "يحمّل" بالإنجليزية؟',
      options: ['upload', 'download', 'watch', 'play'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I use my ___ for work. (computer)',
      prompt_ar: 'أستخدم ___ للعمل.',
      answer: 'computer'
    },
    {
      type: 'matching',
      prompt_en: 'Match the phrases',
      prompt_ar: 'طابق العبارات',
      pairs: [
        { en: 'watch videos', ar: 'يشاهد فيديوهات' },
        { en: 'play online', ar: 'يلعب أونلاين' },
        { en: 'social media', ar: 'وسائل التواصل' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "شاشة" in English?',
      prompt_ar: 'ما هي "شاشة" بالإنجليزية؟',
      options: ['phone', 'computer', 'screen', 'app'],
      correctIndex: 2
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: day / social / check / I / media / every',
      prompt_ar: 'رتب الكلمات',
      words: ['day', 'social', 'check', 'I', 'media', 'every'],
      correctOrder: ['I', 'check', 'social', 'media', 'every', 'day']
    }
  ]
};

const unit8Lesson5: LessonContent = {
  id: 'A1-u08-l05',
  unitId: 'A1-u08',
  title_en: 'Outdoor Activities',
  title_ar: 'الأنشطة الخارجية',
  vocabulary: [
    { en: 'hiking', ar: 'تسلق الجبال' },
    { en: 'camping', ar: 'تخييم' },
    { en: 'fishing', ar: 'صيد السمك' },
    { en: 'picnic', ar: 'نزهة' },
    { en: 'beach', ar: 'شاطئ' },
    { en: 'garden', ar: 'حديقة' },
    { en: 'nature', ar: 'طبيعة' },
    { en: 'fresh air', ar: 'هواء نقي' },
    { en: 'sunset', ar: 'غروب الشمس' },
    { en: 'adventure', ar: 'مغامرة' }
  ],
  sentences: [
    { en: 'I like hiking in the mountains.', ar: 'أحب تسلق الجبال.' },
    { en: 'We go camping in summer.', ar: 'نذهب للتخييم في الصيف.' },
    { en: 'I love going to the beach.', ar: 'أحب الذهاب للشاطئ.' },
    { en: 'We had a picnic in the garden.', ar: 'أقمنا نزهة في الحديقة.' },
    { en: 'I enjoy the fresh air.', ar: 'أستمتع بالهواء النقي.' },
    { en: 'The sunset is beautiful.', ar: 'غروب الشمس جميل.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "hiking" in Arabic?',
      prompt_ar: 'ما هي "hiking" بالعربية؟',
      options: ['سباحة', 'تسلق الجبال', 'تخييم', 'صيد'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "شاطئ" in English?',
      prompt_ar: 'ما هي "شاطئ" بالإنجليزية؟',
      options: ['mountain', 'garden', 'beach', 'forest'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'I like ___ in the mountains. (hiking)',
      prompt_ar: 'أحب ___ في الجبال.',
      answer: 'hiking'
    },
    {
      type: 'matching',
      prompt_en: 'Match the outdoor activities',
      prompt_ar: 'طابق الأنشطة الخارجية',
      pairs: [
        { en: 'camping', ar: 'تخييم' },
        { en: 'fishing', ar: 'صيد السمك' },
        { en: 'picnic', ar: 'نزهة' },
        { en: 'nature', ar: 'طبيعة' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: beach / I / to / love / going / the',
      prompt_ar: 'رتب الكلمات',
      words: ['beach', 'I', 'to', 'love', 'going', 'the'],
      correctOrder: ['I', 'love', 'going', 'to', 'the', 'beach']
    },
    {
      type: 'mcq',
      prompt_en: 'What happens at the end of the day?',
      prompt_ar: 'ماذا يحدث في نهاية اليوم؟',
      options: ['sunrise', 'sunset', 'noon', 'midnight'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I enjoy the fresh ___. (air)',
      prompt_ar: 'أستمتع بالهواء ال___.',
      answer: 'air'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مغامرة" in English?',
      prompt_ar: 'ما هي "مغامرة" بالإنجليزية؟',
      options: ['picnic', 'adventure', 'nature', 'garden'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "camping" in Arabic?',
      prompt_ar: 'ما هي "camping" بالعربية؟',
      options: ['تسلق', 'تخييم', 'صيد', 'سباحة'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "طبيعة" in English?',
      prompt_ar: 'ما هي "طبيعة" بالإنجليزية؟',
      options: ['adventure', 'beach', 'nature', 'garden'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'We go ___ in summer. (camping)',
      prompt_ar: 'نذهب لل___ في الصيف.',
      answer: 'camping'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'sunset', ar: 'غروب الشمس' },
        { en: 'fresh air', ar: 'هواء نقي' },
        { en: 'garden', ar: 'حديقة' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "غروب الشمس" in English?',
      prompt_ar: 'ما هي "غروب الشمس" بالإنجليزية؟',
      options: ['sunrise', 'sunset', 'noon', 'night'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: garden / the / had / We / picnic / in / a',
      prompt_ar: 'رتب الكلمات',
      words: ['garden', 'the', 'had', 'We', 'picnic', 'in', 'a'],
      correctOrder: ['We', 'had', 'a', 'picnic', 'in', 'the', 'garden']
    }
  ]
};

export const a1Unit8Lessons: Record<string, LessonContent> = {
  'A1-u08-l01': unit8Lesson1,
  'A1-u08-l02': unit8Lesson2,
  'A1-u08-l03': unit8Lesson3,
  'A1-u08-l04': unit8Lesson4,
  'A1-u08-l05': unit8Lesson5,
};
