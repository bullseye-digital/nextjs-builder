"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
var queries_1 = require("../build/queries");
var createGetQueryForType_1 = __importDefault(require("../build/createGetQueryForType"));
var createClient_1 = __importDefault(require("../graphql/createClient"));
var getStaticProps = function (project) { return function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var getQueryForType, api, _a, getPropsManifest, typeAncestry, availableTemplates, page, url, templates, typeResolutionResult, data, result, type, ancestors, stage, queryStr, _b, propsKey, propsFunc, _c, componentProps;
    var _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                getQueryForType = (0, createGetQueryForType_1.default)(project);
                api = (0, createClient_1.default)(project.projectConfig);
                _a = project.cacheManifest, getPropsManifest = _a.getPropsManifest, typeAncestry = _a.typeAncestry, availableTemplates = _a.availableTemplates;
                page = (_e = (_d = context === null || context === void 0 ? void 0 : context.params) === null || _d === void 0 ? void 0 : _d.page) !== null && _e !== void 0 ? _e : [];
                if (Array.isArray(page)) {
                    url = page.join("/");
                }
                else {
                    url = page;
                }
                url = (0, nextjs_toolkit_1.linkify)(url);
                if (url.match(/\.[^\/]+$/)) {
                    console.log("Not found:", url);
                    return [2 /*return*/, {
                            notFound: true,
                        }];
                }
                if (!availableTemplates) {
                    throw new Error("No available templates found");
                }
                templates = Object.keys(availableTemplates);
                return [4 /*yield*/, api.query(queries_1.TYPE_RESOLUTION_QUERY, { links: [url] })];
            case 1:
                typeResolutionResult = _j.sent();
                if (!typeResolutionResult ||
                    typeResolutionResult.typesForLinks.length === 0) {
                    return [2 /*return*/, {
                            notFound: true,
                        }];
                }
                data = {
                    query: null,
                    extraProps: null,
                };
                result = typeResolutionResult.typesForLinks[0];
                type = result.type;
                ancestors = (_f = typeAncestry[type]) !== null && _f !== void 0 ? _f : [];
                stage = context.draftMode ? "DRAFT" : "LIVE";
                queryStr = getQueryForType(type);
                if (!queryStr) return [3 /*break*/, 3];
                _b = data;
                return [4 /*yield*/, api.query(queryStr, { link: url, stage: stage })];
            case 2:
                _b.query = (_g = (_j.sent())) !== null && _g !== void 0 ? _g : null;
                _j.label = 3;
            case 3:
                propsKey = (0, nextjs_toolkit_1.resolveAncestry)(type, ancestors, Object.keys(getPropsManifest));
                propsFunc = propsKey ? (_h = getPropsManifest[propsKey]) !== null && _h !== void 0 ? _h : null : null;
                if (!propsFunc) return [3 /*break*/, 5];
                _c = data;
                return [4 /*yield*/, propsFunc(data.query)];
            case 4:
                _c.extraProps = _j.sent();
                _j.label = 5;
            case 5:
                componentProps = {
                    props: {
                        data: data,
                        type: type,
                        templates: templates,
                    },
                };
                return [2 /*return*/, componentProps];
        }
    });
}); }; };
exports.default = getStaticProps;
//# sourceMappingURL=getStaticProps.js.map