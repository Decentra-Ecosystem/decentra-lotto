import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-staking-info',
  templateUrl: './staking-info.component.html',
  styleUrls: ['./staking-info.component.css']
})
export class StakingInfoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isMobile(){
    return window.innerWidth <= 1400;
  }

}
