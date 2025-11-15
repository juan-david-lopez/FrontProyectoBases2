describe('App loads', () => {
    it('visits login', () => {
        cy.visit('/login');
        cy.contains('Iniciar sesión');
    });
});


