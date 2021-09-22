import {Injectable} from '@angular/core';
import * as BN from 'bn.js';
import {DIVIDER_FOR_BALANCE, WEB3} from '../models/meta-mask.dictionary';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  proposalClassifications: any;
  private scripts: any = {};

  constructor() {
    this.scripts['livecoinwatch'] = {
      loaded: false,
      src: "https://www.livecoinwatch.com/static/lcw-widget.js"
    };
    this.proposalClassifications = {
      yield: 'assets/gold_icon.png',
      liquidity: 'assets/liquidity_icon.png',
      charity: 'assets/donate_icon.png',
      balanced: 'assets/shamrock_icon.png',
    };
  }

  public parseAmount(amount: string, decimals: number): number {
    const web3 = window[WEB3];
    const divider = web3.utils.toBN(10).pow(web3.utils.toBN(decimals));
    return new web3.utils.BN(amount).div(divider).toNumber();
  }

  public convertAmount(amount: any) {
    const web3 = window[WEB3];
    amount = web3.utils.toWei(amount.toString());
    return amount;
  }

  public parseAmountDivider(amount: string): number {
    const web3 = window[WEB3];
    const divider = web3.utils.toBN(10).pow(web3.utils.toBN(DIVIDER_FOR_BALANCE));
    let result =  (new web3.utils.BN(amount)).div(divider).toNumber();
    result = result / 100;
    return result;
  }


  public lessOrEqual(amount1: string, amount2: string ) {
    const web3 = window[WEB3];
    amount1 = web3.utils.toWei(amount1);
    return (new web3.utils.BN(amount1)).lte(new web3.utils.BN(amount2));
  }

  public greaterThen(amount1: string, amount2: string ) {
    const web3 = window[WEB3];
    amount1 = web3.utils.toWei(amount1);
    return (new web3.utils.BN(amount1)).gt(new web3.utils.BN(amount2));
  }

  public lessThen(amount1: string, amount2: string ) {
    const web3 = window[WEB3];
    amount1 = web3.utils.toWei(amount1);
    return (new web3.utils.BN(amount1)).lt(new web3.utils.BN(amount2));
  }

  public getClassFromCycle(cycle: number[]){
    if (!cycle){
      return "";
    }
    if (cycle[4] > cycle[5] && cycle[4] > cycle[6]){
      return this.proposalClassifications.yield;
    }else if (cycle[5] > cycle[4] && cycle[5] > cycle[6]){
      return this.proposalClassifications.liquidity;
    }else if (cycle[6] > cycle[4] && cycle[6] > cycle[5]){
      return this.proposalClassifications.charity;
    }else{
      return this.proposalClassifications.balanced;
    }
  }

  public getWinningCycle(proposal: number[][][]){
    var _winningCycleIndex = -1;
    var winningTie = false;
    var _runnerUpCycleIndex = -1;
    var runnerTie = false;

    for(var i=0; i < proposal[0].length; i++) {
      if (_winningCycleIndex == -1 || proposal[0][i][7] > proposal[0][_winningCycleIndex][7]){
          _winningCycleIndex = i;
      }
      else if (proposal[0][i][7] == proposal[0][_winningCycleIndex][7]){
          //a tiebreaker
          winningTie = true;
      }        
    }

    for(var i=0; i < proposal[0].length; i++) {
      if (i != _winningCycleIndex && (_runnerUpCycleIndex == -1 || proposal[0][i][7] > proposal[0][_runnerUpCycleIndex][7])){
        _runnerUpCycleIndex = i;
      }
      else if (i != _winningCycleIndex && proposal[0][i][7] == proposal[0][_runnerUpCycleIndex][7]){
          //a tiebreaker
          runnerTie = true;
      }        
    }

    var r = {'first':'', 'second':'', 'firstVotes': 0, 'secondVotes': 0};
    if (_winningCycleIndex == -1){
      r.first = 'Tie Breaker';
      r.second = 'Tie Breaker';
    }else{
      r.first = winningTie == true ? 'Tie Breaker' : proposal[0][_winningCycleIndex][1].toString();
      r.firstVotes = proposal[0][_winningCycleIndex][7];
      r.second = runnerTie == true ? 'Tie Breaker' : proposal[0][_runnerUpCycleIndex][1].toString();
      r.secondVotes = proposal[0][_runnerUpCycleIndex][7];
    }
    return r;
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
        //resolve if already loaded
        if (this.scripts[name].loaded) {
            resolve({script: name, loaded: true, status: 'Already Loaded'});
        }
        else {
            //load script
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = this.scripts[name].src;
            script.onload = () => {
              this.scripts[name].loaded = true;
              resolve({script: name, loaded: true, status: 'Loaded'});
          };
            script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    });
  }

  dateToString(date_ob: { getDate: () => string; getMonth: () => number; getFullYear: () => any; getHours: () => any; getMinutes: () => any; getSeconds: () => any; }){

    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  }
}
