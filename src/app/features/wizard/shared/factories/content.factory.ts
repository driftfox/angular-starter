import { isType } from '../utils/isType.util';

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
  constructor(public src: Wizard.Content) {}
}

/**
 * Form field content type
 */
// tslint:disable-next-line:max-classes-per-file
class FormField extends Content implements Wizard.FormField {
  public type = this.src.type;
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
  public type = this.src.type;
  get html() {
    return this.src.html; // String replacer here
  }
  constructor(public src: Wizard.Html) {
    super(src);
  }
}

/**
 * Feature content type
 */
// tslint:disable-next-line:max-classes-per-file
class Feature extends Content implements Wizard.Feature {
  public type = this.src.type;
  public featureId = this.src.featureId;
  constructor(public src: Wizard.Feature) {
    super(src);
  }
}

/**
 * Row content type
 */
// tslint:disable-next-line:max-classes-per-file
class Row extends Content implements Wizard.Row {
  public type = this.src.type;
  public columns!: Wizard.Column[];
  constructor(public src: Wizard.Row) {
    super(src);
    // Convert all of the nested content types in each column to a control
    /**
    this.columns = src.columns.map(column => {
      return <Wizard.Column>{
        ...column,
        content: column.content.map(content => contentControl(content)),
      };
    });
     */
  }
}

/**
 * Create a content control from a content type
 * @param content
 */
export const contentControl = (content: Wizard.FormField | Wizard.Html | Wizard.Row | Wizard.Feature) => {
  if (isType.formField(content)) {
    return new FormField(<Wizard.FormField>content);
  } else if (isType.html(content)) {
    return new Html(<Wizard.Html>content);
  } else if (isType.row(content)) {
    return new Row(<Wizard.Row>content);
  } else if (isType.feature(content)) {
    return new Feature(<Wizard.Feature>content);
  } else {
    console.error('A type was not specified for this content type', content);
  }
};
