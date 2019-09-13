import { stringToSlug } from '../utils/strings.utils';
import { pageControl } from './page.factory';

class SectionControl implements Wizard.SectionControl {
  get title() {
    return this.src.title;
  }

  readonly slug = this.src.slug ? this.src.slug : stringToSlug(this.src.title);
  readonly uniqueId = this.src.uniqueId ? this.src.uniqueId : stringToSlug(this.src.title);
  readonly routeStart = this.src.routeStart;
  readonly settings = { ...this.src.settings };
  readonly data = { ...this.src.data } || null;
  readonly routing: Record<string, Wizard.Route> = {};
  readonly pages: Record<string, Wizard.Page> = {};
  readonly sectionNext: string | null = null;

  constructor(public src: Wizard.Section) {
    src.pages.forEach(page => {
      const pageCntrl = pageControl(page);
      this.pages[pageCntrl.uniqueId] = pageCntrl;
    });
  }
}

/**
 * Create a new sectionControl from a section
 * @param section
 */
export const sectionControl = (section: Wizard.Section): Wizard.SectionControl => {
  return new SectionControl(section);
};
