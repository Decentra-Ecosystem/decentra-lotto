import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-bridge',
  templateUrl: './bridge.component.html',
  styleUrls: ['./bridge.component.css']
})
export class BridgeComponent implements OnInit {

  numTicketsControl = new FormControl(5, Validators.min(1));

  constructor() { }

  ngOnInit(): void {
  }

  selectToken(){

  }

}
