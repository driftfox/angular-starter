import { pagesLoanPurpose } from './pages/loan-purpose';
import { routesLoanPurpose } from './routing/loan-purpose';
import { routesPersonal } from './routing/personal';
import { pagesPersonal } from './pages/personal';

export const sections: Wizard.Section[] = [
  {
    title: 'Loan Purpose',
    id: 'loan-purpose',
    routeStart: 'lpRouteA',
    settings: {},
    routes: routesLoanPurpose,
    pages: pagesLoanPurpose,
  },
  {
    title: 'Personal Info',
    id: 'personal-info',
    routeStart: 'routePersonalA',
    settings: {},
    routes: routesPersonal,
    pages: pagesPersonal,
  },
  {
    title: 'Test',
    id: 'test',
    routeStart: 'routeA',
    settings: {},
    routes: routesLoanPurpose,
    pages: pagesLoanPurpose,
  },
];
