import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml; charset=utf-8',
};

const SITE_URL = 'https://lingoarab.com';

// Static pages with their priorities and change frequencies
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/courses', priority: '0.9', changefreq: 'weekly' },
  { path: '/courses/a1', priority: '0.85', changefreq: 'weekly' },
  { path: '/courses/a2', priority: '0.85', changefreq: 'weekly' },
  { path: '/courses/b1', priority: '0.85', changefreq: 'weekly' },
  { path: '/courses/b2', priority: '0.85', changefreq: 'weekly' },
  { path: '/courses/c1', priority: '0.85', changefreq: 'weekly' },
  { path: '/courses/c2', priority: '0.85', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/placement-test', priority: '0.7', changefreq: 'monthly' },
  { path: '/leaderboard', priority: '0.6', changefreq: 'daily' },
  { path: '/challenges', priority: '0.6', changefreq: 'daily' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
];

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function generateUrlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `
  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="${loc}" />
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${lastmod}</lastmod>
  </url>`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Generating dynamic sitemap...');

    // Fetch published blog articles
    const { data: articles, error } = await supabase
      .from('blog_articles')
      .select('slug, updated_at, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }

    console.log(`Found ${articles?.length || 0} published articles`);

    const today = formatDate(new Date());

    // Generate static page entries
    const staticEntries = staticPages.map(page => 
      generateUrlEntry(
        `${SITE_URL}${page.path}`,
        today,
        page.changefreq,
        page.priority
      )
    ).join('');

    // Generate blog article entries
    const blogEntries = (articles || []).map(article => 
      generateUrlEntry(
        `${SITE_URL}/blog/${article.slug}`,
        formatDate(article.updated_at || article.published_at),
        'monthly',
        '0.7'
      )
    ).join('');

    // Build complete sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Static Pages -->${staticEntries}

  <!-- Blog Articles -->${blogEntries}
</urlset>`;

    console.log('Sitemap generated successfully');

    return new Response(sitemap, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Return a basic sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      status: 200,
      headers: corsHeaders,
    });
  }
});
