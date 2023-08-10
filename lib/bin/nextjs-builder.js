#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bootProjectConfig_1 = __importDefault(require("../utils/bootProjectConfig"));
(async () => {
    var _a;
    const commands = {
        "build-manifest": () => Promise.resolve().then(() => __importStar(require("./buildManifest"))).then(i => i.buildManifest(ssConfig)),
        "scaffold-pages": () => Promise.resolve().then(() => __importStar(require("./scaffoldPages"))).then(i => i.scaffoldPages(ssConfig)),
        "scaffold-blocks": () => Promise.resolve().then(() => __importStar(require("./scaffoldBlocks"))).then(i => i.scaffoldBlocks(ssConfig)),
        "setup": () => Promise.resolve().then(() => __importStar(require("./setup"))).then(i => {
            i.setup(ssConfig);
        }),
    };
    const commandName = process.argv[2];
    const command = (_a = commands[commandName]) !== null && _a !== void 0 ? _a : null;
    if (commandName === `setup`) {
        // Shim the setup with a fake baseURL so it doesn't fail when setting up the baseURL.
        process.env.SILVERSTRIPE_BASE_URL = `http://example.com`;
    }
    const ssConfig = (0, bootProjectConfig_1.default)();
    if (!command) {
        console.log(`
    Usage
      $ nextjs-toolkit <command>

    Available commands
      ${Object.keys(commands).join(", ")}

  `);
        process.exit(0);
    }
    // Make sure commands gracefully respect termination signals (e.g. from Docker)
    process.on("SIGTERM", () => process.exit(0));
    process.on("SIGINT", () => process.exit(0));
    await command();
})();
//# sourceMappingURL=nextjs-builder.js.map