import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Wizard } from '../../wizard';

@Component({
  selector: 'wiz-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit {
  @Input() page!: Wizard.PageControl;

  @Output() sectionChange = new EventEmitter<any>();
  @Output() routeChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
  }

}
