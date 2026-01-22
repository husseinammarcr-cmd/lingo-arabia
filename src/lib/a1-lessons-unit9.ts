// A1 Unit 9: Shopping - التسوق
import { LessonContent } from './a1-lessons';

const unit9Lesson1: LessonContent = {
  id: 'A1-u09-l01',
  unitId: 'A1-u09',
  title_en: 'At the Store',
  title_ar: 'في المتجر',
  vocabulary: [
    { en: 'store', ar: 'متجر' },
    { en: 'shop', ar: 'محل' },
    { en: 'buy', ar: 'يشتري' },
    { en: 'sell', ar: 'يبيع' },
    { en: 'price', ar: 'سعر' },
    { en: 'cheap', ar: 'رخيص' },
    { en: 'expensive', ar: 'غالي' },
    { en: 'discount', ar: 'خصم' },
    { en: 'sale', ar: 'تخفيضات' },
    { en: 'cashier', ar: 'أمين الصندوق' }
  ],
  sentences: [
    { en: 'I go to the store every week.', ar: 'أذهب إلى المتجر كل أسبوع.' },
    { en: 'I want to buy a new shirt.', ar: 'أريد أن أشتري قميصاً جديداً.' },
    { en: 'What is the price of this?', ar: 'ما سعر هذا؟' },
    { en: 'This is too expensive.', ar: 'هذا غالي جداً.' },
    { en: 'There is a big sale today.', ar: 'هناك تخفيضات كبيرة اليوم.' },
    { en: 'Can I get a discount?', ar: 'هل يمكنني الحصول على خصم؟' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "store" in Arabic?',
      prompt_ar: 'ما هي "store" بالعربية؟',
      options: ['سوق', 'متجر', 'مطعم', 'بنك'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يشتري" in English?',
      prompt_ar: 'ما هي "يشتري" بالإنجليزية؟',
      options: ['sell', 'buy', 'pay', 'take'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I want to ___ a new shirt. (buy)',
      prompt_ar: 'أريد أن ___ قميصاً جديداً.',
      answer: 'buy'
    },
    {
      type: 'matching',
      prompt_en: 'Match the shopping words',
      prompt_ar: 'طابق كلمات التسوق',
      pairs: [
        { en: 'price', ar: 'سعر' },
        { en: 'cheap', ar: 'رخيص' },
        { en: 'expensive', ar: 'غالي' },
        { en: 'discount', ar: 'خصم' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: is / the / What / this / price / of',
      prompt_ar: 'رتب الكلمات',
      words: ['is', 'the', 'What', 'this', 'price', 'of'],
      correctOrder: ['What', 'is', 'the', 'price', 'of', 'this']
    },
    {
      type: 'mcq',
      prompt_en: 'What is the opposite of "cheap"?',
      prompt_ar: 'ما عكس "رخيص"؟',
      options: ['expensive', 'new', 'big', 'small'],
      correctIndex: 0
    },
    {
      type: 'fill_blank',
      prompt_en: 'This is too ___. (expensive)',
      prompt_ar: 'هذا ___ جداً.',
      answer: 'expensive'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "تخفيضات" in English?',
      prompt_ar: 'ما هي "تخفيضات" بالإنجليزية؟',
      options: ['discount', 'sale', 'price', 'shop'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "buy" in Arabic?',
      prompt_ar: 'ما هي "buy" بالعربية؟',
      options: ['يبيع', 'يشتري', 'يدفع', 'يأخذ'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "سعر" in English?',
      prompt_ar: 'ما هي "سعر" بالإنجليزية؟',
      options: ['sale', 'discount', 'price', 'money'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'Can I get a ___? (discount)',
      prompt_ar: 'هل يمكنني الحصول على ___؟',
      answer: 'discount'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'sell', ar: 'يبيع' },
        { en: 'shop', ar: 'محل' },
        { en: 'cashier', ar: 'أمين الصندوق' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "رخيص" in English?',
      prompt_ar: 'ما هي "رخيص" بالإنجليزية؟',
      options: ['expensive', 'cheap', 'new', 'old'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: today / sale / is / big / There / a',
      prompt_ar: 'رتب الكلمات',
      words: ['today', 'sale', 'is', 'big', 'There', 'a'],
      correctOrder: ['There', 'is', 'a', 'big', 'sale', 'today']
    }
  ]
};

const unit9Lesson2: LessonContent = {
  id: 'A1-u09-l02',
  unitId: 'A1-u09',
  title_en: 'Clothes Shopping',
  title_ar: 'شراء الملابس',
  vocabulary: [
    { en: 'clothes', ar: 'ملابس' },
    { en: 'shirt', ar: 'قميص' },
    { en: 'pants', ar: 'بنطال' },
    { en: 'dress', ar: 'فستان' },
    { en: 'shoes', ar: 'حذاء' },
    { en: 'size', ar: 'مقاس' },
    { en: 'try on', ar: 'يجرب' },
    { en: 'fit', ar: 'يناسب' },
    { en: 'color', ar: 'لون' },
    { en: 'fitting room', ar: 'غرفة القياس' }
  ],
  sentences: [
    { en: 'I need new clothes.', ar: 'أحتاج ملابس جديدة.' },
    { en: 'Can I try this on?', ar: 'هل يمكنني تجربة هذا؟' },
    { en: 'What size do you wear?', ar: 'ما مقاسك؟' },
    { en: 'This shirt fits perfectly.', ar: 'هذا القميص يناسبني تماماً.' },
    { en: 'Where is the fitting room?', ar: 'أين غرفة القياس؟' },
    { en: 'I like this color.', ar: 'أحب هذا اللون.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "clothes" in Arabic?',
      prompt_ar: 'ما هي "clothes" بالعربية؟',
      options: ['حذاء', 'ملابس', 'قميص', 'فستان'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مقاس" in English?',
      prompt_ar: 'ما هي "مقاس" بالإنجليزية؟',
      options: ['color', 'price', 'size', 'fit'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'I need new ___. (clothes)',
      prompt_ar: 'أحتاج ___ جديدة.',
      answer: 'clothes'
    },
    {
      type: 'matching',
      prompt_en: 'Match the clothes',
      prompt_ar: 'طابق الملابس',
      pairs: [
        { en: 'shirt', ar: 'قميص' },
        { en: 'pants', ar: 'بنطال' },
        { en: 'dress', ar: 'فستان' },
        { en: 'shoes', ar: 'حذاء' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: on / try / this / I / Can',
      prompt_ar: 'رتب الكلمات',
      words: ['on', 'try', 'this', 'I', 'Can'],
      correctOrder: ['Can', 'I', 'try', 'this', 'on']
    },
    {
      type: 'mcq',
      prompt_en: 'Where do you try on clothes?',
      prompt_ar: 'أين تجرب الملابس؟',
      options: ['cashier', 'fitting room', 'entrance', 'exit'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'This shirt ___ perfectly. (fits)',
      prompt_ar: 'هذا القميص ___ تماماً.',
      answer: 'fits'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "لون" in English?',
      prompt_ar: 'ما هي "لون" بالإنجليزية؟',
      options: ['size', 'color', 'fit', 'price'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "shoes" in Arabic?',
      prompt_ar: 'ما هي "shoes" بالعربية؟',
      options: ['قميص', 'بنطال', 'حذاء', 'فستان'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "يجرب" in English?',
      prompt_ar: 'ما هي "يجرب" بالإنجليزية؟',
      options: ['buy', 'try on', 'fit', 'wear'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'What ___ do you wear? (size)',
      prompt_ar: 'ما ___؟',
      answer: 'size'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'fit', ar: 'يناسب' },
        { en: 'color', ar: 'لون' },
        { en: 'fitting room', ar: 'غرفة القياس' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "فستان" in English?',
      prompt_ar: 'ما هي "فستان" بالإنجليزية؟',
      options: ['shirt', 'pants', 'dress', 'shoes'],
      correctIndex: 2
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: color / like / this / I',
      prompt_ar: 'رتب الكلمات',
      words: ['color', 'like', 'this', 'I'],
      correctOrder: ['I', 'like', 'this', 'color']
    }
  ]
};

const unit9Lesson3: LessonContent = {
  id: 'A1-u09-l03',
  unitId: 'A1-u09',
  title_en: 'Paying and Money',
  title_ar: 'الدفع والمال',
  vocabulary: [
    { en: 'pay', ar: 'يدفع' },
    { en: 'money', ar: 'مال' },
    { en: 'cash', ar: 'نقد' },
    { en: 'credit card', ar: 'بطاقة ائتمان' },
    { en: 'receipt', ar: 'إيصال' },
    { en: 'change', ar: 'باقي' },
    { en: 'total', ar: 'المجموع' },
    { en: 'wallet', ar: 'محفظة' },
    { en: 'bill', ar: 'فاتورة' },
    { en: 'ATM', ar: 'صراف آلي' }
  ],
  sentences: [
    { en: 'How much do I pay?', ar: 'كم أدفع؟' },
    { en: 'I will pay by credit card.', ar: 'سأدفع بالبطاقة الائتمانية.' },
    { en: 'Can I pay in cash?', ar: 'هل يمكنني الدفع نقداً؟' },
    { en: 'Here is your receipt.', ar: 'هذا إيصالك.' },
    { en: 'The total is $50.', ar: 'المجموع 50 دولار.' },
    { en: 'Keep the change.', ar: 'احتفظ بالباقي.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "pay" in Arabic?',
      prompt_ar: 'ما هي "pay" بالعربية؟',
      options: ['يشتري', 'يبيع', 'يدفع', 'يأخذ'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مال" in English?',
      prompt_ar: 'ما هي "مال" بالإنجليزية؟',
      options: ['cash', 'money', 'card', 'wallet'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'How much do I ___? (pay)',
      prompt_ar: 'كم ___؟',
      answer: 'pay'
    },
    {
      type: 'matching',
      prompt_en: 'Match the money words',
      prompt_ar: 'طابق كلمات المال',
      pairs: [
        { en: 'cash', ar: 'نقد' },
        { en: 'credit card', ar: 'بطاقة ائتمان' },
        { en: 'receipt', ar: 'إيصال' },
        { en: 'wallet', ar: 'محفظة' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: card / pay / credit / will / I / by',
      prompt_ar: 'رتب الكلمات',
      words: ['card', 'pay', 'credit', 'will', 'I', 'by'],
      correctOrder: ['I', 'will', 'pay', 'by', 'credit', 'card']
    },
    {
      type: 'mcq',
      prompt_en: 'What do you get after paying?',
      prompt_ar: 'ماذا تحصل عليه بعد الدفع؟',
      options: ['wallet', 'money', 'receipt', 'card'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'The ___ is $50. (total)',
      prompt_ar: '___ 50 دولار.',
      answer: 'total'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "باقي" in English?',
      prompt_ar: 'ما هي "باقي" بالإنجليزية؟',
      options: ['total', 'change', 'bill', 'receipt'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "money" in Arabic?',
      prompt_ar: 'ما هي "money" بالعربية؟',
      options: ['نقد', 'مال', 'محفظة', 'بطاقة'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "نقد" in English?',
      prompt_ar: 'ما هي "نقد" بالإنجليزية؟',
      options: ['money', 'cash', 'card', 'change'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'Can I pay in ___? (cash)',
      prompt_ar: 'هل يمكنني الدفع ___؟',
      answer: 'cash'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'change', ar: 'باقي' },
        { en: 'total', ar: 'المجموع' },
        { en: 'ATM', ar: 'صراف آلي' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "فاتورة" in English?',
      prompt_ar: 'ما هي "فاتورة" بالإنجليزية؟',
      options: ['receipt', 'bill', 'change', 'total'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: receipt / Here / your / is',
      prompt_ar: 'رتب الكلمات',
      words: ['receipt', 'Here', 'your', 'is'],
      correctOrder: ['Here', 'is', 'your', 'receipt']
    }
  ]
};

const unit9Lesson4: LessonContent = {
  id: 'A1-u09-l04',
  unitId: 'A1-u09',
  title_en: 'At the Supermarket',
  title_ar: 'في السوبرماركت',
  vocabulary: [
    { en: 'cart', ar: 'عربة تسوق' },
    { en: 'basket', ar: 'سلة' },
    { en: 'aisle', ar: 'ممر' },
    { en: 'shelf', ar: 'رف' },
    { en: 'checkout', ar: 'كاشير' },
    { en: 'bag', ar: 'كيس' },
    { en: 'fresh', ar: 'طازج' },
    { en: 'frozen', ar: 'مجمد' },
    { en: 'organic', ar: 'عضوي' },
    { en: 'list', ar: 'قائمة' }
  ],
  sentences: [
    { en: 'I need a shopping cart.', ar: 'أحتاج عربة تسوق.' },
    { en: 'The fruits are in aisle 3.', ar: 'الفواكه في الممر 3.' },
    { en: 'I always buy fresh vegetables.', ar: 'أشتري دائماً خضروات طازجة.' },
    { en: 'Where is the checkout?', ar: 'أين الكاشير؟' },
    { en: 'Do you have a shopping list?', ar: 'هل لديك قائمة تسوق؟' },
    { en: 'I prefer organic food.', ar: 'أفضل الطعام العضوي.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "cart" in Arabic?',
      prompt_ar: 'ما هي "cart" بالعربية؟',
      options: ['سلة', 'كيس', 'عربة تسوق', 'رف'],
      correctIndex: 2
    },
    {
      type: 'mcq',
      prompt_en: 'What is "طازج" in English?',
      prompt_ar: 'ما هي "طازج" بالإنجليزية؟',
      options: ['frozen', 'fresh', 'organic', 'old'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I need a shopping ___. (cart)',
      prompt_ar: 'أحتاج ___ تسوق.',
      answer: 'cart'
    },
    {
      type: 'matching',
      prompt_en: 'Match the supermarket words',
      prompt_ar: 'طابق كلمات السوبرماركت',
      pairs: [
        { en: 'basket', ar: 'سلة' },
        { en: 'aisle', ar: 'ممر' },
        { en: 'shelf', ar: 'رف' },
        { en: 'checkout', ar: 'كاشير' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: 3 / are / The / in / fruits / aisle',
      prompt_ar: 'رتب الكلمات',
      words: ['3', 'are', 'The', 'in', 'fruits', 'aisle'],
      correctOrder: ['The', 'fruits', 'are', 'in', 'aisle', '3']
    },
    {
      type: 'mcq',
      prompt_en: 'What is the opposite of "fresh"?',
      prompt_ar: 'ما عكس "طازج"؟',
      options: ['organic', 'frozen', 'new', 'good'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I prefer ___ food. (organic)',
      prompt_ar: 'أفضل الطعام ال___.',
      answer: 'organic'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "قائمة" in English?',
      prompt_ar: 'ما هي "قائمة" بالإنجليزية؟',
      options: ['bag', 'list', 'cart', 'aisle'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "basket" in Arabic?',
      prompt_ar: 'ما هي "basket" بالعربية؟',
      options: ['عربة', 'سلة', 'كيس', 'رف'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "مجمد" in English?',
      prompt_ar: 'ما هي "مجمد" بالإنجليزية؟',
      options: ['fresh', 'frozen', 'organic', 'cold'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'Where is the ___? (checkout)',
      prompt_ar: 'أين ال___؟',
      answer: 'checkout'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'bag', ar: 'كيس' },
        { en: 'list', ar: 'قائمة' },
        { en: 'fresh', ar: 'طازج' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "ممر" in English?',
      prompt_ar: 'ما هي "ممر" بالإنجليزية؟',
      options: ['shelf', 'aisle', 'checkout', 'cart'],
      correctIndex: 1
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: vegetables / always / I / fresh / buy',
      prompt_ar: 'رتب الكلمات',
      words: ['vegetables', 'always', 'I', 'fresh', 'buy'],
      correctOrder: ['I', 'always', 'buy', 'fresh', 'vegetables']
    }
  ]
};

const unit9Lesson5: LessonContent = {
  id: 'A1-u09-l05',
  unitId: 'A1-u09',
  title_en: 'Online Shopping',
  title_ar: 'التسوق عبر الإنترنت',
  vocabulary: [
    { en: 'online', ar: 'عبر الإنترنت' },
    { en: 'website', ar: 'موقع إلكتروني' },
    { en: 'order', ar: 'طلب' },
    { en: 'delivery', ar: 'توصيل' },
    { en: 'shipping', ar: 'شحن' },
    { en: 'free shipping', ar: 'شحن مجاني' },
    { en: 'return', ar: 'إرجاع' },
    { en: 'review', ar: 'تقييم' },
    { en: 'add to cart', ar: 'أضف للسلة' },
    { en: 'checkout', ar: 'إتمام الشراء' }
  ],
  sentences: [
    { en: 'I prefer online shopping.', ar: 'أفضل التسوق عبر الإنترنت.' },
    { en: 'I ordered a book online.', ar: 'طلبت كتاباً عبر الإنترنت.' },
    { en: 'Delivery is in 3 days.', ar: 'التوصيل خلال 3 أيام.' },
    { en: 'This website has free shipping.', ar: 'هذا الموقع فيه شحن مجاني.' },
    { en: 'I want to return this item.', ar: 'أريد إرجاع هذا المنتج.' },
    { en: 'The reviews are very good.', ar: 'التقييمات جيدة جداً.' }
  ],
  exercises: [
    {
      type: 'mcq',
      prompt_en: 'What is "online" in Arabic?',
      prompt_ar: 'ما هي "online" بالعربية؟',
      options: ['موقع', 'عبر الإنترنت', 'توصيل', 'شحن'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "توصيل" in English?',
      prompt_ar: 'ما هي "توصيل" بالإنجليزية؟',
      options: ['shipping', 'delivery', 'order', 'return'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: 'I prefer ___ shopping. (online)',
      prompt_ar: 'أفضل التسوق ___.',
      answer: 'online'
    },
    {
      type: 'matching',
      prompt_en: 'Match the online shopping words',
      prompt_ar: 'طابق كلمات التسوق الإلكتروني',
      pairs: [
        { en: 'website', ar: 'موقع إلكتروني' },
        { en: 'order', ar: 'طلب' },
        { en: 'shipping', ar: 'شحن' },
        { en: 'review', ar: 'تقييم' }
      ]
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: online / book / ordered / I / a',
      prompt_ar: 'رتب الكلمات',
      words: ['online', 'book', 'ordered', 'I', 'a'],
      correctOrder: ['I', 'ordered', 'a', 'book', 'online']
    },
    {
      type: 'mcq',
      prompt_en: 'What do you do if you do not like a product?',
      prompt_ar: 'ماذا تفعل إذا لم يعجبك المنتج؟',
      options: ['order', 'return', 'review', 'ship'],
      correctIndex: 1
    },
    {
      type: 'fill_blank',
      prompt_en: '___ is in 3 days. (Delivery)',
      prompt_ar: 'ال___ خلال 3 أيام.',
      answer: 'Delivery'
    },
    {
      type: 'mcq',
      prompt_en: 'What is "شحن مجاني" in English?',
      prompt_ar: 'ما هي "شحن مجاني" بالإنجليزية؟',
      options: ['fast shipping', 'free shipping', 'delivery', 'order'],
      correctIndex: 1
    }
  ],
  quiz: [
    {
      type: 'mcq',
      prompt_en: 'What is "order" in Arabic?',
      prompt_ar: 'ما هي "order" بالعربية؟',
      options: ['توصيل', 'طلب', 'شحن', 'إرجاع'],
      correctIndex: 1
    },
    {
      type: 'mcq',
      prompt_en: 'What is "إرجاع" in English?',
      prompt_ar: 'ما هي "إرجاع" بالإنجليزية؟',
      options: ['order', 'delivery', 'return', 'review'],
      correctIndex: 2
    },
    {
      type: 'fill_blank',
      prompt_en: 'This website has free ___. (shipping)',
      prompt_ar: 'هذا الموقع فيه ___ مجاني.',
      answer: 'shipping'
    },
    {
      type: 'matching',
      prompt_en: 'Match the words',
      prompt_ar: 'طابق الكلمات',
      pairs: [
        { en: 'add to cart', ar: 'أضف للسلة' },
        { en: 'checkout', ar: 'إتمام الشراء' },
        { en: 'free shipping', ar: 'شحن مجاني' }
      ]
    },
    {
      type: 'mcq',
      prompt_en: 'What is "تقييم" in English?',
      prompt_ar: 'ما هي "تقييم" بالإنجليزية؟',
      options: ['order', 'return', 'review', 'website'],
      correctIndex: 2
    },
    {
      type: 'reorder',
      prompt_en: 'Arrange: good / reviews / very / The / are',
      prompt_ar: 'رتب الكلمات',
      words: ['good', 'reviews', 'very', 'The', 'are'],
      correctOrder: ['The', 'reviews', 'are', 'very', 'good']
    }
  ]
};

export const a1Unit9Lessons: Record<string, LessonContent> = {
  'A1-u09-l01': unit9Lesson1,
  'A1-u09-l02': unit9Lesson2,
  'A1-u09-l03': unit9Lesson3,
  'A1-u09-l04': unit9Lesson4,
  'A1-u09-l05': unit9Lesson5,
};
