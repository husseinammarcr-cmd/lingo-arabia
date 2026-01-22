// A1 Unit 7: Daily Routine - الروتين اليومي
import { LessonContent } from './a1-lessons';

const unit7Lesson1: LessonContent = {
  id: 'A1-u07-l01',
  unitId: 'A1-u07',
  title_en: 'Morning Routine',
  title_ar: 'روتين الصباح',
  vocabulary: [
    { en: 'wake up', ar: 'يستيقظ' },
    { en: 'get up', ar: 'ينهض' },
    { en: 'brush teeth', ar: 'يغسل أسنانه' },
    { en: 'take a shower', ar: 'يستحم' },
    { en: 'get dressed', ar: 'يرتدي ملابسه' },
    { en: 'have breakfast', ar: 'يتناول الفطور' },
    { en: 'morning', ar: 'صباح' },
    { en: 'early', ar: 'مبكر' },
    { en: 'late', ar: 'متأخر' },
    { en: 'alarm', ar: 'منبه' }
  ],
  sentences: [
    { en: 'I wake up at 6 AM.', ar: 'أستيقظ الساعة السادسة صباحاً.' },
    { en: 'I brush my teeth every morning.', ar: 'أغسل أسناني كل صباح.' },
    { en: 'I take a shower before breakfast.', ar: 'أستحم قبل الفطور.' },
    { en: 'I get dressed quickly.', ar: 'أرتدي ملابسي بسرعة.' },
    { en: 'I have breakfast with my family.', ar: 'أتناول الفطور مع عائلتي.' },
    { en: 'The alarm rings at 5:30.', ar: 'المنبه يرن الساعة 5:30.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "wake up" in Arabic?',
      prompt_ar: 'ما هي "wake up" بالعربية؟',
      options: ['ينام', 'يستيقظ', 'يأكل', 'يشرب'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يغسل أسنانه" in English?',
      prompt_ar: 'ما هي "يغسل أسنانه" بالإنجليزية؟',
      options: ['take a shower', 'get dressed', 'brush teeth', 'wake up'],
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
      prompt_en: 'Match the morning activities',
      prompt_ar: 'طابق أنشطة الصباح',
      pairs: [
        { en: 'take a shower', ar: 'يستحم' },
        { en: 'get dressed', ar: 'يرتدي ملابسه' },
        { en: 'have breakfast', ar: 'يتناول الفطور' },
        { en: 'alarm', ar: 'منبه' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: teeth / I / my / brush / morning / every',
      prompt_ar: 'رتب الكلمات',
      words: ['teeth', 'I', 'my', 'brush', 'morning', 'every'],
      correctOrder: ['I', 'brush', 'my', 'teeth', 'every', 'morning']
    },
    {
      type: 'mcq',
      prompt_en: 'What do you do first in the morning?',
      prompt_ar: 'ماذا تفعل أولاً في الصباح؟',
      options: ['have dinner', 'go to sleep', 'wake up', 'watch TV'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'I take a ___ before breakfast. (shower)',
      prompt_ar: 'أ___ قبل الفطور.',
      answer: 'shower'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مبكر" in English?',
      prompt_ar: 'ما هي "مبكر" بالإنجليزية؟',
      options: ['late', 'early', 'morning', 'night'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "morning" in Arabic?',
      prompt_ar: 'ما هي "morning" بالعربية؟',
      options: ['مساء', 'ليل', 'صباح', 'ظهر'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يستحم" in English?',
      prompt_ar: 'ما هي "يستحم" بالإنجليزية؟',
      options: ['brush teeth', 'take a shower', 'get dressed', 'wake up'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I get ___ quickly. (dressed)',
      prompt_ar: 'أرتدي ___ بسرعة.',
      answer: 'dressed'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'early', ar: 'مبكر' },
        { en: 'late', ar: 'متأخر' },
        { en: 'get up', ar: 'ينهض' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "منبه" in English?',
      prompt_ar: 'ما هي "منبه" بالإنجليزية؟',
      options: ['clock', 'alarm', 'bell', 'phone'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: with / breakfast / I / family / have / my',
      prompt_ar: 'رتب الكلمات',
      words: ['with', 'breakfast', 'I', 'family', 'have', 'my'],
      correctOrder: ['I', 'have', 'breakfast', 'with', 'my', 'family']
    }
  ]
};

const unit7Lesson2: LessonContent = {
  id: 'A1-u07-l02',
  unitId: 'A1-u07',
  title_en: 'Going to Work or School',
  title_ar: 'الذهاب للعمل أو المدرسة',
  vocabulary: [
    { en: 'leave home', ar: 'يغادر المنزل' },
    { en: 'arrive', ar: 'يصل' },
    { en: 'commute', ar: 'تنقل' },
    { en: 'traffic jam', ar: 'ازدحام مروري' },
    { en: 'on time', ar: 'في الوقت' },
    { en: 'rush hour', ar: 'ساعة الذروة' },
    { en: 'catch the bus', ar: 'يلحق الحافلة' },
    { en: 'miss the bus', ar: 'يفوته الحافلة' },
    { en: 'lunch break', ar: 'استراحة الغداء' },
    { en: 'meeting', ar: 'اجتماع' }
  ],
  sentences: [
    { en: 'I leave home at 7:30.', ar: 'أغادر المنزل الساعة 7:30.' },
    { en: 'I arrive at work at 8 AM.', ar: 'أصل إلى العمل الساعة الثامنة.' },
    { en: 'There is a traffic jam every morning.', ar: 'هناك ازدحام مروري كل صباح.' },
    { en: 'I try to be on time.', ar: 'أحاول أن أكون في الوقت.' },
    { en: 'I have a meeting at 10.', ar: 'لدي اجتماع الساعة العاشرة.' },
    { en: 'Lunch break is at 12:30.', ar: 'استراحة الغداء الساعة 12:30.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "leave home" in Arabic?',
      prompt_ar: 'ما هي "leave home" بالعربية؟',
      options: ['يصل', 'يغادر المنزل', 'ينام', 'يأكل'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يصل" in English?',
      prompt_ar: 'ما هي "يصل" بالإنجليزية؟',
      options: ['leave', 'arrive', 'go', 'come'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I ___ home at 7:30. (leave)',
      prompt_ar: 'أ___ المنزل الساعة 7:30.',
      answer: 'leave'
    },
    {
      type: 'matching',
      prompt_en: 'Match the phrases',
      prompt_ar: 'طابق العبارات',
      pairs: [
        { en: 'traffic jam', ar: 'ازدحام مروري' },
        { en: 'on time', ar: 'في الوقت' },
        { en: 'rush hour', ar: 'ساعة الذروة' },
        { en: 'meeting', ar: 'اجتماع' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: at / arrive / I / work / 8 AM / at',
      prompt_ar: 'رتب الكلمات',
      words: ['at', 'arrive', 'I', 'work', '8 AM', 'at'],
      correctOrder: ['I', 'arrive', 'at', 'work', 'at', '8 AM']
    },
    {
      type: 'mcq',
      prompt_en: 'What happens when there is heavy traffic?',
      prompt_ar: 'ماذا يحدث عندما يكون المرور كثيفاً؟',
      options: ['traffic jam', 'lunch break', 'meeting', 'on time'],
      correctIndex: 0
    },
    {
      type: 'fill_blank',
      prompt_en: 'I try to be on ___. (time)',
      prompt_ar: 'أحاول أن أكون في ال___.',
      answer: 'time'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "استراحة الغداء" in English?',
      prompt_ar: 'ما هي "استراحة الغداء" بالإنجليزية؟',
      options: ['breakfast time', 'lunch break', 'dinner time', 'rush hour'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "arrive" in Arabic?',
      prompt_ar: 'ما هي "arrive" بالعربية؟',
      options: ['يغادر', 'يصل', 'يذهب', 'يرجع'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "ازدحام مروري" in English?',
      prompt_ar: 'ما هي "ازدحام مروري" بالإنجليزية؟',
      options: ['rush hour', 'traffic jam', 'on time', 'commute'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I have a ___ at 10. (meeting)',
      prompt_ar: 'لدي ___ الساعة العاشرة.',
      answer: 'meeting'
    },
    {
      type: 'matching',
      prompt_en: 'Match the phrases',
      prompt_ar: 'طابق العبارات',
      pairs: [
        { en: 'catch the bus', ar: 'يلحق الحافلة' },
        { en: 'miss the bus', ar: 'يفوته الحافلة' },
        { en: 'commute', ar: 'تنقل' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "ساعة الذروة" in English?',
      prompt_ar: 'ما هي "ساعة الذروة" بالإنجليزية؟',
      options: ['lunch break', 'traffic jam', 'rush hour', 'meeting'],
      correctIndex: 2
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: morning / every / jam / is / There / traffic / a',
      prompt_ar: 'رتب الكلمات',
      words: ['morning', 'every', 'jam', 'is', 'There', 'traffic', 'a'],
      correctOrder: ['There', 'is', 'a', 'traffic', 'jam', 'every', 'morning']
    }
  ]
};

const unit7Lesson3: LessonContent = {
  id: 'A1-u07-l03',
  unitId: 'A1-u07',
  title_en: 'Evening Routine',
  title_ar: 'روتين المساء',
  vocabulary: [
    { en: 'come home', ar: 'يعود للمنزل' },
    { en: 'rest', ar: 'يرتاح' },
    { en: 'have dinner', ar: 'يتناول العشاء' },
    { en: 'watch TV', ar: 'يشاهد التلفاز' },
    { en: 'read a book', ar: 'يقرأ كتاباً' },
    { en: 'spend time', ar: 'يقضي وقتاً' },
    { en: 'evening', ar: 'مساء' },
    { en: 'tired', ar: 'متعب' },
    { en: 'relax', ar: 'يسترخي' },
    { en: 'homework', ar: 'واجب منزلي' }
  ],
  sentences: [
    { en: 'I come home at 5 PM.', ar: 'أعود للمنزل الساعة الخامسة مساءً.' },
    { en: 'I rest for an hour.', ar: 'أرتاح لمدة ساعة.' },
    { en: 'We have dinner at 7 PM.', ar: 'نتناول العشاء الساعة السابعة.' },
    { en: 'I watch TV with my family.', ar: 'أشاهد التلفاز مع عائلتي.' },
    { en: 'I do my homework before dinner.', ar: 'أعمل واجبي المنزلي قبل العشاء.' },
    { en: 'I am tired after work.', ar: 'أنا متعب بعد العمل.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "come home" in Arabic?',
      prompt_ar: 'ما هي "come home" بالعربية؟',
      options: ['يذهب', 'يعود للمنزل', 'ينام', 'يأكل'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يشاهد التلفاز" in English?',
      prompt_ar: 'ما هي "يشاهد التلفاز" بالإنجليزية؟',
      options: ['read a book', 'watch TV', 'have dinner', 'rest'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I ___ home at 5 PM. (come)',
      prompt_ar: 'أ___ للمنزل الساعة الخامسة.',
      answer: 'come'
    },
    {
      type: 'matching',
      prompt_en: 'Match the evening activities',
      prompt_ar: 'طابق أنشطة المساء',
      pairs: [
        { en: 'rest', ar: 'يرتاح' },
        { en: 'have dinner', ar: 'يتناول العشاء' },
        { en: 'relax', ar: 'يسترخي' },
        { en: 'tired', ar: 'متعب' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: TV / I / family / my / with / watch',
      prompt_ar: 'رتب الكلمات',
      words: ['TV', 'I', 'family', 'my', 'with', 'watch'],
      correctOrder: ['I', 'watch', 'TV', 'with', 'my', 'family']
    },
    {
      type: 'mcq',
      prompt_en: 'What do students do after school?',
      prompt_ar: 'ماذا يفعل الطلاب بعد المدرسة؟',
      options: ['go to work', 'do homework', 'wake up', 'have breakfast'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I am ___ after work. (tired)',
      prompt_ar: 'أنا ___ بعد العمل.',
      answer: 'tired'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مساء" in English?',
      prompt_ar: 'ما هي "مساء" بالإنجليزية؟',
      options: ['morning', 'afternoon', 'evening', 'night'],
      correctIndex: 2
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "rest" in Arabic?',
      prompt_ar: 'ما هي "rest" بالعربية؟',
      options: ['يعمل', 'يرتاح', 'يأكل', 'يشرب'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "واجب منزلي" in English?',
      prompt_ar: 'ما هي "واجب منزلي" بالإنجليزية؟',
      options: ['housework', 'homework', 'work', 'school'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'We have ___ at 7 PM. (dinner)',
      prompt_ar: 'نتناول ال___ الساعة السابعة.',
      answer: 'dinner'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'read a book', ar: 'يقرأ كتاباً' },
        { en: 'spend time', ar: 'يقضي وقتاً' },
        { en: 'evening', ar: 'مساء' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يسترخي" in English?',
      prompt_ar: 'ما هي "يسترخي" بالإنجليزية؟',
      options: ['rest', 'relax', 'sleep', 'work'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: homework / I / dinner / before / do / my',
      prompt_ar: 'رتب الكلمات',
      words: ['homework', 'I', 'dinner', 'before', 'do', 'my'],
      correctOrder: ['I', 'do', 'my', 'homework', 'before', 'dinner']
    }
  ]
};

const unit7Lesson4: LessonContent = {
  id: 'A1-u07-l04',
  unitId: 'A1-u07',
  title_en: 'Bedtime Routine',
  title_ar: 'روتين النوم',
  vocabulary: [
    { en: 'go to bed', ar: 'يذهب للنوم' },
    { en: 'sleep', ar: 'ينام' },
    { en: 'pajamas', ar: 'بيجاما' },
    { en: 'dream', ar: 'حلم' },
    { en: 'night', ar: 'ليل' },
    { en: 'midnight', ar: 'منتصف الليل' },
    { en: 'set the alarm', ar: 'يضبط المنبه' },
    { en: 'turn off the light', ar: 'يطفئ الضوء' },
    { en: 'good night', ar: 'تصبح على خير' },
    { en: 'sweet dreams', ar: 'أحلام سعيدة' }
  ],
  sentences: [
    { en: 'I go to bed at 10 PM.', ar: 'أذهب للنوم الساعة العاشرة.' },
    { en: 'I put on my pajamas.', ar: 'أرتدي بيجامتي.' },
    { en: 'I set the alarm for tomorrow.', ar: 'أضبط المنبه للغد.' },
    { en: 'I turn off the light.', ar: 'أطفئ الضوء.' },
    { en: 'Good night, sweet dreams!', ar: 'تصبح على خير، أحلام سعيدة!' },
    { en: 'I sleep 8 hours every night.', ar: 'أنام 8 ساعات كل ليلة.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "go to bed" in Arabic?',
      prompt_ar: 'ما هي "go to bed" بالعربية؟',
      options: ['يستيقظ', 'يذهب للنوم', 'يأكل', 'يقرأ'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "ينام" in English?',
      prompt_ar: 'ما هي "ينام" بالإنجليزية؟',
      options: ['wake up', 'sleep', 'rest', 'dream'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I go to ___ at 10 PM. (bed)',
      prompt_ar: 'أذهب لل___ الساعة العاشرة.',
      answer: 'bed'
    },
    {
      type: 'matching',
      prompt_en: 'Match the bedtime words',
      prompt_ar: 'طابق كلمات وقت النوم',
      pairs: [
        { en: 'pajamas', ar: 'بيجاما' },
        { en: 'dream', ar: 'حلم' },
        { en: 'night', ar: 'ليل' },
        { en: 'midnight', ar: 'منتصف الليل' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: the / I / off / turn / light',
      prompt_ar: 'رتب الكلمات',
      words: ['the', 'I', 'off', 'turn', 'light'],
      correctOrder: ['I', 'turn', 'off', 'the', 'light']
    },
    {
      type: 'mcq',
      prompt_en: 'What do you say before sleeping?',
      prompt_ar: 'ماذا تقول قبل النوم؟',
      options: ['good morning', 'good night', 'good afternoon', 'hello'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I set the ___ for tomorrow. (alarm)',
      prompt_ar: 'أضبط ال___ للغد.',
      answer: 'alarm'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "أحلام سعيدة" in English?',
      prompt_ar: 'ما هي "أحلام سعيدة" بالإنجليزية؟',
      options: ['good night', 'sweet dreams', 'good morning', 'see you'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "sleep" in Arabic?',
      prompt_ar: 'ما هي "sleep" بالعربية؟',
      options: ['يستيقظ', 'ينام', 'يحلم', 'يرتاح'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "ليل" in English?',
      prompt_ar: 'ما هي "ليل" بالإنجليزية؟',
      options: ['morning', 'afternoon', 'evening', 'night'],
      correctIndex: 3
    },
    {
      type: 'fill_blank',
      prompt_en: 'I put on my ___. (pajamas)',
      prompt_ar: 'أرتدي ___.',
      answer: 'pajamas'
    },
    {
      type: 'matching',
      prompt_en: 'Match the phrases',
      prompt_ar: 'طابق العبارات',
      pairs: [
        { en: 'good night', ar: 'تصبح على خير' },
        { en: 'set the alarm', ar: 'يضبط المنبه' },
        { en: 'turn off the light', ar: 'يطفئ الضوء' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "حلم" in English?',
      prompt_ar: 'ما هي "حلم" بالإنجليزية؟',
      options: ['sleep', 'dream', 'night', 'bed'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: night / sleep / every / hours / I / 8',
      prompt_ar: 'رتب الكلمات',
      words: ['night', 'sleep', 'every', 'hours', 'I', '8'],
      correctOrder: ['I', 'sleep', '8', 'hours', 'every', 'night']
    }
  ]
};

const unit7Lesson5: LessonContent = {
  id: 'A1-u07-l05',
  unitId: 'A1-u07',
  title_en: 'Weekend Activities',
  title_ar: 'أنشطة نهاية الأسبوع',
  vocabulary: [
    { en: 'weekend', ar: 'نهاية الأسبوع' },
    { en: 'Saturday', ar: 'السبت' },
    { en: 'Sunday', ar: 'الأحد' },
    { en: 'sleep in', ar: 'ينام متأخراً' },
    { en: 'go out', ar: 'يخرج' },
    { en: 'visit friends', ar: 'يزور الأصدقاء' },
    { en: 'go shopping', ar: 'يتسوق' },
    { en: 'have fun', ar: 'يستمتع' },
    { en: 'free time', ar: 'وقت فراغ' },
    { en: 'plan', ar: 'خطة' }
  ],
  sentences: [
    { en: 'I love the weekend.', ar: 'أحب نهاية الأسبوع.' },
    { en: 'I sleep in on Saturday.', ar: 'أنام متأخراً يوم السبت.' },
    { en: 'I visit my friends on Sunday.', ar: 'أزور أصدقائي يوم الأحد.' },
    { en: 'We go shopping together.', ar: 'نتسوق معاً.' },
    { en: 'I have more free time on weekends.', ar: 'لدي وقت فراغ أكثر في نهاية الأسبوع.' },
    { en: 'What are your plans for the weekend?', ar: 'ما هي خططك لنهاية الأسبوع؟' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "weekend" in Arabic?',
      prompt_ar: 'ما هي "weekend" بالعربية؟',
      options: ['يوم', 'أسبوع', 'نهاية الأسبوع', 'شهر'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يزور الأصدقاء" in English?',
      prompt_ar: 'ما هي "يزور الأصدقاء" بالإنجليزية؟',
      options: ['go out', 'visit friends', 'go shopping', 'have fun'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I love the ___. (weekend)',
      prompt_ar: 'أحب ___ الأسبوع.',
      answer: 'weekend'
    },
    {
      type: 'matching',
      prompt_en: 'Match the weekend words',
      prompt_ar: 'طابق كلمات نهاية الأسبوع',
      pairs: [
        { en: 'Saturday', ar: 'السبت' },
        { en: 'Sunday', ar: 'الأحد' },
        { en: 'go out', ar: 'يخرج' },
        { en: 'free time', ar: 'وقت فراغ' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: Saturday / in / on / sleep / I',
      prompt_ar: 'رتب الكلمات',
      words: ['Saturday', 'in', 'on', 'sleep', 'I'],
      correctOrder: ['I', 'sleep', 'in', 'on', 'Saturday']
    },
    {
      type: 'mcq',
      prompt_en: 'What do people often do on weekends?',
      prompt_ar: 'ماذا يفعل الناس عادة في نهاية الأسبوع؟',
      options: ['go to work', 'study hard', 'have fun', 'wake up early'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'We go ___ together. (shopping)',
      prompt_ar: 'ن___ معاً.',
      answer: 'shopping'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "خطة" in English?',
      prompt_ar: 'ما هي "خطة" بالإنجليزية؟',
      options: ['time', 'plan', 'day', 'week'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "Saturday" in Arabic?',
      prompt_ar: 'ما هي "Saturday" بالعربية؟',
      options: ['الأحد', 'الاثنين', 'السبت', 'الجمعة'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يتسوق" in English?',
      prompt_ar: 'ما هي "يتسوق" بالإنجليزية؟',
      options: ['go out', 'go shopping', 'visit', 'have fun'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I ___ my friends on Sunday. (visit)',
      prompt_ar: 'أ___ أصدقائي يوم الأحد.',
      answer: 'visit'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'sleep in', ar: 'ينام متأخراً' },
        { en: 'have fun', ar: 'يستمتع' },
        { en: 'plan', ar: 'خطة' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "وقت فراغ" in English?',
      prompt_ar: 'ما هي "وقت فراغ" بالإنجليزية؟',
      options: ['work time', 'free time', 'bed time', 'lunch time'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: weekend / are / plans / What / your / the / for',
      prompt_ar: 'رتب الكلمات',
      words: ['weekend', 'are', 'plans', 'What', 'your', 'the', 'for'],
      correctOrder: ['What', 'are', 'your', 'plans', 'for', 'the', 'weekend']
    }
  ]
};

export const a1Unit7Lessons: Record<string, LessonContent> = {
  'A1-u07-l01': unit7Lesson1,
  'A1-u07-l02': unit7Lesson2,
  'A1-u07-l03': unit7Lesson3,
  'A1-u07-l04': unit7Lesson4,
  'A1-u07-l05': unit7Lesson5,
};
