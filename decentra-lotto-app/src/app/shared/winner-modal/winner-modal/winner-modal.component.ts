import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-winner-modal',
  templateUrl: './winner-modal.component.html',
  styleUrls: ['./winner-modal.component.css']
})
export class WinnerModalComponent implements OnInit {

  displayedColumns: string[] = ['id', 'position', 'amount', 'amountUSD'];
  dataSource = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<WinnerModalComponent>) { 
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.dataSource = this.data.position;
    // let audio: HTMLAudioElement = new Audio('https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7');
    // audio.play();
  }
}
