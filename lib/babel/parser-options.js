"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARSER_OPTIONS = void 0;
exports.PARSER_OPTIONS = {
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    sourceType: `unambiguous`,
    plugins: [
        `jsx`,
        `doExpressions`,
        `objectRestSpread`,
        `typescript`,
        [
            `decorators`,
            {
                decoratorsBeforeExport: true,
            },
        ],
        `classProperties`,
        `classPrivateProperties`,
        `classPrivateMethods`,
        `exportDefaultFrom`,
        `exportNamespaceFrom`,
        `asyncGenerators`,
        `functionBind`,
        `functionSent`,
        `dynamicImport`,
        `numericSeparator`,
        `optionalChaining`,
        `importMeta`,
        `bigInt`,
        `optionalCatchBinding`,
        `throwExpressions`,
        [
            `pipelineOperator`,
            {
                proposal: `minimal`,
            },
        ],
        `nullishCoalescingOperator`,
    ],
};
//# sourceMappingURL=parser-options.js.map