import runner from '../src/runner.js';
import sorter from '../src/providers/sorter.js';
import { strict as assert } from 'assert';

export const name = 'Run with no investment variant (gold price is always falling)';

const testData = [
    { data: '2013-01-01', cena: 1000 },
    { data: '2013-01-02', cena: 768 },
    { data: '2013-01-03', cena: 455 },
    { data: '2013-01-04', cena: 109.999 },
    { data: '2013-01-05', cena: 100 },
    { data: '2013-01-06', cena: 13 },
];

function fakePrices(){
    return testData;
}

function fakePeriods(){
    return [{ start: 0, end: 0 }];
}

function fakeBalance(){
    return 100_000;
}

export default async () => {
    const res = await runner({
        sorter,
        balance: fakeBalance,
        periods: fakePeriods,
        prices: fakePrices,
    });
    assert.deepEqual(res, {
        buy: undefined,
        sell: undefined,
        profit: 0,
        profitPercentage: 0,
    });
}
