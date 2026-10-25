// Build: node build.mjs  → dist/devunity-editor.js, .min.js, .css
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { transform } from 'esbuild';

const require = createRequire(import.meta.url);
const src = readFileSync('src/devunity-editor.js', 'utf8');
mkdirSync('dist', { recursive: true });

writeFileSync('dist/devunity-editor.js', src);

const banner = src.match(/^\/\*![\s\S]*?\*\//)[0];
const min = await transform(src, { minify: true, target: 'es2018', legalComments: 'none' });
writeFileSync('dist/devunity-editor.min.js', banner + '\n' + min.code);

const Editor = require('./src/devunity-editor.js');
writeFileSync('dist/devunity-editor.css', '/* DevUnity Editor v' + Editor.version + ' — content + UI styles (also injected automatically by the JS) */\n' + Editor.css + '\n');

console.log('built', Editor.version, (min.code.length / 1024).toFixed(1) + ' KB min');
