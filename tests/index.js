import { stdout, stderr, exit } from 'process';
import rawTests from './all.js';

function createTest(name, func){
    const res = async () => {
        const start = Date.now();
        try{
            await func();
            return {
                result: Date.now() - start,
                name,
            };
        } catch(error){
            return {
                error,
                result: Date.now() - start,
                name,
            };
        }
    };
    Object.defineProperty(res, 'name', { value: name });
    return res;
}

const tests = [];

for(const test of rawTests){
    tests.push(createTest(test.name, test.default));
}

function promisify(func){
    return (...args) => new Promise(r => func(...args, r));
}

async function clearConsole(rows){
    // we should await every operation on Windows. On POSIX they're entirely synchronous
    const cursorTo = promisify(stdout.cursorTo.bind(stdout));
    const moveCursor = promisify(stdout.moveCursor.bind(stdout));
    const clearScreenDown = promisify(stdout.clearScreenDown.bind(stdout));
    await cursorTo(0);
    await moveCursor(0, -1 * rows);
    await clearScreenDown();
}

async function log(stream, data){
    await promisify(stream.write.bind(stream))(`\r${data}\n`);
}

let currentPSymI = 0;
const progressSymbols = '⣷⣯⣟⡿⢿⣻⣽⣾';
let progressSymbol = '⏳';
const doneSymbol = '✅';
const errorSymbol = '❌';
const printingQueue = new Set();

async function printTable(cleanup = true){
    await Promise.all(printingQueue);
    if(cleanup) await clearConsole(tests.length);
    for(const test of tests){
        if(typeof test.then === 'function'){
            await log(stdout, `${progressSymbol} ${test.name}...`);
        } else if(typeof test.error !== 'undefined'){
            await log(stdout, `${errorSymbol} ${test.name} failed in ${test.result}ms`);
            await log(stderr, test.error.stack);
            exit(1);
        } else {
            await log(stdout, `${doneSymbol} ${test.name} done in ${test.result}ms`);
        }
    }
}

// run all tests simultaneously
for(let i = 0; i < tests.length; i++){
    const { name } = tests[i];
    tests[i] = tests[i]();
    tests[i].name = name;
    tests[i].then(async v => {
        tests[i] = v;
        const printing = printTable();
        printingQueue.add(printing);
        await printing;
        printingQueue.delete(printing);
    });
}

printTable(false);

function nextProgressSymbol(){
    if(++currentPSymI == progressSymbols.length) currentPSymI = 0;
    return progressSymbols[currentPSymI];
}

setInterval(() => {
    progressSymbol = nextProgressSymbol();
    printTable();
}, 100);

await Promise.all(tests).then(async () => {
    await printTable();
    exit(0);
});
