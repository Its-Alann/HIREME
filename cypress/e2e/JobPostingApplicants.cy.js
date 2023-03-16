Cypress.on("uncaught:exception", (err, runnable) => false);

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
    cy.visit("http://localhost:3000/myJobs");
    cy.wait(1000);
  });
});

describe("Change the application status to viewed", () => {
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

describe("Change the application status interview", () => {
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

describe("Login to different test account", () => {
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

describe("Remove a job", () => {
  it("remove a job", () => {
    cy.visit("http://localhost:3000/myJobs");
    cy.wait(1000);
    cy.get(
      ':nth-child(3) > .MuiPaper-root > .css-yuob64 > .css-qvcdic-MuiStack-root > [data-cy="view"] > .link'
    )
      .first()
      .click();
    cy.get(".css-gmwslw-MuiStack-root > :nth-child(2) > :nth-child(2)").click();
    cy.get(".MuiDialogActions-root > a > .MuiButtonBase-root").click();
  });
});

describe("Create a new job", () => {
  it("recreates a new job for the one deleted", () => {
    cy.visit("http://localhost:3000/createJob");
    // not a good fix
    // we are waiting for firebase to give the id of the company.
    // we can try cy.spy() on console log.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get("#TextField-Title").type("Tester Job Title");
    cy.get("#TextField-City").type("City");
    cy.get("#TextField-Country").type("Country");
    cy.get("#TextField-Description").type("Tester Job Description");
    cy.get("#TextField-Requirement").type("Tester Job Requirement");
    cy.get("#TextField-Benefits").type("Tester Job Benefits");
    // somehow cannot get date picker by id
    // cy.get("#DatePicker-Deadline").click();
    cy.get("#Button-Save").click();
  });
});
