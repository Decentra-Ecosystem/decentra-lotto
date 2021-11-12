import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LotteryService } from 'src/app/services/lottery.service';
import { DynamicScriptLoaderService } from '../../services/dynamic-script-loader.service';
declare var rubicWidget;

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnInit, OnDestroy {

  price: string;
  holders: string;
  circ: string;
  cap: string;
  pollingTimer: any;

  private ngUnsubscribe = new Subject();

  configurationETH = {
    from: 'ETH',
    to: '0xC91B4AA7e5C247CB506e112E7FEDF6af7077b90A',
    fromChain: 'ETH',
    toChain: 'BSC',
    amount: 1,
    iframe: 'flex',
    hideSelectionFrom: false,
    hideSelectionTo: false,
    theme: 'dark',
    background: 'linear-gradient(180deg, #381a74 0%, #4c225f 100%)',
    injectTokens: {
      bsc: [
        "0xC91B4AA7e5C247CB506e112E7FEDF6af7077b90A"
      ]
    }
  }

  configurationBSC = {
    from: 'BNB',
    to: '0xC91B4AA7e5C247CB506e112E7FEDF6af7077b90A',
    fromChain: 'BSC',
    toChain: 'BSC',
    amount: 1,
    iframe: 'flex',
    hideSelectionFrom: false,
    hideSelectionTo: false,
    theme: 'dark',
    background: 'linear-gradient(180deg, #381a74 0%, #4c225f 100%)',
    injectTokens: {
      bsc: [
        "0xC91B4AA7e5C247CB506e112E7FEDF6af7077b90A"
      ]
    }
  }

  configurationPOLY = {
    from: 'MATIC',
    to: '0xC91B4AA7e5C247CB506e112E7FEDF6af7077b90A',
    fromChain: 'POLYGON',
    toChain: 'BSC',
    amount: 1,
    iframe: 'flex',
    hideSelectionFrom: false,
    hideSelectionTo: false,
    theme: 'dark',
    background: 'linear-gradient(180deg, #381a74 0%, #4c225f 100%)',
    injectTokens: {
      bsc: [
        "0xC91B4AA7e5C247CB506e112E7FEDF6af7077b90A"
      ]
    }
  }

  constructor(
    private _dynamicScriptLoader: DynamicScriptLoaderService, 
    private lotteryService: LotteryService,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    this._dynamicScriptLoader.load('rubic').then(data => {
      this.setConfig();
    }).catch(error => console.log(error));
    this.pollPrice();
  }

  async setConfig(){
    var config;
    var address = await this.lotteryService.connectToMetaMask();
    if (address == false){
      config = this.configurationETH;
    }else{
      var chain = await this.lotteryService.getChain()
      if (chain == 137 || chain == 80001){
        //polygon
        config = this.configurationPOLY;
      }else if(chain == 56 || chain == 97){
        //bsc
        config = this.configurationBSC;
      }else if (chain == 1){
        //eth
        config = this.configurationETH;
      }else{
        //eth
        config = this.configurationETH;
      }
    }
    
    // prevent accidental changes to the object, for example, when re-creating a widget for another theme
    Object.freeze(config);
    // create widget
    rubicWidget.init(config);
  }

  pollPrice(){
    this.getPrice()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: any) => {
      this.price = data.usdPrice;
      this.holders = data.holders;
      this.circ = data.circulatingSupply;
      this.cap = data.marketCap;
      this.pollingTimer = setTimeout(()=>{
        this.pollPrice();
      }, 10000);
    });
  }

  getPrice() {
    var headerDict = {
      'accept': 'application/json'
    }
    var requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return this.http.get("https://delo-stats.azurewebsites.net/api/delo-price?code=qojorarMfy1gljzNUDd9Fe8DySDKvDL1hsIFZKctDUarGFafFruAXQ==", requestOptions);
  }

  ngOnDestroy(){
    this._dynamicScriptLoader.unloadScript('rubic');
    clearTimeout(this.pollingTimer);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
