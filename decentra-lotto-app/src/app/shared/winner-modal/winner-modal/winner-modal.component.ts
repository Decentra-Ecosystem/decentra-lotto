import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-winner-modal',
  templateUrl: './winner-modal.component.html',
  styleUrls: ['./winner-modal.component.css']
})
export class WinnerModalComponent implements OnInit {

  displayedColumns: string[] = ['id', 'position', 'amount', 'amountUSD'];
  dataSource = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.dataSource = this.data.position;
  }


}
