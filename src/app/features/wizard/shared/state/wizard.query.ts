import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { WizardStore, SectionStore } from './wizard.store';

@Injectable({ providedIn: 'root' })
export class WizardQuery extends QueryEntity<SectionStore, Models.User> {
 
  constructor(protected store: WizardStore) {
    super(store);
    this.createUIQuery();
  }
}
