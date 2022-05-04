import prices from '@/providers/prices';
import periods from '@/providers/periods';
import sorter from '@/providers/sorter';
import balance from '@/providers/balance';
import runner from '@/runner';
import { stdout } from 'process';

// with carriage return to rewrite this line when results have been got
await new Promise(r => stdout.write('Loading gold prices...\r', r));

const { buy, sell, profit, profitPercentage } = await runner({
    prices,
    periods,
    sorter,
    balance,
});

function round(num){
    return Math.round(num * 100) / 100
}

if(buy === undefined){
    console.log('Sadly, but there was no good moment to invest. Just keep your money. Or buy some coffe :)');
} else {
    console.log([
        `The best moment to buy gold was ${buy} and to sell - ${sell}.`,
        `Having initial credit of ${balance()} PLN you could got ~${round(profit)} PLN more (~${round(profitPercentage)}% of initial).`
    ].join('\n'));
}
