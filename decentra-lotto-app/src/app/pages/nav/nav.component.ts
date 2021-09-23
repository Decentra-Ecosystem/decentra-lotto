import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { LotteryService } from 'src/app/services/lottery.service';
import { StatsService } from 'src/app/services/stats.service';
import { PlatformCheckerService } from 'src/app/services/platform.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { 
  DELO_CONTRACT_ADDRESS_MAIN_NET, 
  DELO_CONTRACT_ADDRESS_TEST_NET,
  IS_LIVE
} from 'src/app/models/meta-mask.dictionary';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  menuItems = [
    {name: 'lottery', enabled:true, url:'', pages: []}, 
    {name:'staking', enabled:true, url:'', pages: []},
    {name:'pools', enabled:false, url:'', pages: []}, 
    {name:'vote', enabled:false, url:'', pages: []}, 
    {name:'trade', enabled:true, url:'', collapsed: true, pages: [
      {name:'buy', enabled:true, url:'https://pancakeswap.finance/swap?outputCurrency=0xca71ddb30ddc906048bcec5df305683f289c8c40'},
      {name:'dextools', enabled:true, url: 'https://www.dextools.io/app/bsc/pair-explorer/0xb9e111e1346f0a7410bce59e1a9422aec38cefce'},
      {name:'poocoin', enabled:true, url: 'https://poocoin.app/tokens/0xca71ddb30ddc906048bcec5df305683f289c8c40'}
    ]}, 
    {name:'docs', enabled:true, url:'https://docs.decentralotto.com/', pages: []},
    {name:'audits', enabled:true, url:'', collapsed: true, pages: [
      {name:'delo contract', enabled:true, url:'https://solidity.finance/'},
      {name:'lotto contract', enabled:true, url: 'https://solidity.finance/'},
      {name:'staking contract', enabled:true, url: 'https://solidity.finance/'}
    ]},
    {name:'more', enabled:true, url: '', collapsed: true, pages: [
      {name:'github', enabled:true, url: 'https://github.com/CeltyCrypto/decentra-lotto'},
      {name:'medium', enabled:true, url:''}
    ]}
  ];

  private ngUnsubscribe = new Subject();
  user: any; 
  connectionError: boolean
  chain_image: string;
  metaConnection: any;
  deloUSDPrice: any;
  pollingTimer: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  headerDict = {
    'accept': 'application/json',
    //'X-API-Key': '2YYUnTdkG4UWHzYrSLEQLo7PoLAVLcxcq24EBN4apquEtK4CyfoPCW5wvd6dtpVS',
  }
  requestOptions: any;

  constructor(
    private breakpointObserver: BreakpointObserver, 
    private lotteryService: LotteryService,
    private platform: PlatformCheckerService,
    private http: HttpClient,
    private statsService: StatsService,
    private router: Router,
    ) 
    {
      this.requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(this.headerDict), 
      };
      router.events.subscribe((val) => {
        //this.rlao = {exact: !this.rlao.exact};
      });
    }

  ngOnInit() {
    this.user = {address: '', truncatedAddress: '', superTruncatedAddress: '', balance: ''};
    this.connect();
  } 

  ngOnDestroy () {
    clearTimeout(this.pollingTimer);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  truncateAddress(){
    var trunc = "abcdef".substr(0, 3) + "\u2026";
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: FocusEvent): void {
      this.connect();
  }

  async connect(){
    this.metaConnection = await this.lotteryService.connectToMetaMask();
    if (!this.metaConnection || this.metaConnection == false){
      //error
      this.user.address = "Error";
      this.connectionError = true;
    }else{
      if (this.user.address == "Error"){
        window.location.reload();
      }
      await this.statsService.init();
      this.getData();
      this.pollPrice();
    }
  }

  pollPrice(){
    this.getPrice()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: any) => {
      this.deloUSDPrice = Math.round(data.data.price * 10000000000) / 10000000000;
        this.pollingTimer = setTimeout(()=>{
          this.pollPrice();
        }, 10000);
    });
  }

  async getData(){
    var chain = await this.lotteryService.getChain();
    this.user.address = this.metaConnection;
    this.user.truncatedAddress = this.metaConnection.substr(0, 6) + "\u2026" + this.metaConnection.substr(this.metaConnection.length-4);
    this.user.superTruncatedAddress = this.metaConnection.substr(0, 2) + "\u2026" + this.metaConnection.substr(this.metaConnection.length-4);

    if (chain == 137 || chain == 80001){
      this.chain_image = "../../../assets/images/polygon.png"
    }else if(chain == 56 || chain == 97){
      this.chain_image = "../../../assets/images/bsc.png"
    }else if (chain == 1){
      this.chain_image = "../../../assets/images/eth.png"
    }else{
      this.chain_image = "../../../assets/images/meta_wallet.png"
    }
    this.statsService.walletStatsSub
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
        next: stats => {
          if (stats != null && stats.walletDELOBalance != null) this.user.balance = parseFloat(stats.walletDELOBalance.toFixed(2));
        }
    });
  }

  getPrice() {
    return this.http.get("https://api.pancakeswap.info/api/v2/tokens/"+DELO_CONTRACT_ADDRESS_MAIN_NET, this.requestOptions);
    //return this.http.get("https://deep-index.moralis.io/api/v2/erc20/"+DELO_CONTRACT_ADDRESS_MAIN_NET+"/price?chain=bsc", this.requestOptions);
  }

  disconnect(){
    this.lotteryService.disconnect();
  }

  async setDeadline(){
    await this.lotteryService.setDeadline();
  }

  isMobile(){
    return this.platform.isMobile();
  }

}
