export const routesLoanPurpose: Wizard.Route[] = [
    {
        id: 'loan-type',
        pageId: 'pageA',
        routeNext: 'purchase-type'
    },
    {
        id: 'purchase-type',
        pageId: 'pageB',
        routeNext: 're-agent'
    },
    {
        id: 're-agent',
        pageId: 'pageC',
        sectionComplete: true,
    },
];
