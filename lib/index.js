"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.looksLike = exports.assertLooksLike = exports.Wildcard = void 0;
var asserts_1 = require("./asserts");
var errors_1 = require("./errors");
var wildcard_1 = require("./wildcard");
Object.defineProperty(exports, "Wildcard", { enumerable: true, get: function () { return wildcard_1.Wildcard; } });
function assertLooksLike(actual, expected, longError) {
    if (longError === void 0) { longError = false; }
    var valueType = asserts_1.assertNodeType(actual, expected, longError);
    switch (valueType) {
        case 'valid': return;
        case 'string': {
            if (actual !== expected)
                throw errors_1.TexNodeMismatchedError(actual, expected, longError);
            break;
        }
        case 'object': {
            asserts_1.assertNodeSelector(actual, expected, longError);
            asserts_1.assertNodeText(actual, expected, longError);
            asserts_1.assertNodeData(actual, expected, longError);
            asserts_1.assertNodeChildren(actual, expected, longError);
            break;
        }
    }
}
exports.assertLooksLike = assertLooksLike;
function looksLike(actual, expected) {
    try {
        assertLooksLike(actual, expected);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.looksLike = looksLike;
//# sourceMappingURL=index.js.map