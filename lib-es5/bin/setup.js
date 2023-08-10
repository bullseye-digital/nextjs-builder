#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
// @ts-ignore
var inquirer_1 = __importDefault(require("inquirer"));
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var fs_1 = require("fs");
var child_process_1 = require("child_process");
// @ts-ignore
var crypto_browserify_1 = __importDefault(require("crypto-browserify"));
var setup = function (ssConfig) {
    console.log("\n  This tool helps you get your NextJS project connected to a Silverstripe CMS \n  data source. You'll need to provide the URL to your Silverstripe installation\n  and add your API key.\n\n  Make sure the silverstripe-nextjs module (https://github.com/silverstripe/silverstripe-nextjs)\n  has been installed on your Silverstripe backend before starting.\n  \n  Ready? Let's do it! \uD83C\uDF89\n");
    var projectDir = ssConfig.baseDir;
    var previewKey = crypto_browserify_1.default.randomBytes(256).toString("base64").substring(0, 64);
    var questions = [
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
            name: "baseUrl",
            message: "What is the ".concat(chalk_1.default.green("base URL"), " of your Silverstripe CMS website?\n        (e.g. https://mywebsite.com) Local URLs are OK!\n        \nURL:    "),
            when: function (answers) {
                if (!answers.module) {
                    console.log(chalk_1.default.yellow("\n                Please go to:\n\n                https://github.com/silverstripe/silverstripe-nextjs\n\n                For instructions on installing this module and rerun this installation script when finished."));
                    process.exit(1);
                }
                return true;
            },
            validate: function (input) {
                var url;
                try {
                    url = new URL(input);
                }
                catch (_) {
                    return false;
                }
                return url.protocol !== "http:" && url.protocol !== "https:"
                    ? "That doesn't appear to be a valid URL"
                    : true;
            },
        },
        {
            name: "apiKey",
            message: function (answers) { return "What is the ".concat(chalk_1.default.green("API key"), " of your admin user?\n        Your API key can be found at:\n        ").concat(chalk_1.default.green("".concat(answers.baseUrl, "/admin/security")), " ").concat(chalk_1.default.red("->"), " <your user> ").concat(chalk_1.default.red("->"), " ").concat(chalk_1.default.green("Api keys"), "\n        \nAPI Key: "); },
            validate: function (input) {
                return input.length === 48 ||
                    "That does not appear to be a valid API key. It should be a 48 character string.";
            },
        },
        {
            name: "preview",
            message: function () { return "You now need to add the following environment variables to your Silverstripe CMS installation:\n\nNEXTJS_BASE_URL='http://localhost:3000'\nNEXTJS_PREVIEW_KEY='".concat(previewKey, "'\n\n    "); },
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
        .then(function (_a) {
        var baseUrl = _a.baseUrl, apiKey = _a.apiKey;
        console.log("Writing env file...");
        var configFilePath = path_1.default.join(projectDir, ".env");
        (0, fs_1.writeFileSync)(configFilePath, "SILVERSTRIPE_BASE_URL = '".concat(baseUrl, "'\nSILVERSTRIPE_API_KEY = '").concat(apiKey, "'\nSILVERSTRIPE_PREVIEW_KEY = '").concat(previewKey, "'\n"));
        console.log("Environment file ".concat(chalk_1.default.yellow(configFilePath), " written"));
        (0, fs_1.rmdirSync)("".concat(process.cwd(), "/.git"), { recursive: true });
        (0, child_process_1.exec)("git init && git add . && git commit -m \"Initial commit\"", function (error) {
            if (error) {
                console.warn(chalk_1.default.red("Failed to create empty git repository"));
            }
            else {
                console.log(chalk_1.default.green("Created empty git repository"));
            }
        });
        console.log(chalk_1.default.green("\n\nAll set! You can now run:\n        \n        "), chalk_1.default.yellow("yarn start\n          "), chalk_1.default.green("\nto see your NextJS website in action.\n      "));
        console.log("Here are some additional commands you may want to run to help get you started:\n\n        ", "".concat(chalk_1.default.blueBright("yarn scaffold-pages"), ": Create placeholder templates and queries for your page types\n        \n        "), "".concat(chalk_1.default.blueBright("yarn scaffold-blocks"), ": Create placeholder templates and fragments for your elemental blocks\n        \n        "), "".concat(chalk_1.default.blueBright("yarn generate"), ": Generate a types file for your graphql schema (run automatically on every build)\n        \n        "));
    })
        .catch(function (error) { return console.error(error); });
};
exports.setup = setup;
//# sourceMappingURL=setup.js.map