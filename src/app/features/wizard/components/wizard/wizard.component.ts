import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { sectionControl } from '../../shared/factories/section.factory';

@Component({
  selector: 'nts-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent implements OnInit, OnChanges {
  @Input() sections: Wizard.Section[] | undefined;
  @Input() state: Wizard.State | undefined;

  public config: any | undefined;

  constructor() {}

  ngOnInit() {
    if (this.sections && this.sections.length) {
      this.config = this.createConfig(this.sections, this.state);
    }
  }

  ngOnChanges() {}

  /**
   * Generate the configuration to power the wizard
   * @param sections
   * @param state
   */
  private createConfig(sections: Wizard.Section[], state?: Wizard.State) {
    // Create wizard controls from supplied configuration
    const sectionControls = sections.map(section => sectionControl(section));
    // Hold final generated config
    const config: Record<string, Wizard.SectionControl> = {};
    // Determine the next section for each section control
    sectionControls.forEach((section, i) => {
      const sectionNext = sectionControls[i + 1];
      const sectionNextId = sectionNext && sectionNext.uniqueId ? sectionNext.uniqueId : null;
      section.sectionNext = sectionNextId;
      // Add the section control to the record
      if (!config[section.uniqueId]) {
        config[section.uniqueId] = section;
      } else {
        console.error(`A unique ID of ${section.uniqueId} was already found for '${section.title}'. Please change the unique ID or title.`);
      }
    });

    // Check if the state property is set, if so update the section controls with their current state
    if (state) {
      Object.keys(state.status).forEach(key => {
        if (config[key] && state) {
          config[key].status = { ...config[key].status, ...state.status[key] };
        }
      });
    }

    console.log(config);
    return config;
  }
}
