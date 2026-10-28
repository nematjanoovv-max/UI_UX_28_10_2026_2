#!/usr/bin/env node
// Smoke-check every site folder: required meta, local assets exist, no empty hrefs.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const sites = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d{2}_/.test(d.name))
  .map((d) => d.name)
  .sort();

let failed = 0;
for (const site of sites) {
  const dir = join(root, site);
  const file = join(dir, "index.html");
  if (!existsSync(file)) {
    console.error(`FAIL ${site}: missing index.html`);
    failed++;
    continue;
  }
  const html = readFileSync(file, "utf8");
  const errors = [];
  if (!/<title>[^<]{3,}<\/title>/.test(html)) errors.push("missing title");
  if (!/name="viewport"/.test(html)) errors.push("missing viewport");
  if (!/lang="[a-z]{2}"/.test(html)) errors.push("missing lang");
  if (/href="#"/.test(html)) errors.push('empty href="#"');
  const local = [...html.matchAll(/(?:src|href)="((?!https?:|#|data:|mailto:|tel:)[^"]+)"/g)].map((m) => m[1]);
  for (const rel of new Set(local)) {
    if (!existsSync(join(dir, rel.split("?")[0]))) errors.push(`missing ${rel}`);
  }
  if (errors.length) {
    console.error(`FAIL ${site}: ${errors.join(", ")}`);
    failed++;
  } else {
    console.log(`ok   ${site} (${(html.length / 1024).toFixed(0)} kB)`);
  }
}
console.log(failed ? `\n${failed} site(s) failed` : `\nAll ${sites.length} site(s) passed`);
process.exit(failed ? 1 : 0);
