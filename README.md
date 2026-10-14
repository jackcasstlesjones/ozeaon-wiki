# OZEAON Wiki

Team process and developer docs for [OZEAON](https://github.com/ozeaon/ozeaon-v2), built with Astro Starlight and deployed to GitHub Pages on push to `main`.

The site is split into two sidebar topics with [starlight-sidebar-topics](https://github.com/HiDeoo/starlight-sidebar-topics), configured in `astro.config.mjs`:

- **Team Process**: how work moves through the team, for everyone. Pages live in `src/content/docs/process/`, and the sidebar autogenerates from that folder, sorted by each page's `sidebar.order`.
- **Developer Docs**: the codebase. Pages live in the other folders under `src/content/docs/`, and the sidebar order is in `src/sidebar.json`. Most sections autogenerate from their folder and sort by each page's `sidebar.order`. The Components section lists its top-level pages explicitly in `src/sidebar.json`, so add new component pages there (their `sidebar.order` is ignored).

- `pnpm dev`: run locally
- `pnpm build`: build to `dist/`
