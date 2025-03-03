/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    findByDataCy(dataCy: string): Chainable<any>;
    loadIssues(): Promise<Chainable<any>>;
  }
}
