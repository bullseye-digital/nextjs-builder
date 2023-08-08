"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const write_1 = require("../cache/write");
const createClient_1 = __importDefault(require("../graphql/createClient"));
exports.default = async (ssConfig) => {
    const api = (0, createClient_1.default)(ssConfig);
    const BUILD_QUERY = `
    query StaticBuild {
        staticBuild {
            typeAncestry {
                type
                ancestry
            }
        }

    }
    `;
    return api.query(BUILD_QUERY)
        .then(({ staticBuild: { typeAncestry } }) => {
        const ancestryMap = {};
        typeAncestry.forEach((result) => {
            ancestryMap[result.type] = result.ancestry;
        });
        (0, write_1.writeJSONFile)(`.typeAncestry.json`, ancestryMap);
    });
};
//# sourceMappingURL=cacheTypeAncestry.js.map