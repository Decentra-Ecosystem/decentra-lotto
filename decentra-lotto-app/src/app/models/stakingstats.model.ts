import {TOKEN_DECIMALS, BNB_DECIMALS} from './meta-mask.dictionary';

class StakingStats {
    static round(amount: number, tokenDecimals: number, accuracy: number): number {
        accuracy = Math.pow(10, accuracy);
        var x = Math.round( amount/(Math.pow(10, tokenDecimals)) * accuracy ) / accuracy;
        return x;
    }

    tvl: number;
    withdrawalFee: number;
    apr: string;
    yourStakeRaw: number;
    yourStakeRounded: number;
    yourPendingRewardsRaw: number;
    yourPendingRewardsRounded: number;
    round: number;

    constructor(
        obj: any
    ) {
        this.tvl = obj[0];
        this.withdrawalFee = obj[1];
        this.apr = obj[2];
        this.yourStakeRaw = obj[3]
        this.yourStakeRounded = StakingStats.round(obj[3], TOKEN_DECIMALS, 2);
        this.yourPendingRewardsRaw = obj[4];
        this.yourPendingRewardsRounded = StakingStats.round(obj[4], TOKEN_DECIMALS, 2);
        this.round = obj[5];
    }
}

export { StakingStats }
