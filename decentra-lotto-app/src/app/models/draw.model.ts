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
    totalPot: number;
    state: number;
    numWinners: number;
    stateString: string;
    oddsPerTicket: number;

    constructor(
        obj: any
    ) {
        this.id = obj[0];
        this.numParticipants = obj[1];
        this.tickets = obj[2];
        this.winners = obj[3];
        this.numTickets = obj[4];
        this.totalSpend = obj[5];
        this.createdOn = new Date(obj[6]*1000);
        this.drawDeadline = new Date(obj[7]*1000);
        this.totalPot = WalletStats.round(obj[8], TOKEN_DECIMALS, 5);
        this.state = obj[9];
        this.numWinners = obj[10];
    }
}

enum State{
    Open,
    Closed,
    Ready,
    Finished
}

export { DrawModel, State }
