import { defineConfig } from 'astro/config';

const pages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: pages ? 'https://z4nzib4r.github.io' : 'https://lmnoeng.com',
  base: pages ? '/lmnoeng-preview' : undefined,
});
