import sorter from '../src/providers/sorter.js';
import { strict as assert } from 'assert';

export const name = 'Sorter';

const testData = [
    { data: '2013-01-01', cena: 111 },
    { data: '2013-01-02', cena: 111 }, // same price, should go after the first occurrence
    { data: '2013-01-03', cena: 110 },
    { data: '2013-01-04', cena: 109.999 },
    { data: '2013-01-05', cena: -9999 },
    { data: '2013-01-05', cena: -9998 }, // same date, just for test
];

export default () => {
    const sorted = testData.sort(sorter);
    assert.equal(sorted[0].data, '2013-01-05', 'below-zero price values is not supported?');
    assert.equal(sorted[1].data, '2013-01-05', 'same date is not supported?');
    assert.equal(sorted[2].data, '2013-01-04');
    assert.equal(sorted[3].data, '2013-01-03');
    assert.equal(sorted[4].data, '2013-01-01', 'first occurrence of same price should go first');
    assert.equal(sorted[5].data, '2013-01-02');
}
