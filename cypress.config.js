/* eslint-disable import/no-import-module-exports */
const { defineConfig } = require("cypress");
const cypressFirebasePlugin = require("cypress-firebase").plugin;
const admin = require("firebase-admin");
const webpackPreprocessor = require("@cypress/webpack-preprocessor");

module.exports = defineConfig({
  chromeWebSecurity: false,
  video: false,
  screenshotOnRunFailure: false,

  component: {
    specPattern: "cypress/__tests__/ComponentTesting/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      console.log("setupNodeEvents for components");

      // https://github.com/bahmutov/cypress-code-coverage
      // eslint-disable-next-line global-require
      require("@bahmutov/cypress-code-coverage/plugin")(on, config);
      // eslint-disable-next-line global-require
      require("@cypress/code-coverage/task")(on, config);
      // eslint-disable-next-line global-require
      on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));

      return {
        close: () => {},
        config,
      };
    },

    env: {
      codeCoverageTasksRegistered: false,
    },

    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
      webpackConfig: {
        mode: "development",
        devtool: false,
        module: {
          rules: [
            // application and Cypress files are bundled like React components
            // and instrumented using the babel-plugin-istanbul
            // (we will filter the code coverage for non-application files later)
            {
              test: /\.js/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"],
                  plugins: [
                    // we could optionally insert this plugin
                    // only if the code coverage flag is on
                    "istanbul",
                  ],
                },
              },
            },
          ],
        },
      },
    },
    specs: ["./components"],
  },

  e2e: {
    // setupNodeEvents(on, config) {},
    // specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    // plugins: ["@cypress/code-coverage"],
    // video: false,
    // videoUploadOnPasses: false,
    // viewportWidth: 1920,
    // viewportHeight: 1080,
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    setupNodeEvents(on, config) {
      console.log("setupNodeEvents for components");

      // https://github.com/bahmutov/cypress-code-coverage
      // eslint-disable-next-line global-require
      require("@bahmutov/cypress-code-coverage/plugin")(on, config);
      // eslint-disable-next-line global-require
      require("@cypress/code-coverage/task")(on, config);
      // eslint-disable-next-line global-require
      on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));

      return {
        close: () => {},
        config,
      };
    },

    env: {
      codeCoverageTasksRegistered: true,
    },

    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
      webpackConfig: {
        mode: "development",
        devtool: false,
        module: {
          rules: [
            // application and Cypress files are bundled like React components
            // and instrumented using the babel-plugin-istanbul
            // (we will filter the code coverage for non-application files later)
            {
              test: /\.js/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"],
                  plugins: [
                    // we could optionally insert this plugin
                    // only if the code coverage flag is on
                    "istanbul",
                  ],
                },
              },
            },
          ],
        },
      },
    },
    specs: ["./components"],
  },

  e2e: {
    baseUrl: "http://localhost:3000",
    async setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);

      const file = config.env.configFile || "dev";
      const envConfig = await getConfigurationByFile(file);
      d;
      const allConfig = merge({}, config, envConfig);
      return allConfig;
      dd;
    },

    specs: ["./e2e"],

    // NOTE: If not setting GCLOUD_PROJECT env variable, project can be set like so:
    // return cypressFirebasePlugin(on, config, admin, { projectId: 'some-project' });
  },
});

async function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve(
    "cypress/config",
    `cypress.${file}.json`
  );
  return await fs.readJson(pathToConfigFile);
}
