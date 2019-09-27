export const routesPersonal: Wizard.Route[] = [
    {
        id: 'routePersonalA',
        pageId: 'pageA',
        url: 'page-2-1',
        routeNext: 'routePersonalB'
    },
    {
        id: 'routePersonalB',
        pageId: 'pageB',
        url: 'page-2-2',
        routeNext: 'routePersonalC'
    },
    {
        id: 'routePersonalC',
        pageId: 'pageC',
        url: 'page-2-3',
        sectionComplete: true
    },
];
