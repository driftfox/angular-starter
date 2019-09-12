import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { sectionControl } from '../../shared/factories/section.factory';
import { WizardStateService } from '../../shared/services/wizard-state.service';

@Component({
  selector: 'nts-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() sections: Wizard.Section[] | undefined;
  @Input() state: Wizard.State | undefined;

  @Input() sectionActiveId: string | undefined;
  @Input() pageActiveId: string | undefined;

  private loaded = false;

  constructor(private store: WizardStateService) {}

  ngOnInit() {
    // this.store.sections$.subscribe(res => console.log('Sections', res));
    // this.store.state$.subscribe(res => console.log('State', res));
    // this.store.sectionActive$.subscribe(res => console.log('Section Active', res));
    // this.store.pageActive$.subscribe(res => console.log('Page Active', res));
  }

  ngOnChanges(model: SimpleChanges) {
    // Ignore changes until app is loaded
    if (!this.loaded) {
      return;
    }
    // When new sections are passed in
    if (model.sections && this.sections) {
      this.store.sectionsAdd(this.sections.map(section => sectionControl(section)));
      // TODO: Need to reset wizard if this happens
    }

    // When a new sectionActive is passed in
    if (model.sectionActive && this.sectionActiveId) {
      this.store.sectionChange(this.sectionActiveId);
    }

    // When a new state object is passed in
    if (model.state) {
      // TODO: Handle state object changes
    }
  }

  ngAfterViewInit() {
    // Attach templates

    // Initialze app
    this.initialize();
    // Mark app loaded to enable ngOnChanges
    this.loaded = true;
  }

  /**
   * Create the initial state of the wizard
   */
  private initialize() {
    // Null check
    if (!this.sections) {
      console.warn('No sections passed to wizard');
      return;
    }

    // Null check sections
    // Convert sections to section controls
    const sectionControls = this.sections.map(section => sectionControl(section));
    console.log('sectionControls', sectionControls);
    sectionControls[0].setActive();
    // Load section controls into store
    this.store.sectionsAdd(sectionControls);

    setTimeout(() => {
      sectionControls[1].setActive();
    })
    
    // Determine starting section
    // First see if one was supplied via state object, then check sectionActiveID input then default to first section
    if (this.state && this.state.sectionActiveId) {
      this.store.sectionChange(this.state.sectionActiveId);
    } else if (this.sectionActiveId) {
      this.store.sectionChange(this.sectionActiveId);
    } else {
      this.store.sectionChange(sectionControls[0].uniqueId);
    }
  }

}
