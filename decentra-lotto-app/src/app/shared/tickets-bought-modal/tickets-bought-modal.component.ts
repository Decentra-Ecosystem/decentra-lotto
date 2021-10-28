import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WinnerModalComponent } from '../winner-modal/winner-modal/winner-modal.component';

@Component({
  selector: 'app-tickets-bought-modal',
  templateUrl: './tickets-bought-modal.component.html',
  styleUrls: ['./tickets-bought-modal.component.css']
})
export class TicketsBoughtModalComponent implements OnInit {
  @Input() amount:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<WinnerModalComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

}
