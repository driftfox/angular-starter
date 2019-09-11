import { EntityState, EntityStore, StoreConfig, EntityUIStore } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface SectionStore extends EntityState<Wizard.SectionControl> {
  ui: Wizard.State;
}
export interface WizardState extends EntityState<Wizard.State> {}

export const uniqueId = 'uniqueId';
export const initialUIState = {
  sectionActive: null,
  pageActive: null,
  status: {},
};

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'wizard', idKey: uniqueId, resettable: true }) // , cache: { ttl: null }
export class WizardStore extends EntityStore<SectionStore, Wizard.SectionControl> {
  ui!: EntityUIStore<WizardState>;
  constructor() {
    super({ ui: initialUIState });
    this.createUIStore();
  }
}
