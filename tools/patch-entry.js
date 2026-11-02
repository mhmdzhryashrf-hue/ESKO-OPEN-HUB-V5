'use strict';
const fs = require('node:fs');
const path = require('node:path');
const file = process.argv[2];
const moduleDir = process.argv[3];
if (!file || !moduleDir) throw new Error('Usage: node patch-entry.js <index.html> <relative-module-directory>');
let html = fs.readFileSync(file, 'utf8');
const rel = moduleDir.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/$/, '');
if (!html.includes('ESKO_V5_FEATURES_START')) {
  const headTags = `\n<!-- ESKO_V5_FEATURES_START -->\n<link id="esko-v5-style" rel="stylesheet" href="${rel}/esko-v5.css">\n<!-- ESKO_V5_FEATURES_END -->\n`;
  if (/<\/head\s*>/i.test(html)) html = html.replace(/<\/head\s*>/i, headTags + '</head>');
  else if (/<body[^>]*>/i.test(html)) html = html.replace(/<body[^>]*>/i, match => match + headTags);
  else throw new Error('No <head> or <body> tag found; entrypoint left unchanged.');
}
if (!html.includes('ESKO_V5_SCRIPTS_START')) {
  const bodyTags = `\n<!-- ESKO_V5_SCRIPTS_START -->\n<script id="esko-v5-config" src="${rel}/config.js"></script>\n<script id="esko-v5-script" defer src="${rel}/esko-v5.js"></script>\n<!-- ESKO_V5_SCRIPTS_END -->\n`;
  if (/<\/body\s*>/i.test(html)) html = html.replace(/<\/body\s*>/i, bodyTags + '</body>');
  else throw new Error('No </body> tag found; entrypoint left unchanged.');
}
const temp = `${file}.esko-v5.tmp`;
fs.writeFileSync(temp, html, 'utf8');
fs.renameSync(temp, file);
console.log(`Patched: ${path.resolve(file)}`);
