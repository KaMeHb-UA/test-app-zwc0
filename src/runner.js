function fakePeriods(){
    return [{ start: 0, end: 0 }];
}

/**
 * Runs the main process with given providers
 *
 * @arg {{
 *   prices: typeof import('@/providers/prices').default,
 *   periods: typeof import('@/providers/periods').default,
 *   sorter: typeof import('@/providers/sorter').default,
 *   balance: typeof import('@/providers/balance').default,
 * }} providers
 */
export default async function runner({ prices, periods, sorter, balance }){
    const requests = [];
    for(const { start, end } of periods()) requests.push(prices(start, end));
    const series = [].concat(...await Promise.all(requests)).sort(sorter);
    if(!series.length) return {
        buy: undefined,
        sell: undefined,
        profit: 0,
        profitPercentage: 0,
    };
    const lowest = series[0];
    const highest = series[series.length - 1];
    if(new Date(lowest.data) >= new Date(highest.data)){
        const [ variant1, variant2 ] = await Promise.all([
            runner({
                prices: async () => series.slice(1),
                periods: fakePeriods,
                sorter,
                balance,
            }),
            runner({
                prices: async () => series.slice(0, -1),
                periods: fakePeriods,
                sorter,
                balance,
            }),
        ]);
        if(variant1.profit >= variant2.profit) return variant1;
        return variant2;
    }
    const initialBalance = balance();
    const profit = (initialBalance / lowest.cena) * highest.cena - initialBalance;
    return {
        buy: lowest.data,
        sell: highest.data,
        profit,
        profitPercentage: profit / initialBalance * 100,
    }
}
