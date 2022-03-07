import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LotteryService } from 'src/app/services/lottery.service';
import { DynamicScriptLoaderService } from '../../services/dynamic-script-loader.service';
declare var rubicWidget;

@Component({
  selector: 'app-bridge',
  templateUrl: './bridge.component.html',
  styleUrls: ['./bridge.component.css']
})
export class BridgeComponent implements OnInit, OnDestroy {

  priceETH: string;
  priceBSC: string;
  holders: string;
  circ: string;
  cap: string;
  pollingTimer: any;
  isBSC: boolean = true;

  private ngUnsubscribe = new Subject();

  constructor(
    private _dynamicScriptLoader: DynamicScriptLoaderService, 
    private lotteryService: LotteryService,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.init();
  }

  async init(){
    this.pollPrice();
    await this.lotteryService.connectToMetaMask();
    var chain = await this.lotteryService.getChain();
    if(chain == 56 || chain == 97){
      this.isBSC = true;
    }else if (chain == 1){
      this.isBSC = false;
    }
  }

  pollPrice(){
    this.getPrice()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: any) => {
      this.priceBSC = data.usdPrice;
      this.priceETH = data.usdETHPrice;
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
    clearTimeout(this.pollingTimer);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
