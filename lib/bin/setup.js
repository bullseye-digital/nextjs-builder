#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
// @ts-ignore
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const child_process_1 = require("child_process");
// @ts-ignore
const crypto_browserify_1 = __importDefault(require("crypto-browserify"));
const setup = (ssConfig) => {
    console.log(`
  This tool helps you get your NextJS project connected to a Silverstripe CMS 
  data source. You'll need to provide the URL to your Silverstripe installation
  and add your API key.

  Make sure the silverstripe-nextjs module (https://github.com/silverstripe/silverstripe-nextjs)
  has been installed on your Silverstripe backend before starting.
  
  Ready? Let's do it! 🎉
`);
    const projectDir = ssConfig.baseDir;
    const previewKey = crypto_browserify_1.default.randomBytes(256).toString(`base64`).substring(0, 64);
    const questions = [
        {
            name: "module",
            message: "Do you have the silverstripe-nextjs module installed already?",
            type: "list",
            choices: [
                {
                    name: "Yup! Good to go.",
                    value: true,
                },
                {
                    name: "Nope. What do I do?",
                    value: false,
                },
            ],
        },
        {
            name: `baseUrl`,
            message: `What is the ${chalk_1.default.green("base URL")} of your Silverstripe CMS website?
        (e.g. https://mywebsite.com) Local URLs are OK!
        
URL:    `,
            when: (answers) => {
                if (!answers.module) {
                    console.log(chalk_1.default.yellow(`
                Please go to:

                https://github.com/silverstripe/silverstripe-nextjs

                For instructions on installing this module and rerun this installation script when finished.`));
                    process.exit(1);
                }
                return true;
            },
            validate: (input) => {
                let url;
                try {
                    url = new URL(input);
                }
                catch (_) {
                    return false;
                }
                return url.protocol !== "http:" && url.protocol !== "https:"
                    ? `That doesn't appear to be a valid URL`
                    : true;
            },
        },
        {
            name: `apiKey`,
            message: (answers) => `What is the ${chalk_1.default.green("API key")} of your admin user?
        Your API key can be found at:
        ${chalk_1.default.green(`${answers.baseUrl}/admin/security`)} ${chalk_1.default.red("->")} <your user> ${chalk_1.default.red("->")} ${chalk_1.default.green("Api keys")}
        
API Key: `,
            validate: (input) => input.length === 48 ||
                `That does not appear to be a valid API key. It should be a 48 character string.`,
        },
        {
            name: "preview",
            message: () => `You now need to add the following environment variables to your Silverstripe CMS installation:

NEXTJS_BASE_URL='http://localhost:3000'
NEXTJS_PREVIEW_KEY='${previewKey}'

    `,
            type: "list",
            choices: [
                {
                    name: "Done!",
                    value: true,
                },
            ],
        },
    ];
    inquirer_1.default
        .prompt(questions)
        .then(({ baseUrl, apiKey }) => {
        console.log("Writing env file...");
        const configFilePath = path_1.default.join(projectDir, ".env");
        (0, fs_1.writeFileSync)(configFilePath, `SILVERSTRIPE_BASE_URL = '${baseUrl}'
SILVERSTRIPE_API_KEY = '${apiKey}'
SILVERSTRIPE_PREVIEW_KEY = '${previewKey}'
`);
        console.log(`Environment file ${chalk_1.default.yellow(configFilePath)} written`);
        (0, fs_1.rmdirSync)(`${process.cwd()}/.git`, { recursive: true });
        (0, child_process_1.exec)(`git init && git add . && git commit -m "Initial commit"`, (error) => {
            if (error) {
                console.warn(chalk_1.default.red(`Failed to create empty git repository`));
            }
            else {
                console.log(chalk_1.default.green(`Created empty git repository`));
            }
        });
        console.log(chalk_1.default.green(`

All set! You can now run:
        
        `), chalk_1.default.yellow(`yarn start
          `), chalk_1.default.green(`
to see your NextJS website in action.
      `));
        console.log(`Here are some additional commands you may want to run to help get you started:

        `, `${chalk_1.default.blueBright(`yarn scaffold-pages`)}: Create placeholder templates and queries for your page types
        
        `, `${chalk_1.default.blueBright(`yarn scaffold-blocks`)}: Create placeholder templates and fragments for your elemental blocks
        
        `, `${chalk_1.default.blueBright(`yarn generate`)}: Generate a types file for your graphql schema (run automatically on every build)
        
        `);
    })
        .catch((error) => console.error(error));
};
exports.setup = setup;
//# sourceMappingURL=setup.js.map