import { pagesLoanPurpose } from './pages/loan-purpose';
import { routesLoanPurpose } from './routing/loan-purpose';
import { routesPersonal } from './routing/personal';
import { pagesPersonal } from './pages/personal';
import { Wizard } from 'src/app/components/general/wizard/wizard';

export const sections: Wizard.Section[] = [
  {
    title: 'Loan Purpose',
    id: 'loan-purpose',
    routeStart: 'loan-type',
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
  /**
  {
    title: 'Test',
    id: 'test',
    routeStart: 'lpRouteA',
    settings: {},
    routes: routesLoanPurpose,
    pages: pagesLoanPurpose,
  },
   */
];
