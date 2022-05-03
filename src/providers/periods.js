/**
 * Returns a 1-year periods for last 5 years
 *
 * @return {{ start: string | number | Date, end: string | number | Date }[]}
 */
export default () => {
    const now = Date.now(); // here we're preserving current datetime to make it possible to run this script even in 23:59:59
    const res = [];
    for(let i = 0; i < 5; i++){
        const end = new Date(now);
        end.setUTCFullYear(end.getUTCFullYear() - i);
        const start = new Date(now);
        start.setUTCFullYear(end.getUTCFullYear() - 1);
        res.push({ start, end });
    }
    return res;
};
