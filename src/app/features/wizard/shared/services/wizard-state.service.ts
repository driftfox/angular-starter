// import { Lens } from 'monocle-ts';
import { BehaviorSubject } from 'rxjs';

export class WizardStateService {

  public sections$ = new BehaviorSubject<Wizard.SectionControl[] | null>(null);

  public state: Wizard.State = {
    sectionActive: null,
    pageActive: null,
    status: {},
  };

  public state$ = new BehaviorSubject<Wizard.State>(this.state);

  // private sectionActive = Lens.fromProp<string>()();
  // private pageActive = Lens.fromProp<string>()('pageActive');
  // private status = Lens.fromProp<Wizard.State>()('status');

  constructor() {}

  /**
   * Change active section
   * @param section
   
  public sectionChange(section: Wizard.SectionControl) {
    // this.state = this.sectionActive.set(section)(this.state);
    this.state$.next(this.state);
  }
*/
  /**
   * Change active page
   * @param page
   
  public pageChange(page: Wizard.PageControl) {
    // this.state = this.pageActive.set(page)(this.state);
    this.state$.next(this.state);
  }
  */
}
