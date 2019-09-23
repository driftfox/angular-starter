export enum WizardStateChange {
  sectionNext,
  sectionPrevious,
  sectionGoTo,
  routeNext,
  routePrevious,
  routeGoTo,
  actionCustom,
  wizardComplete,
}

export enum WizardFormChange {
  arrayAdd,
  arrayRemove,
  arrayIndexChange,
  dataChange,
}

export enum WizardContentTypes {
  formField,
  html,
  feature,
  buttons,
  row,
}
