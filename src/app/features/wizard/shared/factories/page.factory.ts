import { stringToSlug } from '../utils/strings.utils';

class PageControl {
  readonly title = this.src.title;
  readonly slug = this.src.slug ? this.src.slug : stringToSlug(this.src.title);
  readonly uniqueId = this.src.uniqueId ? this.src.uniqueId : stringToSlug(this.src.title);
  readonly data = this.src.data || null;
  readonly settings = this.src.settings ? { ...this.src.settings } : null;
  readonly events = this.src.events ? this.src.events : null;
  readonly content: any[] = [];
  constructor(public src: Wizard.Page) {
      
  }
}

export const pageControl = (page: Wizard.Page) => {
  return new PageControl(page);
};
