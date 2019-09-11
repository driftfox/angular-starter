import { Injectable } from '@angular/core';
// import { tap, catchError, take } from 'rxjs/operators';
// import { throwError } from 'rxjs';
// import { applyTransaction } from '@datorama/akita';

import { WizardStore, initialUIState } from './wizard.store';
import { WizardQuery } from './wizard.query';
import { combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
// import { environment } from '$env';

@Injectable({ providedIn: 'root' })
export class WizardService {
  /** Entity of sections */
  public sections$ = this.query.select().pipe(distinctUntilChanged());
  /** Wizard state */
  public state$ = this.query.select(store => store.ui).pipe(distinctUntilChanged());
  /** Current active section */
  public sectionActive$ = combineLatest([this.sections$, this.state$]).pipe(
    map(([sections, state]) =>
      sections && sections.entities && state && state.sectionActive ? sections.entities[state.sectionActive] : null,
    ),
    distinctUntilChanged()
  );

  /** A synchronous version of state state */
  public state: Wizard.State = initialUIState;

  constructor(public store: WizardStore, private query: WizardQuery) {
    console.warn(this.store);
  }


  public sectionsSet(sections: Wizard.SectionControl[]) {
    this.store.set(sections);
  }

  /**
   * 
   * @param state 
   */
  public updateState(state: Wizard.State) {
    this.state = {
      ...this.state,
      ...state,
    };
    this.store.update({
      ui: this.state,
    });
  }

  /**
   * Change active section
   * @param sectionId
   */
  public sectionChange(sectionActive: string) {
    this.state = {
      ...this.state,
      sectionActive: sectionActive,
    };
    this.store.update({
      ui: this.state,
    });
  }

  /**
   * Get entities and load into store
   * By default requests are cached
   * @param refreshCache Refresh entity data in cache, if false returns data currently in store
  
  public get(refreshCache = false) {
    // If not cached or refresh cache is specified, make http call and load store
    if (refreshCache || !this.query.getHasCache()) {
      this.store.setLoading(true);
      return this.http.get<Models.User[]>(url).pipe(
        tap(entities => this.store.set([...entities, ...entities, ...entities])), // On success, add response to store
        catchError(err => {
          applyTransaction(() => {
            this.store.setError(err);
            this.store.setLoading(false);
          });
          return throwError(err);
        }),
      );
    }
    // Always return original api response but only once
    return this.query.selectAll().pipe(take(1));
  }
 */
  /**
   * Reset store
   */
  public reset() {
    this.store.reset();
  }
}