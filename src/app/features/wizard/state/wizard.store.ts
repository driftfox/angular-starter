import { Store, StoreConfig } from '@datorama/akita';

export interface WizardState {
  sectionActive: Wizard.SectionControl | null;
  pageActive: Wizard.Page | null;
}

export function createInitialState(): WizardState {
  return {
    sectionActive: null,
    pageActive: null
  };
}

@StoreConfig({ name: 'wizard' })
export class WizardStore extends Store<WizardState> {

  constructor() {
    super(createInitialState());
  }

}
