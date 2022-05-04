// @ts-check
import { build, analyzeMetafile } from 'esbuild';
import { cwd, exit } from 'process';
import { relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import pkgJson from './package.json' assert { type: 'json' };
import { writeFile } from 'fs/promises';

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

const distPackageJson = {
    private: true,
    type: 'module',
};

async function writePkgJson(){
    const target = resolve(buildConfig.outfile, '..', 'package.json');
    const pkgJSON = Buffer.from(JSON.stringify(distPackageJson), 'utf8');
    await writeFile(target, pkgJSON);
    const from = '[[runtime]]';
    return {
        metafile: {
            inputs: {
                [from]: {
                    bytes: 0,
                    imports: [],
                },
            },
            outputs: {
                [relative(cwd(), target)]: {
                    imports: [],
                    exports: [],
                    entryPoint: from,
                    inputs: {
                        [from]: {
                            bytesInOutput: pkgJSON.length,
                        },
                    },
                    bytes: pkgJSON.length,
                },
            },
        },
    };
}

try{
    const result = build(buildConfig);
    const distPkgJsonResult = await writePkgJson();
    const metafile = JSON.parse(JSON.stringify((await result).metafile));
    Object.assign(metafile.inputs, distPkgJsonResult.metafile.inputs);
    Object.assign(metafile.outputs, distPkgJsonResult.metafile.outputs);
    console.log(await analyzeMetafile(metafile));
} catch(e){
    exit(1);
}
