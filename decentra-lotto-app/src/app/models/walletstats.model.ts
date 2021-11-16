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
    walletCharityTickets: number;
    walletTotalWins: number;
    walletTotalWinValueDELO: number;
    walletChance: number;
    walletDELOBalance: number;
    walletDELOBalanceRaw: number;
    stakingStats: StakingStats;
    walletTotalCharityTickets: number;
    totalAirdropsReceived: number;

    constructor(
        obj: any
    ) {
        this.walletDrawSpendBNB = parseFloat(WalletStats.round(obj[0], BNB_DECIMALS, 5).toFixed(2));
        this.numTickets = obj[1];
        //this.walletCharityTickets = obj[2];
        //this.walletTotalSpendBNB = parseFloat(WalletStats.round(obj[3], BNB_DECIMALS, 5).toFixed(2));
        this.walletTotalTicketsPurchased = obj[2];
        this.walletTotalWins = obj[3];
        this.walletTotalWinValueDELO = parseFloat(WalletStats.round(obj[4], TOKEN_DECIMALS, 5).toFixed(2));
        this.walletTotalCharityTickets = obj[5];
        this.totalAirdropsReceived = parseFloat(WalletStats.round(obj[6], TOKEN_DECIMALS, 5).toFixed(2));
    }
}

export { WalletStats }
