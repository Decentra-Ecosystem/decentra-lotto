import {TOKEN_DECIMALS, BNB_DECIMALS} from './meta-mask.dictionary';
import { WalletStats } from './walletstats.model';

class DrawModel {

    id: number;
    numParticipants: number;
    tickets: any;
    winners: any;
    numTickets: number;
    totalSpend: number;
    createdOn: Date;
    drawDeadline: Date;
    totalPotRaw: number;
    totalPot: number;
    totalPotUSD: number;
    state: number;
    numWinners: number;
    stateString: string;
    oddsPerTicket: number;

    constructor(
        obj: any
    ) {
        this.id = obj[0];
        this.numParticipants = obj[1];
        this.winners = obj[2];

        this.numTickets = obj[3];

        this.createdOn = new Date(obj[4]*1000);
        this.drawDeadline = new Date(obj[5]*1000);

        this.totalPotRaw = obj[6];
        this.totalPot = WalletStats.round(obj[6], TOKEN_DECIMALS, 5);
        this.state = obj[7];
        this.numWinners = obj[8];
    }
}

enum State{
    Open,
    Closed,
    Ready,
    Finished
}

export { DrawModel, State }
