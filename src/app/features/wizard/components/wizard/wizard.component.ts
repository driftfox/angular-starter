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
  OnDestroy,
} from '@angular/core';
import { WizardStateService } from '../../shared/services/wizard-state.service';
import { FormGroup } from '@angular/forms';
import { audit } from '../../shared/utils/audit.util';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'nts-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() sections: Wizard.Section[] | undefined;
  @Input() state: Wizard.State | undefined;
  @Input() form: FormGroup | undefined;

  @Input() sectionActiveId: string | undefined;
  @Input() pageActiveId: string | undefined;
  /** Run some helpful checking on incoming configuration to catch common errors and issues */
  @Input() debug = true;

  @Output() ready = new EventEmitter<any>();
  @Output() stateChange = new EventEmitter<Wizard.State>();
  @Output() wizardComplete = new EventEmitter<void>();

  /** App has finished loading */
  public loaded = false;

  constructor(public store: WizardStateService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    // Notify parent of state changes
    this.store.state$.pipe(untilDestroyed(this)).subscribe(state => this.stateChange.emit(state));
    // Notify parent when wizard is complete
    this.store.wizardComplete$.pipe(untilDestroyed(this)).subscribe(() => this.wizardComplete.emit());

    this.store.pageActive$.subscribe(page => console.log(page));
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

  ngOnDestroy() {}
}
