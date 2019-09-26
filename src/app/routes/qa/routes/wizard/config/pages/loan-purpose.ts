export const pagesLoanPurpose: Wizard.Page[] = [
  {
    title: 'Loan Purpose - Page 1',
    id: 'pageA',
    content: [
      {
        type: 'html',
        html: '<strong>Hello World</strong>',
      },
      {
        type: 'row',
        columns: [
          {
            columnSize: 6,
            content: [
              {
                type: 'html',
                html: '<strong>Column A</strong>',
              },
            ],
          },
          {
            columnSize: 6,
            content: [
              {
                type: 'html',
                html: '<strong>Column B</strong>',
              },
            ],
          },
        ],
      },
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
