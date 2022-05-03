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
export default async ({ prices, periods, sorter, balance }) => {
    const requests = [];
    for(const { start, end } of periods()) requests.push(prices(start, end));
    const series = [].concat(...await Promise.all(requests)).sort(sorter);
    const lowest = series[0];
    const highest = series[series.length - 1];
    const initialBalance = balance();
    const profit = (initialBalance / lowest.cena) * highest.cena - initialBalance;
    return {
        buy: lowest.data,
        sell: highest.data,
        profit,
        profitPercentage: profit / initialBalance * 100,
    }
}
