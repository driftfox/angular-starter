import { pagesLoanPurpose } from './pages/loan-purpose';
import { routesLoanPurpose } from './routing/loan-purpose';

export const sections: Wizard.Section[] = [
  {
    title: 'Loan Purpose',
    routeStart: '',
    settings: {},
    routing: routesLoanPurpose,
    pages: pagesLoanPurpose,
  },
  {
    title: 'Personal Info',
    routeStart: '',
    settings: {},
    routing: routesLoanPurpose,
    pages: pagesLoanPurpose,
  },
  {
    title: 'Test',
    routeStart: '',
    settings: {},
    routing: routesLoanPurpose,
    pages: pagesLoanPurpose,
  },
];
