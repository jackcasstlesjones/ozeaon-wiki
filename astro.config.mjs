// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import sidebar from './src/sidebar.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
	site: 'https://jackcasstlesjones.github.io',
	base: '/ozeaon-wiki',
	integrations: [
		mermaid({ autoTheme: true }),
		starlight({
			title: 'OZEAON Developer Wiki',
			logo: { src: './src/assets/ozeaon-logo.svg' },
			favicon: '/favicon.svg',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/ozeaon/ozeaon-v2' }],
			plugins: [
				starlightSidebarTopics([
					{ label: 'Developer Docs', link: '/overview/project-overview/', icon: 'laptop', items: sidebar },
					{ label: 'Team Process', link: '/process/', icon: 'open-book', items: [{ autogenerate: { directory: 'process' } }] },
				]),
			],
			customCss: ['./src/styles/custom.css'],
		}),
	],
});
