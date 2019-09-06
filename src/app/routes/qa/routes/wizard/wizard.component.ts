import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { sections } from './config/sections';
import { Wizard } from 'src/app/features/wizard/wizard';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardComponent implements OnInit {

  public sections = sections;
  public state: Wizard.State = {
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
