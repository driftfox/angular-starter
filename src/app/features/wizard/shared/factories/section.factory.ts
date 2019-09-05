import { stringToSlug } from '../utils/strings.utils';

class SectionControl {
  public title = this.src.title;
  public slug = this.src.slug ? this.src.slug : stringToSlug(this.src.title);
  public uniqueId = this.src.uniqueId ? this.src.uniqueId : stringToSlug(this.src.title);
  public routeStart = this.src.routeStart;
  public settings = {
    previousRequired: false,
    ...this.src.settings,
  };
  public data = this.src.data || null;
  public routing: Record<string, Wizard.Route> = {};
  public pages: Record<string, Wizard.Page> = {};
  public sectionNext: string | null = null;
  public status: Wizard.SectionStatus = {
    active: false,
    completed: false,
    started: false,
    pageLast: null,
  };
  constructor(public src: Wizard.Section) {
    src.routing.forEach(route => (this.routing[route.uniqueId] = { ...route }));
    src.pages.forEach(page => (this.pages[page.slug] = { ...page }));
  }
}

export const sectionControl = (section: Wizard.Section) => {
  return new SectionControl(section);
};
