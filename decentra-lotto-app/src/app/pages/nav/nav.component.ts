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
import { MatDialog } from '@angular/material/dialog';
import { ConnectionModalComponent } from 'src/app/shared/connection-modal/connection-modal.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  menuItems = [
    {name: 'lottery', enabled:true, url:'', collapsed: true, pages: [
      {name:'bsc lottery', enabled:true, url:''},
      {name:'eth lottery', enabled:true, url:''},
    ]}, 
    {name:'staking', enabled:true, url:'', pages: []},
    {name:'bridge', enabled:true, url:'', pages: []},
    {name: 'exchange', enabled:true, url:'', pages: []},
    {name:'docs', enabled:true, url:'https://docs.decentra-lotto.com/', pages: []},
    {name:'NFT Partners', enabled:true, url:'', collapsed: true, pages: [
      {name:'dexkit', enabled:true, url:''},
      {name:'etherland', enabled:true, url:''},
      {name:'marsecosystem', enabled:true, url:''},
    ]},
    {name:'charity', enabled:true, url:'', collapsed: true, pages: [
      {name:'redpanda earth', enabled:true, url:''},
      {name:'world of waves', enabled:true, url:''},
    ]}, 
    // {name:'syndicates', enabled:false, url:'', pages: []}, 
    // {name:'vote', enabled:false, url:'', pages: []}, 
    {name:'trade', enabled:true, url:'', collapsed: true, pages: [
      {name:'buy bsc', enabled:true, url:'https://pancakeswap.finance/swap?outputCurrency=0xC91B4AA7e5C247CB506e112E7FEDF6af7077b90A'},
      {name:'buy eth', enabled:true, url:'https://pancakeswap.finance/swap?outputCurrency=0xC91B4AA7e5C247CB506e112E7FEDF6af7077b90A'},
      {name:'dextools bsc', enabled:true, url: 'https://www.dextools.io/app/bsc/pair-explorer/0xc989c0e5d5035e689c129868944db9e091690875'},
      {name:'dextools eth', enabled:true, url: 'https://www.dextools.io/app/bsc/pair-explorer/0xc989c0e5d5035e689c129868944db9e091690875'},
    ]}, 
    {name:'audits', enabled:true, url:'', collapsed: true, pages: [
      {name:'Certik', enabled:true, url:'https://www.certik.com/projects/decentra'},
      {name:'Solidity', enabled:true, url:'https://solidity.finance/audits/DecentraLotto/'},
      {name:'lotto contract', enabled:true, url: 'https://solidity.finance/audits/DecentraLotto/'},
      {name:'staking contract', enabled:true, url: 'https://solidity.finance/audits/DecentraLotto/'}
    ]},
    {name:'more', enabled:true, url: '', collapsed: true, pages: [
      {name:'github', enabled:true, url: 'https://github.com/Decentra-Ecosystem/decentra-lotto'},
      {name:'medium', enabled:true, url:'https://decentra-lotto.medium.com'},
      {name:'whitepaper', enabled:true, url:'https://app.decentra-lotto.com/assets/delo_whitepaper.pdf'},
      {name:'terms', enabled:true, url:''}
    ]}
  ];

  private ngUnsubscribe = new Subject();
  user: any; 
  connectionError: boolean
  chain_image: string;
  chain_name: string;
  metaConnection: any;
  deloUSDPrice: any;
  deloETHUSDPrice: any;
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
    public dialog: MatDialog
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
    this.connectionError = true;
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
      //this.connect();
  }

  async connect(){
    this.metaConnection = await this.lotteryService.connectToMetaMask();
    if (!this.metaConnection || this.metaConnection == false){
      //error
      this.user.address = "Error";
      this.connectionError = true;
    }else{
      this.connectionError = false;
      if (this.user.address == "Error"){
        window.location.reload();
      }
      await this.statsService.init();
      this.getData();
      this.pollPrice();
    }
  }

  pollPrice(){
    this.statsService.getPrice()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: any) => {
      if (typeof data.usdPrice === 'string' || data.usdPrice instanceof String){
        this.deloUSDPrice = data.usdPrice;
      }else{
        this.deloUSDPrice = "Error Fetching Data"
      }

      if (typeof data.usdPrice === 'string' || data.usdPrice instanceof String){
        this.deloETHUSDPrice = data.usdETHPrice;
      }else{
        this.deloETHUSDPrice = "Error Fetching Data"
      }

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
      this.chain_image = "../../../assets/images/polygon.png";
      this.chain_name = "Polygon";
    }else if(chain == 56 || chain == 97){
      this.chain_image = "../../../assets/images/bsc.png";
      this.chain_name = "Binance Smart Chain";
    }else if (chain == 1){
      this.chain_image = "../../../assets/images/eth.png";
      this.chain_name = "Ethereum";
    }else{
      this.chain_image = "../../../assets/images/meta_wallet.png";
      this.chain_name = "Unknown";
    }
    
    this.statsService.walletStatsSub
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
        next: stats => {
          if (stats != null && stats.walletDELOBalance != null){
            var bal = parseFloat(stats.walletDELOBalance.toFixed(2));
            this.user.balance = bal > 2 ? bal : 0;
          } 
        }
    });
  }

  connection(){
    this.openConnectionDialog();
  }

  openConnectionDialog() {
    this.dialog.open(ConnectionModalComponent, {
      data: {
        address: this.user.address,
        addressTrunc: this.user.truncatedAddress,
        balance: this.user.balance,
        chain_image: this.chain_image,
        chain_name: this.chain_name
      }
    });
  }

  async setDeadline(){
    await this.lotteryService.setDeadline();
  }

  isMobile(){
    return this.platform.isMobile();
  }

}
