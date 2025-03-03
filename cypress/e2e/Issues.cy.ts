/// <reference types="cypress" />

describe('Issues', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loadIssues();
  });

  it('should return correct length for issues', () => {
    cy.findByDataCy('TODO-item').should('have.length', 1);
    cy.findByDataCy('IN_PROGRESS-item').should('have.length', 1);
    cy.findByDataCy('DONE-item').should('have.length', 1);
  });

  it('should add issue to column', () => {
    cy.get('[data-cy=TODO-item]')
      .trigger('mousedown', { which: 1, pageX: 100, pageY: 100 })
      .trigger('dragstart', { dataTransfer: { setData: () => {} } });

    cy.get('[data-cy=IN_PROGRESS-column]')
      .trigger('dragenter', { force: true })
      .trigger('dragover', { force: true });
    cy.wait(2000);
    cy.get('[data-cy=IN_PROGRESS-column]').trigger('drop', { force: true });
    cy.get('[data-cy=IN_PROGRESS-column]').should('contain', 'Todo');
  });
});
