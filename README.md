# LMNO Engineering homepage redesign (concept)

A modern, front-end-only redesign of the [lmnoeng.com](https://lmnoeng.com) homepage, built with [Astro](https://astro.build).

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview
```

## What's on the page

| Section | Notes |
| --- | --- |
| Header | Sticky, turns frosted on scroll, mobile menu, `/` shortcut focuses calculator search |
| Hero | Value proposition plus a **working Manning's equation calculator** (rectangular channel, SI/US toggle, animated cross-section, Froude number and flow regime) |
| Calculator library | Eight discipline cards with live client-side search |
| Popular calculators | Most-used tools with their governing equations |
| Consulting | Services grid and a three-step engagement process |
| Why LMNO | Brand pillars plus a sample "calculation report" card |
| Contact | Project inquiry form (demo only, not connected to a backend) |
| Footer | Sitemap and disclaimer |

## Structure

```
src/
  pages/index.astro          # composes the homepage
  layouts/Base.astro         # <head>, fonts, scroll-reveal
  components/                # one component per section
  data/calculators.ts        # calculator categories and popular list
  styles/global.css          # design tokens and shared utilities
```

No UI framework or CSS library is used. Styles are scoped Astro CSS, and the interactive bits are small vanilla TypeScript scripts.

## Before showing the client

- Contact details in `Contact.astro` are placeholders (`[email address]`, `[phone number]`, `[office address]`).
- Calculator links are `#` placeholders. Map them to the live calculator URLs.
- Check the calculator names and categories in `src/data/calculators.ts` against the current site.
