import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { sections } from './config/sections';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent implements OnInit {
  public sections = sections;
  public state: Wizard.State | undefined;

  public form = this.fb.group({
    loanPurpose: ['Hello World'],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const state = localStorage.getItem('wizard');
    if (state) {
      this.state = JSON.parse(state);
    }
  }

  public stateChange(state: Wizard.State) {
    localStorage.setItem('wizard', JSON.stringify(state));
    console.log(state);
  }

  public wizardComplete() {
    console.warn('Wizard Complete, do something cool');
  }
}
