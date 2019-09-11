import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { sections } from './config/sections';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardComponent implements OnInit {

  public sections = sections;
  public state = {
    sectionActiveId: '',
    pageActiveId: '',
    status: {
      'loan-purpose' : {
        active: false,
        completed: true,
        started: true,
        pageLast: 'summary'
      },
      'personal-info' : {
        active: true,
        completed: false,
        started: true,
        pageLast: 'test'
      },
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
