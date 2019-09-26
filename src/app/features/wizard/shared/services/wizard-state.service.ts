// import { Lens } from 'monocle-ts';
import { combineLatest, Subject } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { sectionControl } from '../factories/section.factory';
import { FormGroup } from '@angular/forms';

export class WizardStateService {
  /** All sections */
  public sections$ = new Subject<Record<string, Wizard.SectionControl>>();
  private _sections: Record<string, Wizard.SectionControl> | null = null;

  public get sections(): Record<string, Wizard.SectionControl> | null {
    return this._sections ? { ...this._sections } : null;
  }

  public set sections(sections: Record<string, Wizard.SectionControl> | null) {
    if (sections) {
      this._sections = { ...sections };
      this.sections$.next(this._sections);
    }
  }

  /** Wizard State */
  public state$ = new Subject<Wizard.State>();
  private _state: Wizard.State = {
    sectionActiveId: null,
    routeActiveId: null,
    routePath: [],
    status: {},
    arrayIndexes: {},
  };

  public set state(state: Wizard.State) {
    this._state = { ...state };
    this.state$.next(this._state);
  }
  public get state(): Wizard.State {
    return { ...this._state };
  }

  /** Current active section */
  public sectionActive$ = combineLatest([this.sections$, this.state$]).pipe(
    map(([sections, state]) => (sections && state && state.sectionActiveId ? sections[state.sectionActiveId] : null)),
    distinctUntilChanged(),
  );

  /** Current active page */
  public pageActive$ = combineLatest([this.sectionActive$, this.state$]).pipe(
    map(([section, state]) =>
      section && state && state.routeActiveId && section.routes[state.routeActiveId]
        ? section.pages[section.routes[state.routeActiveId].pageId]
        : null,
    ),
    filter(val => (val ? true : false)), // State and sections change independently, this ensures no nulls slip through on section change
    distinctUntilChanged(),
  );

  constructor() {}

  /**
   * Add sections to wizard
   * @param sections
   */
  public sectionsAdd(sections: Wizard.Section[], form: FormGroup) {
    const sectionRecord: Record<string, Wizard.SectionControl> = {};
    sections.forEach((section, i) => {
      // Create section controls
      const control = sectionControl(section, form);
      // Add props for relationships between sections, IE prev and next
      control.sectionNextId = sections[i + 1] ? sections[i + 1].id : null;
      control.sectionPreviousId = sections[i - 1] ? sections[i - 1].id : null;
      sectionRecord[control.id] = control;
    });

    this.sections = sectionRecord;
  }

  public formChange() {
    /**
     * Form change types:
     * Arrays: add, remove, index change
     * Change data
     * Add/remove/change validation
     */
  }

  /**
   * Change the current active section
   * @param action Which direction or section to change to
   * @param sectionId The ID of the next section
   * @param routeStartId An optional route within the next section
   */
  public sectionChange(action: Wizard.Transition = 'next', sectionId?: string, routeStartId?: string) {
    if (!this.sections || !this.state.sectionActiveId) {
      console.error('sectionChange missing arguments');
      return;
    }

    // Get current section index
    const sectionCurrent = this.sections[this.state.sectionActiveId];

    // Check if this is a previous or next section change
    switch (action) {
      case 'next':
        // Check if next section index would exceed # of sections, if so wizard is complete
        if (sectionCurrent.wizardComplete || !sectionCurrent.sectionNextId) {
          // Wizard complete, TODO fire complete logic
          console.warn('Wizard Complete');
        } else {
          // Get id of next section
          sectionId = sectionCurrent.sectionNextId;
        }
        break;
      case 'prev':
        // Check that previous index doesn't go below 0
        sectionId = sectionCurrent.sectionPreviousId ? sectionCurrent.sectionPreviousId : sectionCurrent.id;
        break;
    }

    // Null check
    if (!sectionId) {
      console.error('sectionChange: Something weird just happened getting the section Id');
      return;
    }

    // Update statuses. Mark all as inactive except active section
    const status: Record<string, Wizard.SectionStatus> = {};
    Object.keys(this.state.status).forEach(key => (status[key] = { ...this.state.status[key], active: false }));
    status[sectionId] = { ...status[sectionId], active: true };

    // Get current section
    // const sectionCurrent = this.sections.find(section => section.id === sectionId);
    // Null check for current section
    if (!sectionCurrent) {
      console.error('sectionChange: No section found for ' + sectionId);
      return;
    }
    // Since this is a section change, a new starting route needs to be supplied. Default to routeStart if not supplied
    const routeId = routeStartId || this.sections[sectionId].routeStart;
    // Update state with new section id and statuses, reset routePath
    this.stateChange({ sectionActiveId: sectionId, routeActiveId: routeId, status: status, routePath: [routeId] });
  }

  /**
   * Change the active route
   * @param action  Which direction or route to change to
   * @param routeId  If a goto action, the ID of the route to go to next
   */
  public routeChange(action: Wizard.Transition = 'next', routeId?: string) {
    if (!this.sections || !this.state.routeActiveId || !this.state.sectionActiveId) {
      console.error('routeChange missing arguments');
      return;
    }

    // Get current section index
    const sectionActive = this.sections[this.state.sectionActiveId];
    // Get current route
    const routeCurrent = sectionActive.routes[this.state.routeActiveId];
    // Validate route exists
    if (!routeCurrent) {
      console.error(
        'routeChange: Invalid route. Unable to find a route of "' + this.state.routeActiveId + '" in "' + this.state.sectionActiveId + '"',
      );
      return;
    }

    // Check if this route is marked section complete, if so go to next section
    if (routeCurrent && routeCurrent.sectionComplete) {
      this.sectionChange();
      return;
    }

    let routePath: string[] = [];

    // Check if this is a previous or next section change
    switch (action) {
      case 'next':
        routeId = routeCurrent.routeNext;
        if (!routeId) {
          return;
        }
        routePath = [...this.state.routePath, routeId];
        break;
      case 'prev':
        // Route ID of previous route by extracting from routePath
        routeId = this.state.routePath.length > 1 ? this.state.routePath[this.state.routePath.length - 1] : this.state.routePath[0];
        // Remove the last route from the route path, making sure that the array doesn't go down to 0
        routePath =
          this.state.routePath.length > 1 ? this.state.routePath.slice(0, this.state.routePath.length - 1) : [...this.state.routePath];
        break;
      case 'goto':
        routePath = routeId ? [...this.state.routePath, routeId] : [...this.state.routePath];
        break;
    }

    // Null check
    if (!routeId) {
      console.error('routeChange: No routeId found');
      return;
    }

    // Update state with new route and route path
    this.stateChange({ routeActiveId: routeId, routePath: routePath });
  }

  /**
   * Update the state of the wizard. Accepts partial replacements which are merged with the existing state
   * @param state
   */
  public stateChange(state: Partial<Wizard.State>) {
    this.state = { ...this.state, ...state };
  }

  /**
   * Generate a default state object from the sections
   * @param sections
   */
  public stateCreateDefault(sections: Wizard.Section[]) {
    const state: Wizard.State = {
      sectionActiveId: sections[0].id,
      routeActiveId: sections[0].routeStart,
      routePath: [sections[0].routeStart],
      status: {},
      arrayIndexes: {},
    };
    sections.forEach(section => {
      state.status[section.id] = {
        active: false,
        completed: false,
        completedDate: null,
        routeLast: null,
        started: false,
        startedDate: null,
      };
    });
    return state;
  }
}
