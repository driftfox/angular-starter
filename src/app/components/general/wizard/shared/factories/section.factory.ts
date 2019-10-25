import { pageControl } from './page.factory';
import { routeControl } from './route.factory';
import { FormGroup } from '@angular/forms';
import { Wizard } from '../../wizard';

class SectionControl implements Wizard.SectionControl {
  get title() {
    return this.src.title;
  }
  readonly id = this.src.id;
  readonly slug = this.src.slug || this.src.id;
  readonly routeStart = this.src.routeStart;
  readonly settings = { ...this.src.settings };
  readonly data = { ...this.src.data } || null;
  readonly routes: Record<string, Wizard.RouteControl> = {};
  readonly pages: Record<string, Wizard.PageControl> = {};
  readonly wizardComplete = this.src.wizardComplete;
  public sectionNextId: string | null = null;
  public sectionPreviousId: string | null = null;

  constructor(public src: Wizard.Section, public form: FormGroup, public state: Wizard.State) {
    if (src.pages && src.pages.length) {
      src.pages.forEach(page => (this.pages[page.id] = pageControl(page, this.form, this.state)));
    }
    if (src.routes && src.routes.length) {
      src.routes.forEach(route => (this.routes[route.id] = routeControl(route)));
    }
  }
}

/**
 * Create a new sectionControl from a section
 * @param section
 */
export const sectionControl = (section: Wizard.Section, form: FormGroup, state: Wizard.State): Wizard.SectionControl => {
  return new SectionControl(section, form, state);
};

export const sectionControl2 = (section: Wizard.Section, form: FormGroup, state: Wizard.State): Wizard.SectionControl => {
  // Private variables
  const routes: Record<string, Wizard.RouteControl> = {};
  if (section.routes && section.routes.length) {
    section.routes.forEach(route => (routes[route.id] = routeControl(route)));
  }
  const pages: Record<string, Wizard.PageControl> = {};
  if (section.pages && section.pages.length) {
    section.pages.forEach(page => (pages[page.id] = pageControl(page, form, state)));
  }
  // Return
  return {
    ...section,
    src: { ...section },
    settings: {...section.settings },
    sectionNextId: null,
    sectionPreviousId: null,
    slug: section.slug || section.id,
    routes: routes,
    pages: pages,
    get title() {
      return section.title;
    },
    // getCount: () => count.toLocaleString()
  };
};
