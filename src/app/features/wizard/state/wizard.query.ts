import { Query } from '@datorama/akita';
import { WizardStore, WizardState } from './wizard.store';

export class WizardQuery extends Query<WizardState> {
  constructor(protected store: WizardStore) {
    super(store);
  }
}