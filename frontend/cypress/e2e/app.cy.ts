/// <reference types="cypress" />

describe('OmniRoute Design System', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Landing Page', () => {
    it('should display the landing page correctly', () => {
      cy.get('h1').should('exist');
      cy.get('nav').should('exist');
    });

    it('should navigate to design system page', () => {
      cy.contains('Design System').click();
      cy.url().should('include', '/design-system');
    });

    it('should navigate to advanced features page', () => {
      cy.contains('Advanced').click();
      cy.url().should('include', '/advanced');
    });

    it('should navigate to community page', () => {
      cy.contains('Community').click();
      cy.url().should('include', '/community');
    });

    it('should navigate to API dashboard', () => {
      cy.contains('API').click();
      cy.url().should('include', '/api-dashboard');
    });
  });

  describe('Navigation', () => {
    it('should have working navigation links', () => {
      cy.get('nav').within(() => {
        cy.contains('Home').should('have.attr', 'href', '/');
        cy.contains('Design System').should('have.attr', 'href', '/design-system');
        cy.contains('Advanced').should('have.attr', 'href', '/advanced');
      });
    });
  });
});