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

  constructor(public src: Wizard.Section, public form: FormGroup) {
    if (src.pages && src.pages.length) {
      src.pages.forEach(page => this.pages[page.id] = pageControl(page, this.form));
    }
    if (src.routes && src.routes.length) {
      src.routes.forEach(route => this.routes[route.id] = routeControl(route));
    }
  }
}

/**
 * Create a new sectionControl from a section
 * @param section
 */
export const sectionControl = (section: Wizard.Section, form: FormGroup): Wizard.SectionControl => {
  return new SectionControl(section, form);
};
