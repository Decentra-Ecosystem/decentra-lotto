import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { LotteryService } from 'src/app/services/lottery.service';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css']
})
export class InfoCardComponent implements AfterViewInit {

  @Input() type;
  discounts:any;

  constructor(private lotteryService: LotteryService) { }

  ngAfterViewInit(): void {
    this.connect();
  }

  async connect(){
    var x = await this.lotteryService.connectToMetaMask();
    if (x == false) return;
    await this.getDiscounts();
  }

  async getDiscounts() {
    this.discounts = await this.lotteryService.getDiscountForTickets();
  }

  async viewPreviouswinners(){

  }  
}
