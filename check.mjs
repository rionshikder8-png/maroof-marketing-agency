// Validation: every internal link/asset resolves, titles/descriptions unique, no emoji/fake claims.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const htmls = walk('dist').filter(f => f.endsWith('.html'));
let errors = 0; const titles = new Set(), descs = new Set();
const bad = m => { console.error('FAIL:', m); errors++; };
for (const f of htmls) {
  const h = readFileSync(f, 'utf8');
  const t = (h.match(/<title>(.*?)<\/title>/) || [])[1]; if (!t) bad(f + ' no title'); else if (titles.has(t)) bad('dup title ' + t); titles.add(t);
  if (!f.endsWith('404.html')) { const d = (h.match(/name="description" content="(.*?)"/) || [])[1]; if (!d) bad(f + ' no description'); else if (descs.has(d)) bad('dup desc'); descs.add(d); }
  if ((h.match(/<h1[ >]/g) || []).length !== 1) bad(f + ' h1 count');
  if (/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u.test(h)) bad(f + ' contains emoji');
  for (const m of h.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const p = m[1]; const fp = join('dist', p);
    if (!(existsSync(fp) && (statSync(fp).isFile() || existsSync(join(fp, 'index.html'))))) bad(`${f} -> broken ${p}`);
  }
  for (const m of h.matchAll(/href="(\/[^"]*#([^"]+))"/g)) { const pg = m[1].split('#')[0] || '/'; const tgt = join('dist', pg, pg.endsWith('.html') ? '' : 'index.html'); if (existsSync(tgt) && !readFileSync(tgt, 'utf8').includes(`id="${m[2]}"`)) bad(`${f} anchor #${m[2]} missing on ${pg}`); }
  for (const m of h.matchAll(/wa\.me\/(\d+)/g)) if (m[1] !== '923190482228') bad('wrong WA number ' + m[1]);
}
console.log(`Checked ${htmls.length} HTML files; ${errors} problem(s).`);
process.exit(errors ? 1 : 0);
