// Exports OpenDeepWiki's generated pages into Starlight content + sidebar order.
// Usage: node scripts/export-wiki.mjs [path/to/opendeepwiki.db]
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

const dbPath = process.argv[2] ?? join(homedir(), "tandemhub/OpenDeepWiki/data/opendeepwiki.db");
const sourceBase = "https://github.com/ozeaon/ozeaon-v2/blob";
const docsDir = "src/content/docs";

const db = new DatabaseSync(dbPath, { readOnly: true });
const catalogs = db
  .prepare(
    `SELECT c.Id AS id, c.ParentId AS parentId, c.Title AS title, c.Path AS path, c."Order" AS ord, f.Content AS content
     FROM DocCatalogs c LEFT JOIN DocFiles f ON f.Id = c.DocFileId AND f.IsDeleted = 0
     WHERE c.IsDeleted = 0
     ORDER BY c."Order"`,
  )
  .all();
const { LastCommitId: commit } = db
  .prepare(`SELECT LastCommitId FROM RepositoryBranches WHERE IsDeleted = 0 LIMIT 1`)
  .get();

const rewriteLinks = (md) =>
  md.replace(/\]\((?!https?:|#|mailto:)(?:\.\.\/|\.\/|\/)*([^)\s]+)\)/g, `](${sourceBase}/${commit}/$1)`);

const stripTitle = (md) => md.replace(/^\s*#\s+.*\n+/, "");

for (const entry of readdirSync(docsDir, { withFileTypes: true })) {
  if (entry.isDirectory()) rmSync(join(docsDir, entry.name), { recursive: true, force: true });
}

const sections = catalogs.filter((c) => !c.parentId);
for (const page of catalogs.filter((c) => c.parentId && c.content)) {
  const file = join(docsDir, `${page.path}.md`);
  mkdirSync(dirname(file), { recursive: true });
  const frontmatter = `---\ntitle: ${JSON.stringify(page.title)}\nsidebar:\n  order: ${page.ord}\n---\n\n`;
  writeFileSync(file, frontmatter + rewriteLinks(stripTitle(page.content)));
}

const sidebar = sections.map((s) => ({ label: s.title, items: [{ autogenerate: { directory: s.path } }] }));
writeFileSync("src/sidebar.json", JSON.stringify(sidebar, null, 2) + "\n");
console.log(`Exported ${catalogs.length - sections.length} pages in ${sections.length} sections @ ${commit}`);
