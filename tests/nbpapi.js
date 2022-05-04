import nbpapi from '../src/services/nbpapi.js';
import { strict as assert } from 'assert';

export const name = 'NBP API';

export default async () => {
    const res = await nbpapi('cenyzlota/{start}/{end}/', {
        start: '2013-01-01',
        end: '2013-01-31',
    });
    assert.equal(res[0].data, '2013-01-02', 'start date is incorrect');
    assert.equal(res[res.length - 1].data, '2013-01-31', 'end date is incorrect');
}
