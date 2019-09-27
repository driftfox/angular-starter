import { isType } from '../utils/isType.util';
import { AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { contentControl } from './content.factory';

class PageControl implements Wizard.PageControl {
  readonly title = this.src.title;
  readonly id = this.src.id;
  readonly data = { ...this.src.data } || {};
  readonly settings = this.src.settings ? { ...this.src.settings } : {};
  readonly events = this.src.events ? this.src.events : {};

  readonly content = this.src.content;

  readonly controlsById: { [key: string]: FormControl } = {};
  get controls() {
    return Object.keys(this.controlsById).map(key => this.controlsById[key]);
  }
  
  get valid() {
    // TODO: Support page level validation not just field level validation
    return this.validControls;
  }
  get validControls() {
    return this.controls.reduce((a: boolean, b: AbstractControl) => (b.invalid ? false : a), true);
  }
  get invalid() {
    return !this.valid;
  }

  constructor(public src: Wizard.Page, public form: FormGroup) {
    // Convert content to controls, add null check
    this.content = this.src.content
      .map(content => {
        const control = contentControl(content, this.form);
        if (isType.formFieldControl(control)) {
          this.controlsById[control.field] = control.formControl;
        }
        return control;
      })
      .filter(x => (x ? true : false)) as Wizard.ContentArray[];
  }

  public controlsMarkAsTouched() {}
}

export const pageControl = (page: Wizard.Page, form: FormGroup) => {
  return new PageControl(page, form);
};
