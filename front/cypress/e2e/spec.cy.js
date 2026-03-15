const BASE_URL = 'http://localhost:5173'

const randomEmail = `test${Date.now()}@ecowork.com`

describe('EcoWork — Parcours utilisateur complet', () => {

  it('1 — s\'inscrit avec des données valides', () => {
    cy.visit(`${BASE_URL}/inscription`)
    cy.get('input[name="nom"]').type('Dupont')
    cy.get('input[name="prenom"]').type('Jean')
    cy.get('input[name="email"]').type(randomEmail)
    cy.get('input[name="telephone"]').type('0612345678')
    cy.get('input[name="adresse_postale"]').type('12 rue de Paris, 75011')
    cy.get('#pin-0').type('1')
    cy.get('#pin-1').type('2')
    cy.get('#pin-2').type('3')
    cy.get('#pin-3').type('4')
    cy.get('#pin-4').type('5')
    cy.get('#pin-5').type('6')
    cy.get('button').contains('inscrire', { matchCase: false }).click()
    cy.url().should('not.include', '/inscription')
  })

  it('2 — se connecte avec son compte', () => {
    cy.visit(`${BASE_URL}/login`)
    cy.get('input[type="email"]').type(randomEmail)
    cy.get('#pin-0').type('1')
    cy.get('#pin-1').type('2')
    cy.get('#pin-2').type('3')
    cy.get('#pin-3').type('4')
    cy.get('#pin-4').type('5')
    cy.get('#pin-5').type('6')
    cy.get('button').contains('connecter', { matchCase: false }).click()
    cy.url().should('not.include', '/login')
  })

  it('3 — consulte la liste des espaces', () => {
    cy.visit(`${BASE_URL}/espaces`)
    cy.get('[data-cy="espace-card"]').should('have.length.greaterThan', 0)
  })

  it('4 — voit le détail d\'un espace', () => {
    cy.visit(`${BASE_URL}/espaces`)
    cy.get('[data-cy="espace-card"]').first().click()
    cy.url().should('include', '/espaces/')
  })

  it('5 — réserve un espace avec des dates', () => {
    cy.visit(`${BASE_URL}/login`)
    cy.get('input[type="email"]').type(randomEmail)
    cy.get('#pin-0').type('1')
    cy.get('#pin-1').type('2')
    cy.get('#pin-2').type('3')
    cy.get('#pin-3').type('4')
    cy.get('#pin-4').type('5')
    cy.get('#pin-5').type('6')
    cy.get('button').contains('connecter', { matchCase: false }).click()
    cy.visit(`${BASE_URL}/espaces`)
    cy.get('[data-cy="espace-card"]').first().click()
    cy.url().should('include', '/espaces/')
    cy.get('input[type="date"]').first().type('2026-04-01')
    cy.get('input[type="date"]').last().type('2026-04-03')
    cy.get('button').contains('Réserver', { matchCase: false }).click()
    cy.url().should('include', 'pay.genius.ci')
  })
})