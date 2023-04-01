Cypress.on("uncaught:exception", (err, runnable) => false);

//Redundant tests need to be removed

/* eslint-disable cypress/no-unnecessary-waiting */
describe("Test the navbar component", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000");
  });

  describe("Click buttons on navbar when logged in and verifies the links", () => {
    it("clicks on navbar links", () => {
      cy.login();
      cy.get('[data-cy="Home-test"]').click();
      cy.url().should("eq", "http://localhost:3000/");
      cy.get('[data-cy="Messaging-test"]').click();
      cy.url().should("eq", "http://localhost:3000/messaging");
      cy.get('[data-cy="My Jobs-test"]').click();
      cy.url().should("eq", "http://localhost:3000/myJobs");
      // cy.get('[data-cy="Network-test"]').click();
      // cy.url().should("eq", "http://localhost:3000/network");
    });

    it("clicks on navbar links on mobile resolution", () => {
      cy.viewport(390, 844);
      cy.login();

      //open menu
      cy.get('[data-cy="phone-menu-test"]').within(() =>
        cy.get("Button").click()
      );
      //click first option
      cy.get('[data-cy="Home-phone-test"]').should("be.visible").click();
      //verify link
      cy.url().should("eq", "http://localhost:3000/");

      //open menu
      cy.get('[data-cy="phone-menu-test"]').within(() =>
        cy.get("Button").click()
      );
      //click second option
      cy.get('[data-cy="Messaging-phone-test"]').click();
      //verify link
      cy.url().should("eq", "http://localhost:3000/messaging");

      //open menu
      cy.get('[data-cy="phone-menu-test"]').within(() =>
        cy.get("Button").click()
      );
      //click third option
      cy.get('[data-cy="My Jobs-phone-test"]').should("be.visible").click();
      //verify link
      cy.url().should("eq", "http://localhost:3000/myJobs");

      //open menu
      cy.get('[data-cy="phone-menu-test"]').within(() =>
        cy.get("Button").click()
      );
      //click fourth option
      // cy.get('[data-cy="Network-phone-test"]').click();
      //verify link
      // cy.url().should("eq", "http://localhost:3000/network");
    });

    it("open user menu on mobile resolution and select Profile", () => {
      cy.login();
      cy.viewport(390, 844);
      cy.get('[data-cy="userBox"]').within(() =>
        cy.get('[data-cy="userMenu"]').click()
      );
      cy.get('[data-cy="Profile-phone-test"]').click();

      cy.logout();
      cy.login();
      cy.visit("http://localhost:3000");
    });

    it("open user menu on mobile resolution and select Account", () => {
      cy.login();
      cy.viewport(390, 844);
      cy.get('[data-cy="userBox"]').within(() =>
        cy.get('[data-cy="userMenu"]').click()
      );
      cy.get('[data-cy="Account-phone-test"]').click();

      cy.logout();
      cy.login();
      cy.visit("http://localhost:3000");
    });

    it("open user menu on mobile resolution and select Dashboard", () => {
      cy.login();
      cy.viewport(390, 844);
      cy.get('[data-cy="userBox"]').within(() =>
        cy.get('[data-cy="userMenu"]').click()
      );
      cy.get('[data-cy="Dashboard-phone-test"]').click();

      cy.logout();
      cy.login();
      cy.visit("http://localhost:3000");
    });

    it("open user menu on mobile resolution and log out", () => {
      cy.wait(1000);
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000");
      cy.logout();
      cy.login();

      cy.get('[data-cy="userBox"]').within(() =>
        cy.get('[data-cy="userMenu"]').click()
      );

      cy.get('[data-cy="logout-test"]').click();
      cy.wait(1000);
    });
  });

  describe("Click buttons on navbar when logged out", () => {
    it("clicks on jobs", () => {
      cy.visit("http://localhost:3000");
      cy.logout();
      cy.get('[data-cy="Jobs-test"]').click();
      cy.get(
        ':nth-child(5) > .MuiPaper-root > .MuiList-root > [data-cy="view-job-test"]'
      ).click();
      cy.url().should("eq", "http://localhost:3000/browseJobs");
    });

    it("clicks on sign up", () => {
      cy.logout();
      cy.visit("http://localhost:3000");
      cy.get('[data-cy="Sign Up-test"]').click();
      cy.url().should("include", "/SignUp");
    });

    it("clicks on log in", () => {
      cy.logout();
      cy.visit("http://localhost:3000");
      cy.get('[data-cy="Log In-test"]').click();
      cy.url().should("include", "/login");
    });
  });

  //tests by Alan

  describe("Click buttons on navbar when logged in", () => {
    it("Logs into test account", () => {
      cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000/login");
      cy.get("#email").type("editprofile@test.com");
      cy.get("#password").type("test123");
      cy.get("input").tab();
      cy.get(".MuiButton-contained").click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
    });

    it("clicks on home", () => {
      cy.login();
      cy.viewport(1920, 1080);
      // cy.visit("http://localhost:3000/network");
      cy.contains("Home").click();
      cy.url().should("eq", "http://localhost:3000/");
    });

    it("clicks on network", () => {
      cy.login();
      cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000");
      // cy.contains("Network").click();
      // cy.url().should("include", "/network");
    });

    it("clicks on jobs/view applied jobs", () => {
      cy.login();
      cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000");
      cy.wait(1000);

      cy.get('[data-cy="Jobs-test"]').click();
      cy.get(
        ':nth-child(6) > .MuiPaper-root > .MuiList-root > [data-cy="view-applied-job-test"]'
      ).click();
      cy.wait(1000);

      // cy.get(
      //   ':nth-child(6) > .MuiPaper-root > .MuiList-root > [data-cy="view-job-test"]'
      // ).click();
      cy.url().should("include", "/viewMyApplications");
      cy.url().should("eq", "http://localhost:3000/viewMyApplications");
    });

    it("clicks on jobs/view jobs", () => {
      cy.login();
      cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000");
      cy.wait(1000);
      cy.get('[data-cy="Jobs-test"]').click();
      cy.get(
        ':nth-child(6) > .MuiPaper-root > .MuiList-root > [data-cy="view-job-test"]'
      ).click();
      cy.wait(1000);
      cy.url().should("include", "/browseJobs");
      cy.url().should("eq", "http://localhost:3000/browseJobs");
    });

    it("clicks on messaging", () => {
      cy.login();
      cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000");
      cy.contains("Messaging").click();
      cy.url().should("include", "/messaging");
    });

    it("clicks on myJobs", () => {
      cy.login();
      cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000");
      cy.contains("My Jobs").click();
      cy.url().should("include", "/myJobs");
    });

    it("clicks on profile", () => {
      cy.login();
      cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000");
      cy.get(".MuiAvatar-root").click();
      cy.contains("Profile").click();
    });

    it("clicks on Account", () => {
      cy.login();
      cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000");
      cy.get(".MuiAvatar-root").click();
      cy.contains("Account").click();
    });

    it("clicks on Dashboard", () => {
      cy.login();
      cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000");
      cy.get(".MuiAvatar-root").click();
      cy.contains("Dashboard").click();
    });

    it("clicks on logout", () => {
      cy.login();
      cy.viewport(1920, 1080);
      cy.visit("http://localhost:3000");
      cy.get(".MuiAvatar-root").click();
      cy.contains("Logout").click();
    });
  });

  describe("Click buttons on navbar when logged in with mobile resolution", () => {
    // it("clicks on home", () => {
    //   cy.login();
    //   cy.viewport(390, 844);
    //   // cy.visit("http://localhost:3000/network");
    //   cy.get('[data-cy="phone-menu-test"]').within(() =>
    //     cy.get("Button").click()
    //   );
    //   cy.wait(500);
    //   cy.get('[data-cy="Home-phone-test"]').click();
    //   cy.wait(500);
    //   cy.url().should("eq", "http://localhost:3000/");
    // });

    // it("clicks on network", () => {
    //   cy.wait(500);
    //   cy.login();
    //   cy.viewport(390, 844);
    //   cy.visit("http://localhost:3000");
    //   cy.get('[data-cy="phone-menu-test"]').within(() =>
    //     cy.get("Button").click()
    //   );
    //   cy.get('[data-cy="Network-phone-test"]').click();
    //   cy.url().should("include", "/network");
    //   cy.wait(500);
    // });

    it("clicks on jobs/view jobs", () => {
      cy.wait(500);
      cy.login();
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000");
      cy.get('[data-cy="phone-menu-test"]').within(() =>
        cy.get("Button").click()
      );
      cy.get('[data-cy="Jobs-phone-test"]').click();
      cy.wait(500);
      cy.get(
        ':nth-child(6) > .MuiPaper-root > .MuiList-root > [data-cy="view-job-test"]'
      ).click();
      cy.wait(500);
      cy.url().should("eq", "http://localhost:3000/browseJobs");
      cy.url().should("include", "/browseJobs");
      cy.wait(500);
    });

    it("clicks on jobs/view applied jobs", () => {
      cy.wait(500);
      cy.login();
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000");
      cy.get('[data-cy="phone-menu-test"]').within(() =>
        cy.get("Button").click()
      );
      cy.get('[data-cy="Jobs-phone-test"]').click();
      cy.wait(500);
      cy.get(
        ':nth-child(6) > .MuiPaper-root > .MuiList-root > [data-cy="view-applied-job-test"]'
      ).click();
      cy.wait(500);
      cy.url().should("eq", "http://localhost:3000/viewMyApplications");
      cy.url().should("include", "/viewMyApplications");
      cy.wait(500);
    });

    it("clicks on messaging", () => {
      cy.wait(500);
      cy.login();
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000");
      cy.get('[data-cy="phone-menu-test"]').within(() =>
        cy.get("Button").click()
      );
      cy.get('[data-cy="Messaging-phone-test"]').click();
      cy.url().should("include", "/messaging");
      cy.wait(500);
    });

    it("clicks on myJobs", () => {
      cy.wait(500);
      cy.login();
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000");
      cy.get('[data-cy="phone-menu-test"]').within(() =>
        cy.get("Button").click()
      );
      cy.get('[data-cy="My Jobs-phone-test"]').click();
      cy.url().should("include", "/myJobs");
      cy.wait(500);
    });

    it("clicks on profile", () => {
      cy.wait(500);
      cy.login();
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000");
      cy.get('[data-cy="userBox"]').within(() => cy.get("Button").click());
      cy.get('[data-cy="Profile-phone-test"]').click();
      cy.wait(500);
    });

    it("clicks on Account", () => {
      cy.wait(500);
      cy.login();
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000");
      cy.get('[data-cy="userBox"]').within(() => cy.get("Button").click());
      cy.get('[data-cy="Account-phone-test"]').click();
      cy.wait(500);
    });

    it("clicks on Dashboard", () => {
      cy.wait(1000);
      cy.login();
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000");
      cy.get('[data-cy="userBox"]').within(() => cy.get("Button").click());
      cy.get('[data-cy="Dashboard-phone-test"]').click();
      cy.wait(1000);
    });

    it("clicks on logout", () => {
      cy.wait(1000);
      cy.login();
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000");
      cy.get('[data-cy="userBox"]').within(() => cy.get("Button").click());
      cy.get('[data-cy="logout-test"]').click();
      cy.wait(1000);
    });
  });

  describe("click menu buttons when logged out on mobile resolution", () => {
    it("click on jobs", () => {
      cy.logout();
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000");
      cy.get("[data-testid='MenuIcon']").click();
      cy.get('[data-cy="Jobs-logged-out-test"]').click();
      cy.get(
        ':nth-child(5) > .MuiPaper-root > .MuiList-root > [data-cy="view-job-test"]'
      ).click();
      cy.url().should("eq", "http://localhost:3000/browseJobs");
    });

    it("click on sign up", () => {
      cy.logout();
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000/login");
      cy.get("[data-testid='MenuIcon']").click();
      cy.get('[data-cy="Sign Up-logged-out-test"]').click();
      cy.url().should("include", "/SignUp");
    });

    it("click on login", () => {
      cy.logout();
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000/signup");
      cy.get("[data-testid='MenuIcon']").click();
      cy.get('[data-cy="Log In-logged-out-test"]').click();
      cy.url().should("include", "/login");
      cy.wait(1000);
    });

    it("click on logout", () => {
      cy.viewport(390, 844);
      cy.login();
      // cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="userBox"]').click();
      cy.get('[data-cy="logout-test"]').should("be.visible").click();
      //click first option
      //verify link
      cy.url().should("eq", "http://localhost:3000/");
    });

    //Integration test for firebase connection
  });
});
