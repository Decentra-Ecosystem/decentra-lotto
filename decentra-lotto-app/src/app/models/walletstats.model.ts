import {TOKEN_DECIMALS, BNB_DECIMALS} from './meta-mask.dictionary';
import { StakingStats } from './stakingstats.model';

class WalletStats {
    static round(amount: number, tokenDecimals: number, accuracy: number): number {
        accuracy = Math.pow(10, accuracy);
        return Math.round( amount/(Math.pow(10, tokenDecimals)) * accuracy ) / accuracy;
    }

    walletDrawSpendBNB: number;
    numTickets: number;
    walletTotalSpendBNB: number;
    walletTotalTicketsPurchased: number;
    walletTotalWins: number;
    walletTotalWinValueLep: number;
    walletChance: number;
    walletDELOBalance: number;
    walletDELOBalanceRaw: number;
    stakingStats: StakingStats;

    constructor(
        obj: any
    ) {
        this.walletDrawSpendBNB = parseFloat(WalletStats.round(obj[0], BNB_DECIMALS, 5).toFixed(2));
        this.numTickets = obj[1];
        this.walletTotalSpendBNB = parseFloat(WalletStats.round(obj[2], BNB_DECIMALS, 5).toFixed(2));
        this.walletTotalTicketsPurchased = obj[3];
        this.walletTotalWins = obj[4];
        this.walletTotalWinValueLep = parseFloat(WalletStats.round(obj[5], TOKEN_DECIMALS, 5).toFixed(2));
    }
}

export { WalletStats }
