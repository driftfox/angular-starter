import { WizardContentTypes } from '../../wizard.enums';
import { Wizard } from '../../wizard';

// content: (FormField | Html | Feature | Buttons | Layout)[];

/**
 * Base content class
 */
class Content implements Wizard.Content {
  public type!: WizardContentTypes;
  public data: any | undefined = this.src.data;
  public classes = this.src.classes;
  get hidden() {
    return this.src.hidden || false; // Evaluate rules logic for hidden prop
  }
  constructor(public src: Wizard.Content) {}
}

/**
 * Form field content type
 */
// tslint:disable-next-line:max-classes-per-file
class FormField extends Content {
  public field = this.src.field;
  public formFieldType = this.src.formFieldType;
  public placeholder = this.src.placeholder;
  public hint = this.src.hint;
  public tooltip = this.src.tooltip;
  public prefix = this.src.prefix;
  public suffix = this.src.suffix;
  public minlength = this.src.minlength;
  public maxlength = this.src.maxlength;
  public dataField = this.src.dataField;
  public formFieldData = this.src.formFieldData;
  public format = this.src.format;
  public validators = this.src.validators ? { ...this.src.validators } : null;
  public disabled = this.src.disabled;
  constructor(public src: Wizard.FormField) {
    super(src);
  }
}

/**
 * Html content type
 */
// tslint:disable-next-line:max-classes-per-file
class Html extends Content implements Wizard.Html {
    type = WizardContentTypes.html;
  get html() {
    return this.src.html; // String replacer here
  }
  constructor(public src: Wizard.Html) {
    super(src);
  }
}

/**
 * Row content type
 */
// tslint:disable-next-line:max-classes-per-file
class Row extends Content {
  public columns: Wizard.Column[];
  constructor(public src: Wizard.Row) {
    super(src);
    // Convert all of the nested content types in each column to a control
    this.columns = src.columns.map(column => {
        return <Wizard.Column>{
            ...column,
            content: column.content.map(content => contentControl(content))
        };
    });
  }
}

/**
 * Create a content control from a content type
 * @param content 
 */
export const contentControl = <t>(content: Wizard.FormField | Wizard.Html | Wizard.Row): t | undefined => {
  switch (content.type) {
    case WizardContentTypes.formField:
      return <Wizard.FormField>new FormField(<Wizard.FormField>content);
    case WizardContentTypes.html:
      return new Html(<Wizard.Html>content);
    case WizardContentTypes.row:
      return <Wizard.Row>new Row(<Wizard.Row>content);
    // Default to form field to make TS happy
    default:
      console.error('A type was not specified for this content type', content);
  }
};

const temp = contentControl<Wizard.Html>(<Wizard.Html>{
    type: WizardContentTypes.html,
    html: ''
})