/**
 * Concatenate Tailwind build output + styles.css → site.css (one render-blocking stylesheet).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const out = resolve(root, 'site.css');
const tw = readFileSync(resolve(root, '.tailwind-out.css'));
const styles = readFileSync(resolve(root, 'styles.css'));
writeFileSync(out, Buffer.concat([tw, Buffer.from('\n'), styles]));
