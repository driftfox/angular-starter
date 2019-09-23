// import { Lens } from 'monocle-ts';
import { combineLatest, Subject } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { WizardStateChange } from '../../wizard.enums';

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
    arrayIndexes: {}
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
    filter(val => val ? true : false), // State and sections change independently, this ensures no nulls slip through on section change
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
   */
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
  private sectionChange(sectionId: string, routeStartId?: string) {
    if (!this.sections) {
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
      console.error('No section found for ' + sectionId);
      return;
    }
    // Since this is a section change, a new starting route needs to be supplied. Default to routeStart if not supplied
    const routeId = routeStartId || sectionCurrent.routeStart;
    // Update state with new section id and statuses
    this.state = { ...this.state, sectionActiveId: sectionId, routeActiveId: routeId, status: status };
    this.state$.next(this.state);
  }

  /**
   *  Change the active route
   * @param routeId
   */
  public routeChange(routeId: string) {
    if (!this.sections) {
      return;
    }

    // Update state with new section id and statuses
    this.state = { ...this.state, routeActiveId: routeId };
    this.state$.next(this.state);
  }

  /**
   * Create initial state
   * @param sections
   * @param state
   */
  public stateCreate(sections: Wizard.SectionControl[], state?: Wizard.State) {
    this.state = state
      ? { ...this.state, ...state }
      : {
          sectionActiveId: sections[0].id,
          routeActiveId: sections[0].routeStart,
          routePath: [sections[0].routeStart],
          status: this.statusCreate(sections),
          arrayIndexes: {}
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
