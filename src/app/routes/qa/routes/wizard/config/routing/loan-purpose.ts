export const routesLoanPurpose: Wizard.Route[] = [
    {
        id: 'routeA',
        pageId: 'pageA',
        routeNext: 'routeB'
    },
    {
        id: 'routeB',
        pageId: 'pageB',
        routeNext: 'routeC'
    },
    {
        id: 'routeC',
        pageId: 'pageC',
        routeNext: ''
    },
];
