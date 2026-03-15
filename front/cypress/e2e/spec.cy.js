const BASE_URL = 'http://localhost:5173'

describe('Auth', () => {
  it('peut accéder à la page login', () => {
    cy.visit(`${BASE_URL}/login`)
    cy.contains('Connexion').should('exist')
  })

  it('login échoue avec mauvais pin', () => {
    cy.visit(`${BASE_URL}/login`)
    cy.get('input[type="email"]').type('axelteky333@gmail.com')
    cy.get('#pin-0').type('0')
    cy.get('#pin-1').type('0')
    cy.get('#pin-2').type('0')
    cy.get('#pin-3').type('0')
    cy.get('#pin-4').type('0')
    cy.get('#pin-5').type('0')
    cy.get('button').contains('Se connecter').click()
    cy.contains('Identifiants').should('exist')
  })

  it('login réussit et redirige', () => {
    cy.visit(`${BASE_URL}/login`)
    cy.get('input[type="email"]').type('axelteky333@gmail.com')
    cy.get('#pin-0').type('2')
    cy.get('#pin-1').type('1')
    cy.get('#pin-2').type('0')
    cy.get('#pin-3').type('8')
    cy.get('#pin-4').type('0')
    cy.get('#pin-5').type('4')
    cy.get('button').contains('Se connecter').click()
    cy.url().should('not.include', '/login')
  })
})

describe('Espaces', () => {
  it('affiche la liste des espaces', () => {
    cy.visit(`${BASE_URL}/espaces`)
    cy.get('[data-cy="espace-card"]').should('have.length.greaterThan', 0)
  })

  it('peut voir le détail d\'un espace', () => {
    cy.visit(`${BASE_URL}/espaces`)
    cy.get('[data-cy="espace-card"]').first().click()
    cy.url().should('include', '/espaces/')
  })
})