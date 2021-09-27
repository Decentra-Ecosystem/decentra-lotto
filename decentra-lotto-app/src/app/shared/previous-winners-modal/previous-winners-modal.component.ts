import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatsService } from 'src/app/services/stats.service';
import { WinnerModalComponent } from '../winner-modal/winner-modal/winner-modal.component';

@Component({
  selector: 'app-previous-winners-modal',
  templateUrl: './previous-winners-modal.component.html',
  styleUrls: ['./previous-winners-modal.component.css']
})
export class PreviousWinnersModalComponent implements OnInit {

  displayedColumns: string[] = ['positions', 'deloAmount', 'usdAmount', 'address'];
  dataSource = [];
  draws: [];
  tabs = [];
  tabMapping = [];
  loading = false;

  selected = new FormControl(0);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<WinnerModalComponent>,
    private statsService: StatsService) { 
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.tabs = [];
    for(var i=0; i<this.data.draws.length; i++){
      this.tabs.push(this.data.draws[i].date.toLocaleString());
      this.tabMapping.push(this.data.draws[i].id);
    }
    this.dataSource = this.data.winners;
    this.selected.setValue(this.tabs.length - 1);
    this.loading = false;
  }

  async tabSelected(val){
    await this.viewPreviousWinners(val);
  }

  async viewPreviousWinners(val){
    this.loading = true;
    var winners = await this.statsService.viewPreviousWinners(parseInt(this.tabMapping[val]));
    this.data = {
      draws: winners[0],
      winners: winners[1]
    }
    this.init();
  }

  addTab(selectAfterAdding: boolean) {
    this.tabs.push('New');

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

}
