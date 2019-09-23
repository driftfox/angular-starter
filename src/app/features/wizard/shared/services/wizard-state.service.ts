// import { Lens } from 'monocle-ts';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export class WizardStateService {
  /** All sections */
  public sections$ = new BehaviorSubject<Wizard.SectionControl[] | null>(null);
  private sections: Wizard.SectionControl[] | undefined;

  /** Wizard State */
  public state$ = new BehaviorSubject<Wizard.State | null>(null);
  private state: Wizard.State = {
    sectionActiveId: null,
    routeActiveId: null,
    routePath: [],
    status: {},
  };

  /** Current active section */
  public sectionActive$ = combineLatest([this.sections$, this.state$]).pipe(
    map(([sections, state]) =>
      sections && sections.length && state && state.sectionActiveId
        ? sections.find(section => section.uniqueId === state.sectionActiveId)
        : undefined,
    ),
    distinctUntilChanged(),
  );

  /** Current active page */
  public pageActive$ = combineLatest([this.sectionActive$, this.state$]).pipe(
    map(([section, state]) =>
      section && state && state.routeActiveId && section.routing[state.routeActiveId]
        ? section.pages[section.routing[state.routeActiveId].pageId]
        : undefined,
    ),
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
  public stateChange(state: Wizard.State) {
    this.state = { ...state };
    this.state$.next(this.state);
  }

  /**
   * Change active section
   * Sets active status for requested section and sets all others to inactive
   * @param sectionActiveId
   */
  public sectionChange(sectionId: string) {
    if (!this.sections) {
      return;
    }
    // Update statuses. Mark all as inactive except active section
    const status: Record<string, Wizard.SectionStatus> = {};
    Object.keys(this.state.status).forEach(key => (status[key] = { ...this.state.status[key], active: false }));
    status[sectionId] = { ...status[sectionId], active: true };

    // Update state with new section id and statuses
    this.state = { ...this.state, sectionActiveId: sectionId, status: status };
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
          sectionActiveId: sections[0].uniqueId,
          routeActiveId: sections[0].routeStart,
          routePath: [sections[0].routeStart],
          status: this.statusCreate(sections),
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
      statuses[section.uniqueId] = {
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
