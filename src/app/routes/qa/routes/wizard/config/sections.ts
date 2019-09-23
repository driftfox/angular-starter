import { pagesLoanPurpose } from './pages/loan-purpose';
import { routesLoanPurpose } from './routing/loan-purpose';

export const sections: Wizard.Section[] = [
  {
    title: 'Loan Purpose',
    routeStart: 'routeA',
    settings: {},
    routes: routesLoanPurpose,
    pages: pagesLoanPurpose,
  },
  {
    title: 'Personal Info',
    routeStart: 'routeA',
    settings: {},
    routes: routesLoanPurpose,
    pages: pagesLoanPurpose,
  },
  {
    title: 'Test',
    routeStart: 'routeA',
    settings: {},
    routes: routesLoanPurpose,
    pages: pagesLoanPurpose,
  },
];
