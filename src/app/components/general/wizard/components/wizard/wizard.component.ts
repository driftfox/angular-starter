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
import { ActivatedRoute, Router } from '@angular/router';
import { Wizard } from '../../wizard';

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

  constructor(public store: WizardStateService, private ref: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Get base url of wizard location
    this.store.baseUrl =
      '/' +
      this.route.pathFromRoot
        .map(path => (path && path.routeConfig && path.routeConfig.path ? path.routeConfig.path.split('/')[0] : null))
        .filter(x => x as string)
        .join('/');

    // On state changes */
    this.store.state$.pipe(untilDestroyed(this)).subscribe(state => {
      // Update route. Active section and route look at router params
      this.router.navigate([this.store.baseUrl, state.sectionActiveId, state.routeActiveId]);
      // Emit changes to parent
      this.stateChange.emit(state);
    });

    // Notify parent when wizard is complete
    this.store.wizardComplete$.pipe(untilDestroyed(this)).subscribe(() => this.wizardComplete.emit());

    // Push route params to the service
    // Services do not get route changes from the router because they are instantiated first
    this.route.params.pipe(untilDestroyed(this)).subscribe(params => this.store.routeParams$.next(<Wizard.RouteParams>params));

    if (this.debug && this.sections) {
      audit.sectionCheck(this.sections);
    }

    // Dev stuff
    this.store.sectionActive$.subscribe(page => console.log('Section Active', page));
    this.store.pageActive$.subscribe(page => console.log('Page Active', page));
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
    // TODO: Attach templates

    if (this.sections && this.form) {
      // Initialze app
      this.initialize();
    }

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

    // Update store state. Load state if supplied, if not generate default one
    const state = this.state || this.store.stateCreateDefault(this.sections);
    this.store.stateChange(state);
  }

  /**
   * Go to next route or section
   */
  public routeNext() {
    this.store.routeChange('next');
  }

  /**
   * Go to previous route or section
   */
  public routePrev() {
    this.store.routeChange('prev');
  }

  ngOnDestroy() {}
}
