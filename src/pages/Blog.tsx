import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import PageBackground from '@/components/PageBackground';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Placeholder blog posts for demonstration
const blogPosts = [
  {
    id: 1,
    title: 'كيف تبدأ رحلة تعلم اللغة العربية',
    excerpt: 'دليل شامل للمبتدئين يوضح أفضل الطرق والاستراتيجيات لبدء تعلم اللغة العربية بشكل فعال ومستدام.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60',
    date: '2024-01-15',
    readTime: '5 دقائق',
    category: 'نصائح تعليمية',
  },
  {
    id: 2,
    title: 'أهمية الممارسة اليومية في تعلم اللغات',
    excerpt: 'اكتشف كيف يمكن للممارسة اليومية المستمرة أن تحسن مهاراتك اللغوية بشكل ملحوظ في وقت قصير.',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&auto=format&fit=crop&q=60',
    date: '2024-01-10',
    readTime: '4 دقائق',
    category: 'استراتيجيات',
  },
  {
    id: 3,
    title: 'فهم قواعد النحو العربي بسهولة',
    excerpt: 'شرح مبسط لأساسيات النحو العربي مع أمثلة عملية تساعدك على فهم التراكيب اللغوية الصحيحة.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=60',
    date: '2024-01-05',
    readTime: '7 دقائق',
    category: 'قواعد اللغة',
  },
  {
    id: 4,
    title: 'تطبيقات مفيدة لتعلم المفردات الجديدة',
    excerpt: 'استعراض لأفضل التطبيقات والأدوات التي تساعدك على حفظ وتذكر المفردات العربية الجديدة.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=60',
    date: '2024-01-01',
    readTime: '6 دقائق',
    category: 'أدوات',
  },
  {
    id: 5,
    title: 'تحسين مهارات الاستماع والفهم',
    excerpt: 'تقنيات فعالة لتطوير قدرتك على فهم اللغة العربية المنطوقة في مختلف السياقات.',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop&q=60',
    date: '2023-12-28',
    readTime: '5 دقائق',
    category: 'مهارات',
  },
  {
    id: 6,
    title: 'كيف تبني عادة القراءة بالعربية',
    excerpt: 'نصائح عملية لجعل القراءة باللغة العربية جزءاً من روتينك اليومي وتحسين مستواك.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60',
    date: '2023-12-20',
    readTime: '4 دقائق',
    category: 'عادات',
  },
];

const POSTS_PER_PAGE = 6;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = blogPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <PageBackground>
      <div className="min-h-screen" dir="rtl">
        <Header />

        <main className="container mx-auto px-4 py-12 pt-24">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">مصادر تعليمية</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            المدونة
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            اكتشف مقالات ونصائح مفيدة لتحسين مهاراتك في اللغة العربية. نشارك معك
            أفضل الاستراتيجيات والموارد لرحلة تعلم ناجحة.
          </p>
        </motion.section>

        {/* Blog Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post, index) => (
              <motion.div
                key={post.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
              >
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 group">
                  {/* Featured Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-primary/90 text-primary-foreground text-xs px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Read More Button */}
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent group/btn"
                    >
                      <span>اقرأ المزيد</span>
                      <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover/btn:-translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Pagination>
              <PaginationContent className="flex-row-reverse">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}

        {/* Empty State for Future */}
        {blogPosts.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              لا توجد مقالات حالياً
            </h3>
            <p className="text-muted-foreground">
              سنضيف محتوى جديد قريباً، ترقبوا!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>LingoArab © {new Date().getFullYear()} - جميع الحقوق محفوظة</p>
        </div>
      </footer>
      </div>
    </PageBackground>
  );
};

export default Blog;
