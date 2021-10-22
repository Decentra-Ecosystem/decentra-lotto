import { Component, OnInit, Input  } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() title: string;
  @Input() logo: string;
  @Input() size: string;

  constructor() { 
  }

  ngOnInit(): void {
  }

}
