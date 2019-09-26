import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { sections } from './config/sections';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardComponent implements OnInit {

  public sections = sections;
  public state = {
    sectionActiveId: null,
    pageActiveId: null,
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

  public form = this.fb.group({
    loanPurpose: ['Hello World']
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  public wizardComplete() {
    console.warn('Wizard Complete, do something cool');
  }

}
