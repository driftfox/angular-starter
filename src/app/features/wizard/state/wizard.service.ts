
import { WizardStore } from './wizard.store';

export class WizardService {
  constructor(private store: WizardStore) {}

  public sectionChange() {
    this.store.update({});
  }
}

