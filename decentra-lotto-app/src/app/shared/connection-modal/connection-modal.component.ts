import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LotteryService } from 'src/app/services/lottery.service';
import { WinnerModalComponent } from '../winner-modal/winner-modal/winner-modal.component';

@Component({
  selector: 'app-connection-modal',
  templateUrl: './connection-modal.component.html',
  styleUrls: ['./connection-modal.component.css']
})
export class ConnectionModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<WinnerModalComponent>, 
    private lotteryService: LotteryService) { 
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  disconnect(){
    this.lotteryService.disconnect();
  }
}
