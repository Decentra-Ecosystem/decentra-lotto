import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LotteryService } from 'src/app/services/lottery.service';
import { StatsService } from 'src/app/services/stats.service';
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
  reserves: string;
  holders: string;
  circ: string;
  cap: string;
  pollingTimer: any;
  isBSC: boolean = true;
  priceDiff: string;

  private ngUnsubscribe = new Subject();

  constructor(
    private _dynamicScriptLoader: DynamicScriptLoaderService, 
    private lotteryService: LotteryService,
    private statsService: StatsService,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    this.init();
  }

  ngAfterViewInit(): void {
    //this.init();
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

    await this.getReserves();
    await this.getGasCost();
  }

  pollPrice(){
    this.statsService.getPrice()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: any) => {
      if (typeof data.usdPrice === 'string' || data.usdPrice instanceof String){
        this.priceBSC = data.usdPrice;
      }else{
        this.priceBSC = "Error Fetching Data"
      }

      if (typeof data.usdPrice === 'string' || data.usdPrice instanceof String){
        this.priceETH = data.usdETHPrice;
      }else{
        this.priceBSC = "Error Fetching Data"
      }

      if (this.priceBSC == "Error Fetching Data" || this.priceBSC == "Error Fetching Data"){
        this.priceDiff = '0';
      }else{
        var x = parseFloat(this.priceBSC.substring(1));
        var y = parseFloat(this.priceETH.substring(1));
  
        if (this.isBSC){
          this.priceDiff = (((y-x) / x)*100).toFixed(2) + '%';
        }else{
          this.priceDiff = (((x-y) / x)*100).toFixed(2) + '%';        
        }
      }
      
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
    return this.http.get("https://delo-stats.azurewebsites.net/api/delo-price-lite?code=1", requestOptions);
  }

  async getReserves() {
    var r;
    if (this.isBSC){
      r = await this.lotteryService.getReserveBalance('BSC');
    }else{
      r = await this.lotteryService.getReserveBalance('ETH');
    }
    this.reserves = r[0];
  }

  async getGasCost() {
    
  }

  ngOnDestroy(){
    clearTimeout(this.pollingTimer);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
