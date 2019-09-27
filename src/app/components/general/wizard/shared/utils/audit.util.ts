/**
 * Check for common errors and issues in the wizard configuration
 */
export const audit = {
  /**
   * Check issues with sections, pages and routes
   */
  sectionCheck: (sections: Wizard.Section[]) => {
    sections.forEach(section => {
      // Make record of pages
      const pages: Record<string, Wizard.Page> = {};
      section.pages.forEach(page => (pages[page.id] = page));
      // Make record of routes
      const routes: Record<string, Wizard.Route> = {};
      // Loop through all routes
      section.routes.forEach(route => {
        // Make sure that each route has a unique ID
        if (!routes[route.id]) {
          routes[route.id] = route;
        } else {
          console.error(`AUDIT: Duplicate routeID of "${route.id}" found in section "${section.id}" `);
        }
        // Make sure that each route has a corresponding page
        if (!pages[route.pageId]) {
          console.error(`AUDIT: Route "${route.id}" in "${section.id}" has an invalid page ID or that page is missing `);
        }
      });
      // Need another loop through records now that the record was built in order to check for the next route
      section.routes.forEach(route => {
        //  Check that the routeNext property for each route goes to a valid route
        // TODO: Add route check
        if (typeof route.routeNext === 'string') {
          if (!routes[route.routeNext]) {
            console.error(`AUDIT: Route "${route.id}" in "${section.id}" goes to a non-existent route id of "${route.routeNext}"`);
          }
        }
      });
      // Check that the section's start route is valid
      if (!routes[section.routeStart]) {
        console.error(`AUDIT: Section "${section.id}" has an invalid routeStart property of "${section.routeStart}"`);
      }
    });
  },
};
