import { stringToSlug } from '../utils/strings.utils';
import { isType } from '../utils/isType.util';
import { AbstractControl } from '@angular/forms';
import { contentControl } from './content.factory';

class PageControl implements Wizard.PageControl {
  readonly title = this.src.title;
  readonly slug = this.src.slug ? this.src.slug : stringToSlug(this.src.title);
  readonly uniqueId = this.src.uniqueId ? this.src.uniqueId : stringToSlug(this.src.title);
  readonly data = { ...this.src.data } || {};
  readonly settings = this.src.settings ? { ...this.src.settings } : {};
  readonly events = this.src.events ? this.src.events : {};

  readonly content = this.src.content;

  readonly controlsById: { [key: string]: AbstractControl } = {};
  get controls() {
    return Object.keys(this.controlsById).map(key => this.controlsById[key]);
  }
  

  get valid() {
    return true;
  }
  get validControls() {
    return this.controls.reduce((a: boolean, b: AbstractControl) => (b.invalid ? false : a), true);
  }
  get invalid() {
    return !this.valid;
  }

  constructor(public src: Wizard.Page) {
    // Convert content to controls, add null check
    this.content = this.src.content
      .map(content => {
        const control = contentControl(content);
        if (isType.formField(content)) {
          // this.controlsById[content.field] = control;
        }
        return control;
      })
      .filter(x => (x ? true : false)) as Wizard.ContentArray[];
  }

  public controlsMarkAsTouched() {}
}

export const pageControl = (page: Wizard.Page) => {
  return new PageControl(page);
};
