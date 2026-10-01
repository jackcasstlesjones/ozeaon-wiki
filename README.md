# OZEAON Developer Wiki

Docs for the [OZEAON codebase](https://github.com/ozeaon/ozeaon-v2), built with Astro Starlight and deployed to GitHub Pages on push to `main`.

Pages live in `src/content/docs/` and the sidebar order in `src/sidebar.json`. Edit both by hand. Most sections autogenerate from their folder and sort by each page's `sidebar.order`. The Components section lists its top-level pages explicitly in `src/sidebar.json`, so add new component pages there (their `sidebar.order` is ignored).

- `pnpm dev`: run locally
- `pnpm build`: build to `dist/`
