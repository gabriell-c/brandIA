/// <reference types="cypress" />

describe('OmniRoute Design System - E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Landing Page', () => {
    it('should display the landing page', () => {
      cy.get('h1').should('exist');
    });

    it('should have navigation', () => {
      cy.get('nav').should('exist');
    });
  });

  describe('Navigation', () => {
    it('should navigate to Design System page', () => {
      cy.contains('Design System').click();
      cy.url().should('include', '/design-system');
    });

    it('should navigate to Advanced page', () => {
      cy.contains('Advanced').click();
      cy.url().should('include', '/advanced');
    });

    it('should navigate to Community page', () => {
      cy.contains('Community').click();
      cy.url().should('include', '/community');
    });
  });

  describe('API Dashboard', () => {
    it('should navigate to API Dashboard', () => {
      cy.contains('API').click();
      cy.url().should('include', '/api-dashboard');
    });
  });
});