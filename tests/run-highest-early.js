import runner from '../src/runner.js';
import sorter from '../src/providers/sorter.js';
import { strict as assert } from 'assert';

export const name = 'Run with early highest value (before the lowest one)';

const testData = [
    { data: '2013-01-01', cena: 11 },
    { data: '2013-01-02', cena: 111 },
    { data: '2013-01-03', cena: 10 },
    { data: '2013-01-04', cena: 109.999 },
    { data: '2013-01-05', cena: 110 },
];

function fakePrices(){
    return testData;
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
        buy: '2013-01-03',
        sell: '2013-01-05',
        // precalculated profit for initial balance of 13 689
        profit: 136_890,
        profitPercentage: 1_000,
    });
}
