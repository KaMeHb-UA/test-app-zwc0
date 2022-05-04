import runner from '../src/runner.js';
import sorter from '../src/providers/sorter.js';
import { strict as assert } from 'assert';

export const name = 'Run with random values';

const lowest = { data: Symbol(), cena: 10 },
    highest = { data: Symbol(), cena: 10000 };

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function generatePrice(){
    return {
        data: `${Math.round(rand(1970, 2022))}-${Math.round(rand(1, 12))}-${Math.round(rand(1, 28))}`,
        cena: rand(lowest.cena + 1, highest.cena - 1),
    };
}

function generateRandIdxs(min, max){
    const lowestIdx = Math.round(rand(min, max));
    let highestIdx = 0;
    while(highestIdx <= lowestIdx) highestIdx = Math.round(rand(min, max));
    return [ lowestIdx, highestIdx ];
}

function fakePrices(){
    const len = 100000;
    const res = new Array(len).fill(undefined).map(() => generatePrice());
    const [ lowestIdx, highestIdx ] = generateRandIdxs(0, len - 1);
    res[lowestIdx] = lowest;
    res[highestIdx] = highest;
    return res;
}

function fakePeriods(){
    return [{ start: 0, end: 0 }];
}

function fakeBalance(){
    return 13_689;
}

export default async () => {
    const res = await runner({
        sorter,
        balance: fakeBalance,
        periods: fakePeriods,
        prices: fakePrices,
    });
    assert.deepEqual(res, {
        buy: lowest.data,
        sell: highest.data,
        // precalculated profit for initial balance of 13 689
        profit: 13_675_311,
        profitPercentage: 99_900,
    });
}
