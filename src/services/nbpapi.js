import { request } from 'http';
import { Buffer } from 'buffer';

const prefix = 'http://api.nbp.pl/api/';
const headers = {
    'Accept': 'application/json',
};

function generateUrl(method, mapper){
    for(const key in mapper){
        method = method.replace(`{${key}}`, encodeURIComponent(mapper[key]));
    }
    return method;
}

function get(url){
    return new Promise((resolve, reject) => {
        const req = request(url, { headers }, res => {
            const data = [];
            function onData(chunk){
                data.push(chunk);
            }
            res.on('data', onData);
            res.once('error', e => {
                res.off('data', onData);
                reject(e);
            });
            res.once('end', () => {
                res.off('data', onData);
                resolve(Buffer.concat(data).toString('utf8'));
            });
        });
        req.once('error', reject);
        req.end();
    });
}

/**
 * Makes an HTTP GET request to NBP Web API
 *
 * @arg {string} method
 * @arg {{[x: string]: string | number | boolean}} mapper
 * 
 * @example
 * ```js
 * const top5 = await nbpApi("exchangerates/tables/{table}/last/{topCount}/", {
 *     table: 'A',
 *     topCount: 5,
 * });
 * ```
 */
export default async (method, mapper) => JSON.parse(await get(prefix + generateUrl(method, mapper)));
