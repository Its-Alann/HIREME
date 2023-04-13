/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("accountcreation@test.com");
    cy.get("#password").type("test123");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
});

describe("Goes to job application", () => {
  it("navigates to the first job", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-cy="Jobs-test"]').click();
    cy.wait(500);
    cy.get(
      ':nth-child(5) > .MuiPaper-root > .MuiList-root > [data-cy="view-job-test"]'
    ).click();
    cy.wait(500);
    cy.get(
      ":nth-child(3) > .MuiPaper-root > .MuiBox-root > .css-qvcdic-MuiStack-root > :nth-child(1) > .link"
    ).click();
    cy.wait(500);
    cy.get(
      ".css-1mhd35f-MuiStack-root > .MuiBox-root > .MuiButtonBase-root"
    ).click();
  });
});

describe("Fills application", () => {
  it("enters invalid form entries", () => {
    cy.visit(
      "http://localhost:3000/jobApplication/VtimBR90MAReVayXpEhl/0bjJWxYvMEVavadXDhBx"
    );
    cy.get("#mui-1").type("1234");
    cy.get('[data-testid="submit-button"]').click();
    cy.get("#mui-2").type("aaaaa");
    cy.get('[data-testid="submit-button"]').click();
    cy.get("#mui-2").type("11");
    cy.get('[data-testid="submit-button"]').click();
    cy.get("#mui-3").type("something street");
    cy.get('[data-testid="submit-button"]').click();
  });

  it("enters invalid form entries", () => {
    cy.visit(
      "http://localhost:3000/jobApplication/VtimBR90MAReVayXpEhl/0bjJWxYvMEVavadXDhBx"
    );
    cy.wait(500);
    cy.get("#mui-1").type("1234@test.com");
    cy.get("#mui-2").type("1111111111");
    cy.get("#mui-3").type("something street");
    cy.get('[data-testid="submit-button"]').click();
  });

  it("uploads files", () => {
    cy.visit(
      "http://localhost:3000/jobApplication/VtimBR90MAReVayXpEhl/0bjJWxYvMEVavadXDhBx"
    );
    // upload file
    cy.get(".MuiList-root > :nth-child(1) > .MuiButtonBase-root").selectFile(
      "cypress/fixtures/IMG_0524.jpg"
    );
    cy.wait(1000);

    // click file to view
    cy.get(
      ":nth-child(1) > .css-dvxtzn > .css-w4z10b-MuiStack-root > .MuiButton-root"
    ).click();

    // click file to delete
    cy.get(
      ":nth-child(1) > .css-dvxtzn > .css-w4z10b-MuiStack-root > .MuiBox-root > .MuiButtonBase-root"
    ).click();

    // upload file
    cy.get(".MuiList-root > :nth-child(1) > .MuiButtonBase-root").selectFile(
      "cypress/fixtures/IMG_0524.jpg"
    );
    cy.wait(1000);

    // upload file 2
    cy.get(".MuiList-root > :nth-child(2) > .MuiButtonBase-root").selectFile(
      "cypress/fixtures/IMG_0524.jpg"
    );
    cy.wait(1000);

    // click file 2 to view
    cy.get(
      ":nth-child(2) > .css-dvxtzn > .css-w4z10b-MuiStack-root > .MuiButton-root"
    ).click();

    // click file 2 to delete
    cy.get(
      ":nth-child(2) > .css-dvxtzn > .css-w4z10b-MuiStack-root > .MuiBox-root"
    ).click();

    // upload file 2
    cy.get(".MuiList-root > :nth-child(2) > .MuiButtonBase-root").selectFile(
      "cypress/fixtures/IMG_0524.jpg"
    );
    cy.wait(1000);

    // upload file 3
    cy.get(".MuiList-root > :nth-child(3) > .MuiButtonBase-root").selectFile(
      "cypress/fixtures/IMG_0524.jpg"
    );
    cy.wait(1000);

    // click file 3 to view
    cy.get(
      ":nth-child(3) > .css-dvxtzn > .css-w4z10b-MuiStack-root > .MuiButton-root > .MuiTypography-root"
    ).click();
    // click file 3 to delete
    cy.get(
      ":nth-child(3) > .css-dvxtzn > .css-w4z10b-MuiStack-root > .MuiBox-root"
    ).click();
    // upload file 3
    cy.get(".MuiList-root > :nth-child(3) > .MuiButtonBase-root").selectFile(
      "cypress/fixtures/IMG_0524.jpg"
    );
    cy.wait(1000);

    cy.get("#mui-1").type("1234@test.com");
    cy.get("#mui-2").type("1111111111");
    cy.get("#mui-3").type("something street");
    cy.get('[data-testid="submit-button"]').click();
    cy.wait(3000);
  });
});
