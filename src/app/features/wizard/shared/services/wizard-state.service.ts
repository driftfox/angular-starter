import { Wizard } from '../../wizard';

export class WizardStateService {
  constructor() {}

  public stateChange(config: Record<string, Wizard.SectionControl>): Wizard.State {
    console.log(config);
    return {
      sectionActiveId: '',
      pageActiveId: '',
      status: {},
      // flags: {}
    };
  }
}
