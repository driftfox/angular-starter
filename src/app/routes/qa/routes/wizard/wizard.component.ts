import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { sections } from './config/sections';
import { FormBuilder } from '@angular/forms';
import { Wizard } from 'src/app/components/general/wizard/wizard';

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
    select: this.fb.array([0, 1, 2, 3, 4]),
    select2: this.fb.array([
      this.fb.group({
        hello: 'world',
      }),
      this.fb.group({
        hello: 'world',
      }),
    ]),
    level1: this.fb.group({
      'hello': 'world',
      level2: this.fb.array([
        this.fb.group({
          level3: 'level3',
          level4: this.fb.group({
            level5: 'level5',
          }),
        }),
        this.fb.group({
          level3: 'level3',
          level4: this.fb.array([
            this.fb.group({
              level5: 'level5a',
            }),
            this.fb.group({
              level5: 'level5b',
            }),
          ])
        }),
      ]),
    }),
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const state = localStorage.getItem('wizard');
    if (state) {
      this.state = JSON.parse(state);
    }
    this.form.valueChanges.subscribe(val => console.warn('Form Changes', val));
  }

  public stateChange(state: Wizard.State) {
    localStorage.setItem('wizard', JSON.stringify(state));
  }

  public wizardComplete() {
    console.warn('Wizard Complete, do something cool');
  }
}
