import { Helmet } from 'react-helmet-async';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SeoBreadcrumbsProps {
  /** Ordered list of crumbs from root → current page (do NOT include "Home" — it is added automatically). */
  items: BreadcrumbItem[];
  /** Optional canonical for the current page (defaults to last item's url). */
  canonical?: string;
}

const SITE = 'https://lingoarab.com';

/**
 * Injects a consistent BreadcrumbList JSON-LD plus canonical + hreflang
 * for any page on the site. The first crumb (الرئيسية / Home) is always added.
 */
const SeoBreadcrumbs = ({ items, canonical }: SeoBreadcrumbsProps) => {
  const crumbs = [{ name: 'الرئيسية', url: `${SITE}/` }, ...items];
  const current = canonical ?? items[items.length - 1]?.url ?? `${SITE}/`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };

  return (
    <Helmet>
      <link rel="canonical" href={current} />
      <link rel="alternate" hrefLang="ar" href={current} />
      <link rel="alternate" hrefLang="x-default" href={current} />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default SeoBreadcrumbs;
