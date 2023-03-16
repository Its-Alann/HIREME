Cypress.on("uncaught:exception", (err, runnable) => false);

/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("editprofile@test.com");
    cy.get("#password").type("test123");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
});

describe("Edit Profile Button", () => {
  it("should be clickable", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-testid="editProfileButton"]').click();
  });
});

describe("Edit Profile Page", () => {
  it("display correct", () => {
    cy.visit("http://localhost:3000/editProfile");
  });

  it("write in all input fields", () => {
    cy.visit("http://localhost:3000/editProfile");

    //set all cards to editable
    cy.get('[data-testid="EditIcon"]').each((el) => {
      cy.get(el).click();
    });

    //try all calendars
    cy.get('[data-testid="CalendarIcon"]').each((el) => {
      cy.get(el).click();
      cy.get("button").contains("28").click();
    });

    //contact card
    cy.get('input[name="ContactInfoPhoneNumber"]').type("123");
    cy.get('input[name="ContactInfoAddress"]').type("123");
    cy.get('input[name="ContactInfoCity"]').type("123");
    cy.get('input[name="ContactInfoCountry"]').type("123");
    cy.get('input[name="ContactInfoPostCode"]').type("123");

    //education card
    cy.get('input[name="SchoolName"]').type("abc");
    cy.get('input[name="Degree"]').type("abc");
    cy.get('input[name="Program"]').type("abc");
    cy.get('svg[name="eduAdd"]').click();
    cy.get('svg[name="eduDel"]').click();
    cy.get('button[name="eduPopupDel"]').click();

    //experience card
    cy.get('input[name="CompanyName"]').type("abc");
    cy.get('[type="checkbox"]').check();
    cy.get('input[name="JobPosition"]').type("abc");
    cy.get('input[name="JobLocation"]').type("abc");
    cy.get('input[name="JobDescription"]').type("abc");
    cy.get('svg[name="expAdd"]').click();
    cy.get('svg[name="expDel"]').click();
    cy.get('button[name="expPopupDel"]').click();

    //skill card
    cy.get('input[name="SkillInput"]').type("abc");
    cy.get('svg[name="skillAdd"]').click();
    cy.get('[data-testid="CancelIcon"]').first().click();

    //language card
    cy.get('input[name="Language"]').type("abc");
    cy.get("#language-dropdown").click({ force: true });
    cy.get("li").contains("Fluent").click();
    cy.get('svg[name="langAdd"]').click();
    cy.get('svg[name="langDel"]').click();
    cy.get('button[name="langPopupDel"]').click();

    //project card
    cy.get('input[name="ProjectTitle"]').type("abc");
    cy.get('textarea[name="ProjectDescription"]').type("abc");
    cy.get('svg[name="projAdd"]').click();
    cy.get('svg[name="projDel"]').click();
    cy.get('button[name="projPopupDel"]').click();

    // //volunteering card
    cy.get('input[name="OrgName"]').type("abc");
    cy.get('textarea[name="VolDesc"]').type("abc");
    cy.get('svg[name="volAdd"]').click();
    cy.get('svg[name="volDel"]').click();
    cy.get('button[name="volPopupDel"]').click();

    // //awards card
    cy.get('input[name="AwardTitle"]').type("abc");
    cy.get('input[name="AwardIssuer"]').type("abc");
    cy.get('textarea[name="AwardDescription"]').type("abc");
    cy.get('svg[name="awardAdd"]').click();
    cy.get('svg[name="awardDel"]').click();
    cy.get('button[name="awardPopupDel"]').click();
  });

  it("adds a resume", () => {
    cy.visit("http://localhost:3000/editProfile");
    cy.wait(500);
    cy.get(
      ".css-1cwdt9v-MuiGrid-root > :nth-child(1) > .MuiButtonBase-root"
    ).click();
    cy.get('[name="UploadBtn"]').selectFile("cypress/fixtures/TestPdf.pdf");
    cy.get(":nth-child(2) > .MuiButton-outlined").click();
    cy.wait(1000);
    cy.get(
      '[style="place-content: center; text-align: center;"] > [tabindex="0"]'
    ).click();
    cy.get(
      '[style="place-content: center; text-align: center;"] > :nth-child(2)'
    ).click();
    cy.get("body").click(0, 0);
    cy.get(":nth-child(2) > .MuiButton-text").click();
    cy.wait(1000);
  });

  it("changes profile picture", () => {
    cy.visit("http://localhost:3000/editProfile");
    cy.wait(500);
    cy.get(".MuiAvatar-img").click();
  });

  it("save changes", () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.visit("http://localhost:3000/editProfile");
    cy.scrollTo("bottom", { easing: "linear" });
    cy.get('[data-cy="saveBtn"]').click();
  });
});
