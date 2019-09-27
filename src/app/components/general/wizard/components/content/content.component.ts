import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Wizard } from '../../wizard';
import { isType } from '../../shared/utils/isType.util';

@Component({
  selector: 'wiz-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit {
  @Input() content!: Wizard.ContentArrayControl;

  public isType = isType;
  constructor() {}

  ngOnInit() {
    
  }
}
