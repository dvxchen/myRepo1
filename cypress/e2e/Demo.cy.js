describe('Test', { testIsolation: false }, () => {
  before(() => {
    cy.clearCookies();
   });
  it('aaa', () => {
   cy.visit("https://fpa-demo.e17df97.stage.kyma.ondemand.com/dashboard");
   cy.wait(10000);
   cy.get('[id="container-cfodashboard---mainView--jouleProfitBtn-img"]').click({ force: true }); //;
   cy.wait(10000);
   cy.get('[id="container-cfodashboard---mainView--jouleInput-inner"]').clear().type("公司盈利了吗？"); //;
   cy.wait(10000);
   cy.get('[id="container-cfodashboard---mainView--jouleSendBtn-img"]').click({ force: true }); //;
   cy.wait(20000);
   cy.get('[id="container-cfodashboard---mainView--jouleProfitBtn-img"]').click({ force: true }); //;
   cy.wait(10000);
   cy.get('[title="Expand/Collapse"]').click({ force: true }); //;
   cy.wait(10000);
   cy.get(".jouleToolCallYaml").eq(1).invoke('text').then($textA => {
            cy.log($textA);
        });
  });
});