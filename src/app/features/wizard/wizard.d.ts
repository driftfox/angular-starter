declare namespace Wizard {
  export interface State {
    sectionActive: string;
    pageActive: string;
    status: Record<string, SectionStatus>;
  }

  export interface SectionStatus {
    /** Is this the currently active section */
    active: boolean;
    /** Has this section been completed */
    completed: boolean;
    /** Last currently visited page */
    pageLast: string | null;
    /** Has this section been started */
    started: boolean;
  }

  export interface Section {
    /** Human readable section title */
    title: string;
    /** Custom slug to use for url. If not supplied, will be generated from title */
    slug?: string;
    /** Distinct unique ID or GUID for this page. If not supplied, will be generated from title */
    uniqueId?: string;
    /** ID of initial starting route */
    routeStart: string;
    settings: {
      /** Are all previous sections required to be complete before this section is accessible? */
      previousRequired?: boolean;
      /** Is this the last section in the wizard flow */
      isLast?: boolean;
    };
    /** Any custom data needed by this page */
    data?: any | null;
    routing: Route[];
    pages: Page[];
  }

  export interface SectionControl extends Section {
    sectionNext: string | null;
    routing: Record<string, Wizard.Route>;
    pages: Record<string, Wizard.Page>;
    src: Section;
    status: SectionStatus;
  }

  export interface Page {
    /** Human readable page title */
    title?: string;
    /** URL safe string for use in routing. No spaces, uppercase or special characters */
    slug: string;

    titleShort?: string;
    /** Should the title be visible on the page? Title is used for things like analytics */
    titleShow?: boolean;
    /** Data is used to store page information not used by the wizard */
    data?: Record<string, any>;
    canSave?: boolean;
    /** An ID to populate the ariaDescribedBy attribute. Another element on the page needs to have an ID that corresponds. This is for ADA. */
    ariaDescribedById?: string;
    /** Use a custom validator for this page */
    validator?: PageValidator;
    /** The ID of the page validator to use from validators.ts */
    validatorId?: string;
    pageId: string;
    /** Is this the last page in the section, go to next section */
    isLastPage?: boolean;
    content: (FormField | Html | Feature | Buttons | ContentColumns)[];
    /** Show the back button */
    showButtonBack?: boolean;
    /** Show the next button */
    showButtonNext?: boolean;
    /** Actions apply transformations to data or emit actions to parent to perform */
    actions?: Action[];
    /** Should this page hide the section title and remove the extra padding */
    fullscreen?: boolean;
  }

  export interface Route {
    uniqueId: string;
  }
}
