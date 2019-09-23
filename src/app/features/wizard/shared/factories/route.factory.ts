class RouteControl implements Wizard.RouteControl {
  readonly id = this.src.id;
  readonly pageId = this.src.pageId;
  get routeNext() {
    return '';
  }

  constructor(public src: Wizard.Route) {}
}

/**
 * Create a new sectionControl from a section
 * @param section
 */
export const routeControl = (route: Wizard.Route): Wizard.RouteControl => {
  return new RouteControl(route);
};
