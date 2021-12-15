import {TOKEN_DECIMALS, BNB_DECIMALS} from './meta-mask.dictionary';
import { WalletStats } from './walletstats.model';

class DrawModel {

    id: number = 0;
    numParticipants: number = 0;
    tickets: any = 0;
    winners: any = 0;
    numTickets: number = 0;
    totalSpend: number = 0;
    createdOn: Date = new Date();
    drawDeadline: Date = new Date();
    totalPotRaw: number = 0;
    totalPot: number = 0;
    totalPotUSD: number = 0;
    state: number = 0;
    numWinners: number = 0;
    stateString: string = 'BSC Error';
    oddsPerTicket: number = 0;

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
