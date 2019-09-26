import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { WizardStateService } from '../../shared/services/wizard-state.service';
import { FormGroup } from '@angular/forms';
import { audit } from '../../shared/utils/audit.util';

@Component({
  selector: 'nts-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() sections: Wizard.Section[] | undefined;
  @Input() state: Wizard.State | undefined;
  @Input() form: FormGroup | undefined;

  @Input() sectionActiveId: string | undefined;
  @Input() pageActiveId: string | undefined;
  /** Run some helpful checking on incoming configuration to catch common errors and issues */
  @Input() debug = true;

  @Output() wizardComplete = new EventEmitter<void>();

  public loaded = false;

  constructor(public store: WizardStateService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.store.wizardComplete$.subscribe(() => this.wizardComplete.emit());
    this.store.sections$.subscribe(res => console.log('Sections', res));
    this.store.state$.subscribe(res => console.log('State', res));
    this.store.sectionActive$.subscribe(section => console.log('Section Active', section));
    this.store.pageActive$.subscribe(res => console.log('Page Active', res));
  }

  ngOnChanges(model: SimpleChanges) {
    // Ignore changes until app is loaded
    if (!this.loaded) {
      return;
    }
    // When new sections are passed in
    if (model.sections && this.sections && this.form) {
      this.store.sectionsAdd(this.sections, this.form);
      // TODO: Need to reset wizard if this happens
    }

    // When a new sectionActive is passed in
    if (model.sectionActive && this.sectionActiveId) {
      // this.store.sectionChange(this.sectionActiveId);
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
    this.ref.detectChanges();
  }

  /**
   * Create the initial state of the wizard
   */
  private initialize() {
    // Null check
    if (!this.sections || !this.form) {
      console.warn('No sections or form passed to wizard');
      return;
    }

    // Convert sections to section controls
    // Not picking up null check
    // Load section controls into store
    this.store.sectionsAdd(this.sections, this.form);

    if (this.debug) {
      audit.sectionCheck(this.sections);
    }
    
    // Update store state. Load state if supplied, if not generate default one
    this.store.stateChange(this.state || this.store.stateCreateDefault(this.sections));

    /**
    setTimeout(() => {
      this.store.routeChange('next');
      this.store.routeChange('next');
      this.store.routeChange('next');
    }, 1000);

    setTimeout(() => {
      this.store.sectionChange('prev');
      this.store.routeChange('prev');

    }, 2000);

    setTimeout(() => {
     this.store.sectionChange('next');
     this.store.routeChange('next');
     // this.store.routeChange('next');
    }, 3000);

    setTimeout(() => {
      // this.store.routeChange('next');
    }, 4000);
 */
  }

  public routeNext() {
    this.store.routeChange('next');
  }

  public routePrev() {
    this.store.routeChange('prev');
  }
}
