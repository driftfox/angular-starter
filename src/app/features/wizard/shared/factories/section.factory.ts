import { stringToSlug } from '../utils/strings.utils';

class SectionControl {
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
    started: false,
    pageLast: null,
  };
  constructor(public src: Wizard.Section) {
    src.routing.forEach(route => (this.routing[route.uniqueId] = { ...route }));
    // src.pages.forEach(page => (this.pages[page.uniqueId] = { ...page }));
  }
}

export const sectionControl = (section: Wizard.Section) => {
  return new SectionControl(section);
};
