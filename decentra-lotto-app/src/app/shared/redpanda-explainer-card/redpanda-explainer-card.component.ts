import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-redpanda-explainer-card',
  templateUrl: './redpanda-explainer-card.component.html',
  styleUrls: ['./redpanda-explainer-card.component.css']
})
export class RedPandaExplainerCardComponent implements OnInit {
  @Input() charityName: string;

  constructor() { }

  ngOnInit(): void {
  }

}
