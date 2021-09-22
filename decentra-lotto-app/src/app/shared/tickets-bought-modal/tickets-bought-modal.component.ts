import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tickets-bought-modal',
  templateUrl: './tickets-bought-modal.component.html',
  styleUrls: ['./tickets-bought-modal.component.css']
})
export class TicketsBoughtModalComponent implements OnInit {

  @Input() amount:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
