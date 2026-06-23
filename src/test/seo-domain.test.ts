/// <reference types="node" />
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { resolve, join } from "path";

const ROOT = resolve(process.cwd());
const EXPECTED_DOMAIN = "lingoarab.com";
const FORBIDDEN_DOMAINS = [
  "arabizi-learn.lovable.app",
  "id-preview--5432d49c-b7e5-41d3-a7b7-1c6456b764dd.lovable.app",
];

const PAGES_DIR = join(ROOT, "src/pages");
const pageFiles = readdirSync(PAGES_DIR).filter((f) => f.endsWith(".tsx"));

/** Extract every absolute http(s) URL from a string. */
function extractUrls(content: string): string[] {
  return content.match(/https?:\/\/[^\s"'`<>)]+/g) ?? [];
}

describe("SEO domain consistency — pages", () => {
  for (const file of pageFiles) {
    it(`${file} contains no forbidden domains`, () => {
      const content = readFileSync(join(PAGES_DIR, file), "utf8");
      for (const bad of FORBIDDEN_DOMAINS) {
        expect(content, `${file} references forbidden domain ${bad}`).not.toContain(bad);
      }
    });
  }

  it("page-level canonical / og:url / og:image / JSON-LD URLs use lingoarab.com", () => {
    const offenders: string[] = [];
    const seoAttrPattern =
      /(?:canonical|og:url|og:image|twitter:image|"url"|"@id"|"logo"|"image")[^"'`]*["'`](https?:\/\/[^"'`]+)/gi;

    for (const file of pageFiles) {
      const content = readFileSync(join(PAGES_DIR, file), "utf8");
      let m: RegExpExecArray | null;
      while ((m = seoAttrPattern.exec(content)) !== null) {
        const url = m[1];
        if (!url.includes(EXPECTED_DOMAIN) && !url.includes("schema.org") && !url.includes("googletagmanager") && !url.includes("google-analytics")) {
          offenders.push(`${file}: ${url}`);
        }
      }
    }
    expect(offenders, `Found SEO URLs not on ${EXPECTED_DOMAIN}:\n${offenders.join("\n")}`).toEqual([]);
  });
});

describe("SEO domain consistency — index.html", () => {
  const html = readFileSync(join(ROOT, "index.html"), "utf8");

  it("has no forbidden domains", () => {
    for (const bad of FORBIDDEN_DOMAINS) {
      expect(html).not.toContain(bad);
    }
  });

  it("canonical points to lingoarab.com", () => {
    const m = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (m) expect(m[1]).toContain(EXPECTED_DOMAIN);
  });

  it("og:url points to lingoarab.com", () => {
    const m = html.match(/property=["']og:url["']\s+content=["']([^"']+)["']/i);
    if (m) expect(m[1]).toContain(EXPECTED_DOMAIN);
  });
});

describe("robots.txt", () => {
  const robots = readFileSync(join(ROOT, "public/robots.txt"), "utf8");

  it("Sitemap directive points to lingoarab.com", () => {
    const m = robots.match(/^Sitemap:\s*(\S+)/im);
    expect(m, "robots.txt missing Sitemap directive").not.toBeNull();
    expect(m![1]).toContain(EXPECTED_DOMAIN);
  });

  it("contains no forbidden domains", () => {
    for (const bad of FORBIDDEN_DOMAINS) {
      expect(robots).not.toContain(bad);
    }
  });
});

describe("sitemap.xml", () => {
  const xml = readFileSync(join(ROOT, "public/sitemap.xml"), "utf8");

  it("is well-formed XML (parses without error)", () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const errors = doc.getElementsByTagName("parsererror");
    expect(errors.length, `XML parse error: ${errors[0]?.textContent ?? ""}`).toBe(0);
  });

  it("contains a <urlset> root with at least one <url>", () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    expect(doc.documentElement.nodeName).toBe("urlset");
    expect(doc.getElementsByTagName("url").length).toBeGreaterThan(0);
  });

  it("every <loc> uses lingoarab.com", () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const locs = Array.from(doc.getElementsByTagName("loc")).map((n) => n.textContent ?? "");
    expect(locs.length).toBeGreaterThan(0);
    const bad = locs.filter((u) => !u.includes(EXPECTED_DOMAIN));
    expect(bad, `Non-lingoarab.com loc entries:\n${bad.join("\n")}`).toEqual([]);
  });

  it("every hreflang alternate uses lingoarab.com", () => {
    const urls = extractUrls(xml);
    const bad = urls.filter((u) => !u.includes(EXPECTED_DOMAIN) && !u.includes("sitemaps.org") && !u.includes("w3.org"));
    expect(bad, `Non-lingoarab.com URLs in sitemap:\n${bad.join("\n")}`).toEqual([]);
  });
});
