import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TableComponent } from './components/table/table.component';
import { TableColumnDirective } from './directives/column.directive';
import { TableColumnCellDirective } from './directives/cell-body.directive';
import { TableColumnHeaderDirective } from './directives/cell-header.directive';
import { NtsFormsModule } from '../../forms/forms.module';

const DEPS = [TableComponent, TableColumnDirective, TableColumnCellDirective, TableColumnHeaderDirective];

@NgModule({
  declarations: [DEPS],
  imports: [CommonModule, TableModule, NtsFormsModule],
  exports: [DEPS],
})
export class NtsTableModule {}
