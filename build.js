// @ts-check
import { build, analyzeMetafile } from 'esbuild';
import { exit } from 'process';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import pkgJson from './package.json' assert { type: 'json' };

const dirname = resolve(fileURLToPath(import.meta.url), '..'),
    { module: entryPoint, distFile } = pkgJson;

/** @type {import('esbuild').BuildOptions} */
const buildConfig = {
    entryPoints: [ resolve(dirname, entryPoint) ],
    bundle: true,
    outfile: resolve(dirname, distFile),
    sourcemap: true,
    allowOverwrite: true,
    minify: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    platform: 'node',
    format: 'esm',
    metafile: true,
    legalComments: 'none',
};

try{
    const result = await build(buildConfig);
    console.log(await analyzeMetafile(result.metafile));
} catch(e){
    exit(1);
}
