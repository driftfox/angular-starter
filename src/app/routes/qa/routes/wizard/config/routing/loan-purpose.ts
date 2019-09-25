export const routesLoanPurpose: Wizard.Route[] = [
    {
        id: 'lpRouteA',
        pageId: 'pageA',
        routeNext: 'lpRouteB'
    },
    {
        id: 'lpRouteB',
        pageId: 'pageB',
        routeNext: 'lpRouteC'
    },
    {
        id: 'lpRouteC',
        pageId: 'pageC',
        sectionComplete: true,
    },
];
