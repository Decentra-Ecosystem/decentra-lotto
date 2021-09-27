import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WinnerModalComponent } from '../winner-modal/winner-modal/winner-modal.component';

@Component({
  selector: 'app-my-wins-modal',
  templateUrl: './my-wins-modal.component.html',
  styleUrls: ['./my-wins-modal.component.css']
})
export class MyWinsModalComponent implements OnInit {

  displayedColumns: string[] = ['id', 'position', 'amount', 'amountUSD'];
  dataSource = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<WinnerModalComponent>) { 
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.dataSource = this.data.position;
  }

}
