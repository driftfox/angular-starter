import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[table-cell-template]' })
export class TableColumnCellDirective {
  constructor(public template: TemplateRef<any>) {}
}
