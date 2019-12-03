import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[table-header-template]' })
export class TableColumnHeaderDirective {
  constructor(public template: TemplateRef<any>) {}
}
