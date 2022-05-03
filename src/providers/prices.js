import nbpapi from '@/services/nbpapi';

const endpoint = 'cenyzlota/{start}/{end}/';

function formatDate(dateOrNumber){
    const date = new Date(dateOrNumber);
    return `${
        date.getUTCFullYear()
    }-${
        (date.getUTCMonth() + 1).toString().padStart(2, '0')
    }-${
        date.getUTCDate().toString().padStart(2, '0')
    }`;
}

/**
 * Gets historical series of gold prices published from `start` to `end` date
 *
 * @arg {string | number | Date} start
 * @arg {string | number | Date} end
 * @return {Promise<{data: string, cena: number}[]>}
 */
export default (start, end) => nbpapi(endpoint, {
    start: formatDate(start),
    end: formatDate(end),
});
