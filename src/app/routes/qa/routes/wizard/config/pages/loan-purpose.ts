import { Wizard } from 'src/app/components/general/wizard/wizard';

export const pagesLoanPurpose: Wizard.Page[] = [
  {
    title: 'Loan Purpose - Page 1',
    id: 'pageA',
    content: [
      {
        type: 'html',
        html: '<strong>Hello World</strong>',
      },
      /**
      {
        type: 'formField',
        field: 'loanPurpose',
        formFieldType: 'text',
        placeholder: 'This is a placeholder',
      },
      {
        type: 'formField',
        field: 'level1.hello',
        formFieldType: 'text',
        placeholder: 'This is a placeholder',
      },
      {
        type: 'formField',
        field: 'select2.1.hello',
        formFieldType: 'text',
        placeholder: 'This is a placeholder',
      },
       */
      {
        type: 'formField',
        field: 'level1.level2.1.level4',
        formFieldType: 'text',
        placeholder: 'Array Test 1',
      },
      {
        type: 'formField',
        field: 'level1.level2.1.level4.0.level5',
        formFieldType: 'text',
        placeholder: 'Array Test 2',
      },
      /**
      {
        type: 'formField',
        field: 'select',
        formFieldType: 'checkbox',
        placeholder: 'This is a placeholder',
        options: [
          {
            label: 'Option 1',
            value: 1,
          },
          {
            label: 'Option 2',
            value: 2,
          },
        ],
      },
      {
        type: 'row',
        columns: [
          {
            columnSize: 9,
            content: [
              {
                type: 'html',
                html: '<strong>Column A</strong>',
              },
            ],
          },
          {
            columnSize: 3,
            content: [
              {
                type: 'html',
                html: '<strong>Column B</strong>',
              },
            ],
          },
        ],
      },
       */
    ],
  },
  {
    title: 'Loan Purpose - Page 2',
    id: 'pageB',
    content: [],
  },
  {
    title: 'Loan Purpose - Page 3',
    id: 'pageC',
    content: [],
  },
];
