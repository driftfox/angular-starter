import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardComponent } from './components/wizard/wizard.component';
import { SectionComponent } from './components/section/section.component';
import { PageComponent } from './components/page/page.component';
import { ContentComponent } from './components/content/content.component';

@NgModule({
  declarations: [WizardComponent, SectionComponent, PageComponent, ContentComponent],
  imports: [CommonModule],
  exports: [WizardComponent],
})
export class NtsWizardModule {}
