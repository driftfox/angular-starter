// import { Lens } from 'monocle-ts';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export class WizardStateService {
  public sections$ = new BehaviorSubject<Wizard.SectionControl[] | null>(null);
  private sections: Wizard.SectionControl[] | undefined;

  public state$ = new BehaviorSubject<Wizard.State | null>(null);
  private state: Wizard.State = {
    sectionActiveId: null,
    pageActiveId: null,
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
   * @param sectionActiveId
   */
  public sectionChange(sectionActiveId: string) {
    this.state = {
      ...this.state,
      sectionActiveId: sectionActiveId,
    };
    this.state$.next(this.state);
  }
}
