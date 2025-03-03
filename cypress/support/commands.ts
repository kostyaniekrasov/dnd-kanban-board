import '@4tw/cypress-drag-drop';
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('findByDataCy', (dataCy: string) => {
  cy.get(`[data-cy=${dataCy}]`);
});

Cypress.Commands.add('loadIssues', () => {
  cy.findByDataCy('input-url').type('https://github.com/facebook/react');

  cy.intercept(
    'GET',
    'https://api.github.com/repos/facebook/react/issues?state=open&assignee=*',
    {
      statusCode: 200,
      body: [
        {
          id: 2,
          title: 'inProgress',
          created_at: '2023-03-23T18:45:22Z',
          user: { login: 'testinProgress' },

          comments: 2,
          state: 'open',
          status: 'IN_PROGRESS',
          owner: 'inProgress',
          repo: 'inProgress',
        },
      ],
    }
  ).as('getInProgress');
  cy.intercept(
    'GET',
    'https://api.github.com/repos/facebook/react/issues?state=open&assignee=none',
    {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Todo',
          created_at: '2024-01-23T18:45:22Z',
          user: { login: 'testAuthorTodo' },
          comments: 2,
          state: 'open',
          status: 'TODO',
          owner: 'testTodo',
          repo: 'testTodo',
        },
      ],
    }
  ).as('getTodos');
  cy.intercept(
    'GET',
    'https://api.github.com/repos/facebook/react/issues?state=closed',
    {
      statusCode: 200,
      body: [
        {
          id: 3,
          title: 'Done',
          created_at: '2022-03-23T18:45:22Z',
          user: { login: 'testAuthorDone' },
          comments: 2,
          state: 'open',
          status: 'DONE',
          owner: 'Done',
          repo: 'Done',
        },
      ],
    }
  ).as('getDone');
  cy.findByDataCy('submit-button').click();

  cy.wait('@getTodos');
  cy.wait('@getInProgress');
  cy.wait('@getDone');
});
