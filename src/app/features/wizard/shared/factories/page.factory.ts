import { stringToSlug } from '../utils/strings.utils';

class PageControl {
  public title = this.src.title;
  public slug = this.src.slug ? this.src.slug : stringToSlug(this.src.title);
  public uniqueId = this.src.uniqueId ? this.src.uniqueId : stringToSlug(this.src.title);
  public data = this.src.data || null;
  public settings = this.src.settings ? { ...this.src.settings } : null;
  public events = this.src.events ? this.src.events : null;
  public content: any[] = [];
  constructor(public src: Wizard.Page) {
      
  }
}

export const pageControl = (page: Wizard.Page) => {
  return new PageControl(page);
};
