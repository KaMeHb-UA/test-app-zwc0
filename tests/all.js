import { readdir } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const skip = ['all.js', 'index.js'];
const files = await readdir(resolve(fileURLToPath(import.meta.url), '..'));
const importable = files.filter(v => !skip.includes(v));

export default await Promise.all(importable.map(file => import('./' + file)));
