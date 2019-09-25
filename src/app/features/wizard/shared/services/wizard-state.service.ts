// import { Lens } from 'monocle-ts';
import { combineLatest, Subject } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';

export class WizardStateService {
  /** All sections */
  public sections$ = new Subject<Wizard.SectionControl[]>();
  private sections: Wizard.SectionControl[] | undefined;

  /** Wizard State */
  public state$ = new Subject<Wizard.State>();
  private state: Wizard.State = {
    sectionActiveId: null,
    routeActiveId: null,
    routePath: [],
    status: {},
    arrayIndexes: {},
  };

  /** Current active section */
  public sectionActive$ = combineLatest([this.sections$, this.state$]).pipe(
    map(([sections, state]) =>
      sections && sections.length && state && state.sectionActiveId
        ? sections.find(section => section.id === state.sectionActiveId)
        : undefined,
    ),
    distinctUntilChanged(),
  );

  /** Current active page */
  public pageActive$ = combineLatest([this.sectionActive$, this.state$]).pipe(
    map(([section, state]) =>
      section && state && state.routeActiveId && section.routes[state.routeActiveId]
        ? section.pages[section.routes[state.routeActiveId].pageId]
        : undefined,
    ),
    filter(val => (val ? true : false)), // State and sections change independently, this ensures no nulls slip through on section change
    distinctUntilChanged(),
  );

  constructor() {}

  /**
   * Add sections
   * @param sections
   */
  public sectionsAdd(sections: Wizard.SectionControl[]) {
    this.sections = [...sections];
    this.sections$.next(this.sections);
  }

  /**
   * Wizard state change
   * @param state
  public stateChange(change: WizardStateChange, data?: any) {
    if (!this.sections || !this.state) {
      return;
    }
    // console.log('stateChange', change, data);

    // Get current section index
    const sectionCurrentIndex = this.sections.findIndex(section => section.id === this.state.sectionActiveId);

    switch (change) {
      case WizardStateChange.sectionNext:
        // Check if next section index would exceed # of sections, if so wizard is complete
        if (sectionCurrentIndex + 1 >= this.sections.length) {
          // Wizard complete
          console.warn('Wizard Complete');
        } else {
          // Get id of next section
          const sectionNextId = this.sections[sectionCurrentIndex + 1].id;
          this.sectionChange(sectionNextId);
        }
        break;
      case WizardStateChange.sectionPrevious:
        // Check that previous index doesn't go below 0
        const sectionPrevId = sectionCurrentIndex - 1 < 0 ? this.sections[0].id : this.sections[sectionCurrentIndex - 1].id;
        this.sectionChange(sectionPrevId);
        break;
      case WizardStateChange.sectionGoTo:
        this.sectionChange(data);
        break;
      case WizardStateChange.routeNext:
        this.routeChange(data);
        break;
      case WizardStateChange.routePrevious:
        this.routeChange(data);
        break;
      case WizardStateChange.routeGoTo:
        this.routeChange(data);
        break;
      case WizardStateChange.actionCustom:
        console.log('Action!');
        break;
    }
  }
  */

  public formChange() {
    /**
     * Form change types:
     * Arrays: add, remove, index change
     * Change data
     * Add/remove/change validation
     */
  }

  /**
   * Change active section
   * Sets active status for requested section and sets all others to inactive
   * @param sectionActiveId
   */
  public sectionChange(action: Wizard.Transition = 'next', sectionId?: string, routeStartId?: string) {
    if (!this.sections) {
      return;
    }

    // Get current section index
    const sectionCurrentIndex = this.sections.findIndex(section => section.id === this.state.sectionActiveId);

    // Check if this is a previous or next section change
    switch (action) {
      case 'next':
        // Check if next section index would exceed # of sections, if so wizard is complete
        if (sectionCurrentIndex + 1 >= this.sections.length) {
          // Wizard complete, TODO fire complete logic
          console.warn('Wizard Complete');
        } else {
          // Get id of next section
          sectionId = this.sections[sectionCurrentIndex + 1].id;
        }
        break;
      case 'prev':
        // Check that previous index doesn't go below 0
        sectionId = sectionCurrentIndex - 1 < 0 ? this.sections[0].id : this.sections[sectionCurrentIndex - 1].id;
        break;
    }

    if (!sectionId) {
      console.error('sectionChange: Something weird just happened getting the section Id');
      return;
    }

    // Update statuses. Mark all as inactive except active section
    const status: Record<string, Wizard.SectionStatus> = {};
    Object.keys(this.state.status).forEach(key => (status[key] = { ...this.state.status[key], active: false }));
    status[sectionId] = { ...status[sectionId], active: true };

    // Get current section
    const sectionCurrent = this.sections.find(section => section.id === sectionId);
    // Null check for current section
    if (!sectionCurrent) {
      console.error('sectionChange: No section found for ' + sectionId);
      return;
    }
    // Since this is a section change, a new starting route needs to be supplied. Default to routeStart if not supplied
    const routeId = routeStartId || sectionCurrent.routeStart;
    // Update state with new section id and statuses, reset routePath
    this.state = { ...this.state, sectionActiveId: sectionId, routeActiveId: routeId, status: status, routePath: [routeId] };
    this.state$.next(this.state);
  }

  /**
   *  Change the active route
   * @param routeId
   */
  public routeChange(action: Wizard.Transition = 'next', routeId?: string) {
    if (!this.sections || !this.state.routeActiveId) {
      return;
    }

    // Get current section index
    const sectionActive = this.sections.find(section => section.id === this.state.sectionActiveId) as Wizard.SectionControl;
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

    if (!routeId) {
      console.error('routeChange: No routeId found');
      return;
    }

    /**
    // Add new route to route path
    routePath =
      action === 'next' || action === 'goto'
        ? [...this.state.routePath, routeId]
        : (this.state.routePath.slice(0, this.state.routePath.length - 1) as string[]);
         */

    // Update state with new section id and statuses
    this.state = { ...this.state, routeActiveId: routeId, routePath: routePath };
    this.state$.next(this.state);
  }

  /**
   * Create initial state
   * @param sections
   * @param state
   */
  public stateChange(sections: Wizard.SectionControl[], state?: Wizard.State) {
    this.state = state
      ? { ...this.state, ...state }
      : {
          sectionActiveId: sections[0].id,
          routeActiveId: sections[0].routeStart,
          routePath: [sections[0].routeStart],
          status: this.statusCreate(sections),
          arrayIndexes: {},
        };
    this.state$.next(this.state);
    return this.state;
  }

  /**
   * Genereate the default list of statuses from the sections
   * @param sections
   */
  private statusCreate(sections: Wizard.SectionControl[]) {
    const statuses: Record<string, Wizard.SectionStatus> = {};
    sections.forEach(section => {
      statuses[section.id] = {
        active: false,
        completed: false,
        completedDate: null,
        routeLast: null,
        started: false,
        startedDate: null,
      };
    });
    return statuses;
  }
}
