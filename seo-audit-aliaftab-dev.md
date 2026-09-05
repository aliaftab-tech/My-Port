# SEO & GEO Audit Brief: aliaftab.dev
**Score: 85% (Grade B)** · Checked: 4 Sept 2026

Agent instructions: fix every issue listed below. Work through the priority fixes first, then the failing checks by category. Do not change items listed under "Passing".

## Priority fixes

1. **[Severe] Canonical URL matches served URL** — Found: https://aliaftab.dev/  Expected: https://www.aliaftab.dev/
   Fix: Ensure the canonical href exactly matches the final URL including protocol, www/non-www, and trailing slash preference.

2. **[Severe] `Organization` (or subtype) schema present**
   Example:
```
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.example.com/#organization",
  "name": "Example Co",
  "url": "https://www.example.com/",
  "sameAs": ["https://www.linkedin.com/company/example"]
}
```

3. **[Medium] Organization schema has `name`, `url`, `address`, `sameAs`**
   Example:
```
{
  "@type": "Organization",
  "name": "Example Co",
  "url": "https://www.example.com/",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Vienna",
    "addressCountry": "AT"
  },
  "sameAs": [
    "https://www.linkedin.com/company/example",
    "https://www.wikidata.org/wiki/Q..."
  ]
}
```

4. **[Medium] All `<img>` tags have `width` and `height` attributes**
   Fix: Add `width` and `height` attributes matching the image's intrinsic size. Use CSS to control display size.
   Example:
```
<img src="hero.webp" width="1200" height="600" alt="Dashboard screenshot" />
```

5. **[Medium] `X-Content-Type-Options: nosniff`**
   Example:
```
# Nginx
add_header X-Content-Type-Options "nosniff" always;
```

6. **[Medium] `X-Frame-Options` present**
   Example:
```
add_header X-Frame-Options "SAMEORIGIN" always;
```

7. **[Medium] `Content-Security-Policy` present**

8. **[Medium] Referenced in `<head>` with `<link rel="alternate" type="text/plain">`**
   Example:
```
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
```

9. **[Medium] `/.well-known/security.txt` (or `/security.txt`) exists**

10. **[Medium] Page has question-format headings (how/what/why)**
   Fix: Rewrite section headings as questions. "Our Approach" → "How Does Our SEO Process Work?"

11. **[Medium] `<link rel="alternate" type="text/plain" href="/llms.txt">` in `<head>`**
   Example:
```
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
```

12. **[Medium] `AggregateRating` schema present** — No review content detected
   Example:
```
{
  "@type": "Product",
  "name": "Example Service",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "124",
    "bestRating": "5"
  }
}
```

## Failing checks by category

### HTTPS & Canonical (WARN — 73%)

- **Canonical URL matches served URL** — Found: https://aliaftab.dev/  Expected: https://www.aliaftab.dev/ [Severe]
  Fix: Ensure the canonical href exactly matches the final URL including protocol, www/non-www, and trailing slash preference.

### Structured Data / Schema.org (JSON-LD) (WARN — 69%)

- **`Organization` (or subtype) schema present** [Severe]
  Example:
  ```
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.example.com/#organization",
    "name": "Example Co",
    "url": "https://www.example.com/",
    "sameAs": ["https://www.linkedin.com/company/example"]
  }
  ```
- **Organization schema has `name`, `url`, `address`, `sameAs`** [Medium]
  Example:
  ```
  {
    "@type": "Organization",
    "name": "Example Co",
    "url": "https://www.example.com/",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Vienna",
      "addressCountry": "AT"
    },
    "sameAs": [
      "https://www.linkedin.com/company/example",
      "https://www.wikidata.org/wiki/Q..."
    ]
  }
  ```

### Image Handling (WARN — 86%)

- **All `<img>` tags have `width` and `height` attributes** [Medium]
  Fix: Add `width` and `height` attributes matching the image's intrinsic size. Use CSS to control display size.
  Example:
  ```
  <img src="hero.webp" width="1200" height="600" alt="Dashboard screenshot" />
  ```

### Favicons & Web App Manifest (WARN — 50%)

- **`apple-touch-icon` linked** [Low]
  Example:
  ```
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  ```
- **`<link rel="manifest">` present** [Low]
  Example:
  ```
  <link rel="manifest" href="/manifest.json" />
  ```
- **Manifest URL is reachable** [Low]

### Hreflang / Internationalisation (WARN — 83%)

- **`hreflang` tags present (multilingual)** [Low]
  Example:
  ```
  <link rel="alternate" hreflang="en-gb" href="https://example.com/en-gb/page/" />
  <link rel="alternate" hreflang="de" href="https://example.com/de/page/" />
  <link rel="alternate" hreflang="x-default" href="https://example.com/page/" />
  ```

### Security Headers (FAIL — 27%)

- **`X-Content-Type-Options: nosniff`** [Medium]
  Example:
  ```
  # Nginx
  add_header X-Content-Type-Options "nosniff" always;
  ```
- **`X-Frame-Options` present** [Medium]
  Example:
  ```
  add_header X-Frame-Options "SAMEORIGIN" always;
  ```
- **`Referrer-Policy` present** [Low]
  Example:
  ```
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  ```
- **`Permissions-Policy` present** [Low]
  Example:
  ```
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
  ```
- **`Content-Security-Policy` present** [Medium]

### llms.txt (GEO) (WARN — 78%)

- **Referenced in `<head>` with `<link rel="alternate" type="text/plain">`** [Medium]
  Example:
  ```
  <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
  ```

### security.txt (FAIL — 0%)

- **`/.well-known/security.txt` (or `/security.txt`) exists** [Medium]
- **`Contact:` field present** [Low]
  Example:
  ```
  Contact: mailto:security@example.com
  ```
- **`Expires:` field present and in the future** [Low]
  Example:
  ```
  Expires: 2027-01-01T00:00:00.000Z
  ```
- **`Canonical:` field present** [Low]
  Example:
  ```
  Canonical: https://www.example.com/.well-known/security.txt
  ```

### GEO: Structured Data for AI (JSON-LD Quality) (WARN — 50%)

- **`sameAs` array on Organization schema** [Low]
  Example:
  ```
  "sameAs": [
    "https://www.linkedin.com/company/example",
    "https://www.wikidata.org/wiki/Q..."
  ]
  ```
- **`knowsAbout` array present on org schema** [Low]
  Example:
  ```
  "knowsAbout": [
    "Search Engine Optimisation",
    "Generative Engine Optimisation",
    "Technical SEO",
    "Structured Data"
  ]
  ```
- **`hasOfferCatalog` or `makesOffer` present** [Low]
  Example:
  ```
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "SEO & GEO Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Technical SEO Audit" } }
    ]
  }
  ```

### GEO: Content Structure for AI Citability (WARN — 78%)

- **Page has question-format headings (how/what/why)** [Medium]
  Fix: Rewrite section headings as questions. "Our Approach" → "How Does Our SEO Process Work?"

### GEO: AI-Intent Meta & Head Signals (WARN — 80%)

- **`<link rel="alternate" type="text/plain" href="/llms.txt">` in `<head>`** [Medium]
  Example:
  ```
  <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
  ```

### Review / Rating Schema (FAIL — 0%)

- **`AggregateRating` schema present** — No review content detected [Medium]
  Example:
  ```
  {
    "@type": "Product",
    "name": "Example Service",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "124",
      "bestRating": "5"
    }
  }
  ```

## Passing (no changes needed)

Title Tags · Meta Description · Open Graph Tags · Twitter / X Card · Robots Meta Tag · Analytics / Consent Mode · Heading Hierarchy & Accessibility · Noindex Strategy · Internal Linking & Crawlability · URL Structure · 404 Page · Cache Headers · Sitemap · robots.txt · GEO: AI Bot Permissions · Breadcrumb Schema · Blog / Content Architecture · Performance Signals · AI Content Detection · Event Schema · Video Schema · AI Agent Accessibility

## PageSpeed Insights (mobile)

Performance: 88 · Accessibility: 91 · Best Practices: 100 · SEO: 100

## Email & DNS (informational — not scored)

- **`/humans.txt` exists**
- **File identifies at least one team member or creator**
- **`https://mta-sts.{domain}/.well-known/mta-sts.txt` exists**
- **`mode: enforce` set (not `testing`)**
- **`_mta-sts.{domain}` DNS TXT record present**
- **`max_age` field present**
- **DKIM record found at a common selector**
- **DKIM record contains a valid public key (`p=`)**
- **Policy is `p=quarantine` or `p=reject` (not `p=none`)** — Policy: p=none
- **Reporting address (`rua=`) configured**
