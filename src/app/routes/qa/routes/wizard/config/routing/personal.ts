export const routesPersonal: Wizard.Route[] = [
    {
        id: 'routePersonalA',
        pageId: 'pageA',
        routeNext: 'routePersonalB'
    },
    {
        id: 'routePersonalB',
        pageId: 'pageB',
        routeNext: 'routePersonalC'
    },
    {
        id: 'routePersonalC',
        pageId: 'pageC',
        sectionComplete: true
    },
];
