import prices from '@/providers/prices';
import periods from '@/providers/periods';
import sorter from '@/providers/sorter';
import balance from '@/providers/balance';
import runner from '@/runner';

console.log('Loading gold prices...');

const { buy, sell, profit, profitPercentage } = await runner({
    prices,
    periods,
    sorter,
    balance,
});

function round(num){
    return Math.round(num * 100) / 100
}

console.log(`
The best moment to buy gold was ${buy} and to sell - ${sell}.
Having initial credit of ${balance()} PLN you could got ~${round(profit)} PLN more (~${round(profitPercentage)}% of initial).
`);
