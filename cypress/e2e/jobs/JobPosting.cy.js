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
    cy.wait(3000);
  });
});

describe("Display Job Posting", () => {
  it("visits the job listings page", () => {
    cy.visit("http://localhost:3000/browseJobs");
    cy.wait(1000);
  });

  it("clicks on the first listing", () => {
    cy.visit("http://localhost:3000/browseJobs");
    cy.wait(1000);
    cy.get(
      ":nth-child(3) > .MuiPaper-root > .MuiBox-root > .css-qvcdic-MuiStack-root > :nth-child(1) > .link"
    ).click();
  });
});

describe("Display unique job posting", () => {
  it("visits unique job posting page", () => {
    cy.visit(
      "http://localhost:3000/viewJobPosting/npx38jzGfcSJNhpN5LJx/CC1SEANIn2nmuSluL5ij"
    );
    cy.wait(1000);
  });

  it("shows job title", () => {
    cy.visit(
      "http://localhost:3000/viewJobPosting/npx38jzGfcSJNhpN5LJx/CC1SEANIn2nmuSluL5ij"
    );
    cy.wait(1000);
    cy.get(".MuiTypography-h4").should("have.text", "Food Supplier");
  });

  it("shows job company", () => {
    cy.visit(
      "http://localhost:3000/viewJobPosting/npx38jzGfcSJNhpN5LJx/CC1SEANIn2nmuSluL5ij"
    );
    cy.wait(1000);
    cy.get(".css-1d9cypr-MuiStack-root > .css-0 > :nth-child(2)").should(
      "have.text",
      "Microsoft"
    );
  });

  it("shows job company city and country", () => {
    cy.visit(
      "http://localhost:3000/viewJobPosting/npx38jzGfcSJNhpN5LJx/CC1SEANIn2nmuSluL5ij"
    );
    cy.wait(1000);
    cy.get(".css-0 > :nth-child(3)").should("have.text", "Las Vegas, Nevada");
  });

  it("shows job last date to apply", () => {
    cy.visit(
      "http://localhost:3000/viewJobPosting/npx38jzGfcSJNhpN5LJx/CC1SEANIn2nmuSluL5ij"
    );
    cy.wait(1000);
    cy.get(".css-bqdipl-MuiTypography-root").should(
      "have.text",
      "Deadline: Fri Oct 20 2023"
    );
  });

  it("shows job about", () => {
    cy.visit(
      "http://localhost:3000/viewJobPosting/npx38jzGfcSJNhpN5LJx/CC1SEANIn2nmuSluL5ij"
    );
    cy.wait(1000);
    cy.get(".css-1v3caum > .css-1jv6ejj-MuiTypography-root").should(
      "have.text",
      "About the job"
    );
  });

  it("shows job about info", () => {
    cy.visit(
      "http://localhost:3000/viewJobPosting/npx38jzGfcSJNhpN5LJx/CC1SEANIn2nmuSluL5ij"
    );
    cy.wait(1000);
    cy.get(".css-1v3caum > .css-1augsz5-MuiTypography-root").should(
      "have.text",
      "Power uses a lot of blood during her battle, be ready to donate your blood."
    );
  });

  it("shows job requirements", () => {
    cy.visit(
      "http://localhost:3000/viewJobPosting/npx38jzGfcSJNhpN5LJx/CC1SEANIn2nmuSluL5ij"
    );
    cy.wait(1000);
    cy.get(":nth-child(2) > .css-1jv6ejj-MuiTypography-root").should(
      "have.text",
      "Requirements"
    );
  });

  it("shows job requirements info", () => {
    cy.visit(
      "http://localhost:3000/viewJobPosting/npx38jzGfcSJNhpN5LJx/CC1SEANIn2nmuSluL5ij"
    );
    cy.wait(1000);
    cy.get(":nth-child(2) > .css-1augsz5-MuiTypography-root").should(
      "have.text",
      "5000 IQ"
    );
  });

  it("clicks on apply button", () => {
    cy.visit(
      "http://localhost:3000/viewJobPosting/npx38jzGfcSJNhpN5LJx/CC1SEANIn2nmuSluL5ij"
    );
    cy.wait(1000);
    cy.get(
      ".css-1mhd35f-MuiStack-root > .MuiBox-root > .MuiButtonBase-root"
    ).click();
  });
});
