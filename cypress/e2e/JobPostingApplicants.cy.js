/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("billybob@gmail.com");
    cy.get("#password").type("bob123@");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
});

describe("Display Job Posting", () => {
  it("visits the job listings page", () => {
    cy.visit("http://localhost:3000/browseJobs");
    cy.wait(1000);
  });

  it("clicks on job listing with applicants", () => {
    cy.visit("http://localhost:3000/browseJobs");
    cy.wait(1000);
    cy.get(
      ":nth-child(4) > .MuiPaper-root > .MuiBox-root > .css-qvcdic-MuiStack-root > :nth-child(2) > .link"
    ).click();
  });
});

describe("Change the application status for Hanni Pham - viewed", () => {
  it("visits the job listing page with applicants", () => {
    cy.visit(
      "http://localhost:3000/viewJobPostingApplicants/JpaQGBNwlTslSujkwX2C/4QwjqeYxPRuDw7fOnKBj"
    );
    cy.wait(1000);
  });

  it("selects Hanni Pham from the list of applicants and changes application status to rejected", () => {
    cy.visit(
      "http://localhost:3000/viewJobPostingApplicants/JpaQGBNwlTslSujkwX2C/4QwjqeYxPRuDw7fOnKBj"
    );
    cy.wait(1000);
    cy.get(
      ":nth-child(2) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root"
    ).click();
    cy.get(".MuiSelect-select").click();
    cy.get('[data-value="rejected"]').click();
    cy.get(".css-1acyv19 > .MuiButton-root").click();
    cy.get(
      ":nth-child(2) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-root"
    ).should("have.text", "rejected");
  });
});

describe("Change the application status for Hanni Pham - viewed", () => {
  it("visits the job listing page with applicants", () => {
    cy.visit(
      "http://localhost:3000/viewJobPostingApplicants/JpaQGBNwlTslSujkwX2C/4QwjqeYxPRuDw7fOnKBj"
    );
    cy.wait(1000);
  });

  it("selects Hanni Pham from the list of applicants and changes application status to interview", () => {
    cy.visit(
      "http://localhost:3000/viewJobPostingApplicants/JpaQGBNwlTslSujkwX2C/4QwjqeYxPRuDw7fOnKBj"
    );
    cy.wait(1000);
    cy.get(
      ":nth-child(2) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root"
    ).click();
    cy.get(".MuiSelect-select").click();
    cy.get('[data-value="interview"]').click();
    cy.get(".css-1acyv19 > .MuiButton-root").click();
    cy.get(
      ":nth-child(2) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root > .MuiTypography-root"
    ).should("have.text", "interview");
  });
});

describe("Exit from popup window", () => {
  it("click on popup", () => {
    cy.visit(
      "http://localhost:3000/viewJobPostingApplicants/JpaQGBNwlTslSujkwX2C/4QwjqeYxPRuDw7fOnKBj"
    );
    cy.wait(1000);
    cy.get(
      ":nth-child(2) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root"
    ).click();
    cy.get(".css-1acyv19 > .MuiBox-root > .MuiButtonBase-root").click();
  });
});
