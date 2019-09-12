import { stringToSlug } from '../utils/strings.utils';

class SectionControl {
  static readonly sectionsRecord: Record<string, Wizard.SectionControl> = {};
  readonly title = this.src.title;
  readonly slug = this.src.slug ? this.src.slug : stringToSlug(this.src.title);
  readonly uniqueId = this.src.uniqueId ? this.src.uniqueId : stringToSlug(this.src.title);
  readonly routeStart = this.src.routeStart;
  readonly settings = {
    previousRequired: false,
    ...this.src.settings,
  };
  readonly data = this.src.data || null;
  readonly routing: Record<string, Wizard.Route> = {};
  readonly pages: Record<string, Wizard.Page> = {};
  readonly sectionNext: string | null = null;
  public status: Wizard.SectionStatus = {
    active: false,
    completed: false,
    completedDate: null,
    started: false,
    startedDate: null,
    pageLast: null,
  };
  constructor(public src: Wizard.Section) {
    // Check for duplicate uniqueIDs. If found throw error, otherwise add to class record
    if (SectionControl.sectionsRecord[this.uniqueId]) {
      console.error(`Duplicate unique ID found for ${this.uniqueId}`);
    } else {
      SectionControl.sectionsRecord[this.uniqueId] = this;
    }

    // src.routing.forEach(route => (this.routing[route.uniqueId] = { ...route }));
    // src.pages.forEach(page => (this.pages[page.uniqueId] = { ...page }));
  }

  /**
   * Set active to true, sets all other sections to inactive
   */
  public setActive(deactivateOthers = true) {
    if (deactivateOthers) {
      Object.keys(SectionControl.sectionsRecord).forEach(key => SectionControl.sectionsRecord[key].setInactive());
    }

    this.status = { ...this.status, active: true };
  }

  /**
   * Mark this section as inactive
   */
  public setInactive() {
    this.status = { ...this.status, active: false };
  }

  /**
   * Sets this section as completed
   * @param resetDate  By default the compelted date will not be overwritten. Set reset date to true to use new date
   */
  public setComplete(resetDate?: boolean) {
    const status = { ...this.status, completed: true };
    if (!status.completedDate || resetDate) {
      status.completedDate = new Date();
    }
    this.status = status;
  }

  /**
   * Sets section as incomplete
   */
  public setIncomplete() {
    this.status = { ...this.status, completed: false, completedDate: null };
  }
}

/**
 * Create a new sectionControl from a section
 * @param section
 */
export const sectionControl = (section: Wizard.Section) => {
  return new SectionControl(section);
};
