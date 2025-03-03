/// <reference types="cypress" />

describe('Header', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should return error message when URL is empty', () => {
    cy.findByDataCy('input-url').type(' ');
    cy.findByDataCy('submit-button').click();
    cy.findByDataCy('invalid-url-text').should('be.visible');
  });

  it('should return error message when URL is incorrect', () => {
    cy.findByDataCy('input-url').type('https://github.com/facebook');
    cy.findByDataCy('submit-button').click();
    cy.findByDataCy('invalid-url-text').should('be.visible');
  });

  it('should load issues after entering repo URL', () => {
    cy.findByDataCy('input-url').type('https://github.com/facebook/react');
    cy.findByDataCy('submit-button').click();
    cy.findByDataCy('issue-item').should('have.length.greaterThan', 1);
  });
});
