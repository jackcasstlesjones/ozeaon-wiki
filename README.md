# OZEAON Wiki

Team process and developer docs for [OZEAON](https://github.com/ozeaon/ozeaon-v2), built with Astro Starlight and deployed to GitHub Pages on push to `main`.

The site is split into three sidebar topics with [starlight-sidebar-topics](https://github.com/HiDeoo/starlight-sidebar-topics), configured in `astro.config.mjs`:

- **Team Process**: how work moves through the team, for everyone. Pages live in `src/content/docs/process/`, and the sidebar autogenerates from that folder, sorted by each page's `sidebar.order`.
- **Roadmap**: every planned feature in priority order, one page each. Pages live in `src/content/docs/roadmap/`, one folder per stage, and the sidebar order is in `src/roadmap-sidebar.json`. Add new item pages there, in priority order, and update the overview table in `roadmap/index.mdx`.
- **Developer Docs**: the codebase. Pages live in the other folders under `src/content/docs/`, and the sidebar order is in `src/sidebar.json`. Most sections autogenerate from their folder and sort by each page's `sidebar.order`. The Components section lists its top-level pages explicitly in `src/sidebar.json`, so add new component pages there (their `sidebar.order` is ignored).

- `pnpm dev`: run locally
- `pnpm build`: build to `dist/`
