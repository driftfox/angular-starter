import { isType } from '../utils/isType.util';
import { FormGroup } from '@angular/forms';
import { Wizard } from '../../wizard';
import { arrayIndexMapping } from '../utils/arrays.util';

/**
 * Base content class
 */
class Content implements Wizard.Content {
  public type = this.src.type;
  public data: any | undefined = this.src.data;
  public classes = this.src.classes;
  get hidden() {
    return this.src.hidden || false; // Evaluate rules logic for hidden prop
  }
  constructor(public src: Wizard.Content, public state: Wizard.State) {}
}

/**
 * Form field content type
 */
// tslint:disable-next-line:max-classes-per-file
class FormField extends Content implements Wizard.FormFieldControl {
  public type = this.src.type;
  public field = this.src.field;
  public formFieldType = this.src.formFieldType;
  get formControl(): any {
    return arrayIndexMapping(this.src.field, this.form);
  }
  public placeholder = this.src.placeholder;
  public hint = this.src.hint;
  public tooltip = this.src.tooltip;
  public prefix = this.src.prefix;
  public suffix = this.src.suffix;
  public maxlength = this.src.maxlength;
  public dataField = this.src.dataField;
  public formFieldData = this.src.formFieldData;
  public format = this.src.format;
  public validators = this.src.validators ? { ...this.src.validators } : null;
  public disabled = this.src.disabled;
  public options = this.src.formFieldType === ('select' || 'checkbox' || 'dropdown' || 'radio' || 'toggle') ? this.src.options : undefined;
  constructor(public src: Wizard.FormField, public form: FormGroup, public state: Wizard.State) {
    super(src, state);
  }
}

/**
 * Html content type
 */
// tslint:disable-next-line:max-classes-per-file
class Html extends Content implements Wizard.Html {
  public type = this.src.type;
  get html() {
    return this.src.html; // String replacer here
  }
  constructor(public src: Wizard.Html, public state: Wizard.State) {
    super(src, state);
  }
}

/**
 * Feature content type
 */
// tslint:disable-next-line:max-classes-per-file
class Feature extends Content implements Wizard.Feature {
  public type = this.src.type;
  public featureId = this.src.featureId;
  constructor(public src: Wizard.Feature, public state: Wizard.State) {
    super(src, state);
  }
}

/**
 * Row content type
 */
// tslint:disable-next-line:max-classes-per-file
class Row extends Content implements Wizard.Row {
  public type = this.src.type;
  public columns = this.src.columns;

  constructor(public src: Wizard.Row, public state: Wizard.State) {
    super(src, state);
  }
}

/**
 * Create a content control from a content type
 * @param content
 */
export const contentControl = (
  content: Wizard.FormField | Wizard.Html | Wizard.Row | Wizard.Feature,
  form: FormGroup,
  state: Wizard.State,
) => {
  if (isType.formField(content)) {
    return new FormField(<Wizard.FormField>content, form, state);
  } else if (isType.html(content)) {
    return new Html(<Wizard.Html>content, state);
  } else if (isType.row(content)) {
    return new Row(<Wizard.Row>content, state);
  } else if (isType.feature(content)) {
    return new Feature(<Wizard.Feature>content, state);
  } else {
    console.error('A type was not specified for this content type', content);
  }
};
