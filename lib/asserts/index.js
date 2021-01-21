"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNodeData = exports.assertNodeText = exports.assertNodeSelector = exports.assertNodeType = exports.assertNodeChildren = void 0;
var wildcard_1 = require("../wildcard");
var errors_1 = require("../errors");
var assertNodeChildren_1 = require("./assertNodeChildren");
Object.defineProperty(exports, "assertNodeChildren", { enumerable: true, get: function () { return assertNodeChildren_1.assertNodeChildren; } });
var assertNodeType = function (actual, expected, longError) {
    if (typeof actual === 'undefined') {
        throw new Error('Actual node is undefined');
    }
    else if (typeof actual === 'string' && typeof expected === 'string') {
        return 'string';
    }
    else if (typeof actual === 'string' || typeof expected === 'string') {
        throw errors_1.NodeTypeMismatchedError(actual, expected, longError);
    }
    else if (wildcard_1.isWildcard(actual)) {
        throw errors_1.WildCardInActualError;
    }
    else if (wildcard_1.isObj(actual) && wildcard_1.isWildcard(expected)) {
        return 'valid';
    }
    else if (wildcard_1.isObj(actual) && wildcard_1.isObj(expected)) {
        return 'object';
    }
    throw new Error('Unrecognized actual and expected type pattern');
};
exports.assertNodeType = assertNodeType;
// TODO: WildCardClass
// TODO: exactly or is subset or ...
var assertNodeSelector = function (actual, expected, longError) {
    var _a, _b;
    var actualSels = ((_a = actual.sel) === null || _a === void 0 ? void 0 : _a.split(/\.|#/)) || [];
    var expectedSels = ((_b = expected.sel) === null || _b === void 0 ? void 0 : _b.split(/\.|#/)) || [];
    var isSubset = expectedSels.reduce(function (acc, curr) { return acc && actualSels.indexOf(curr) !== -1; }, true);
    if (!isSubset)
        throw errors_1.SelectorMismatchedError(actual, expected, longError);
};
exports.assertNodeSelector = assertNodeSelector;
// TODO: WildCardText
var assertNodeText = function (actual, expected, longError) {
    if (actual.text !== expected.text)
        throw errors_1.TextMismatchedError(actual, expected, longError);
};
exports.assertNodeText = assertNodeText;
// TODO: WildCardData
// TODO: exactly or is subset or ...
var assertNodeData = function (actual, expected, longError) {
    if (!matches(actual.data, expected.data))
        throw errors_1.AttributesMismatchedError(actual, expected, longError);
};
exports.assertNodeData = assertNodeData;
var matches = function (actual, expected) {
    if (expected === undefined) {
        return true;
    }
    else if (typeof expected !== typeof actual) {
        return false;
    }
    else if (typeof actual === 'object' && typeof expected === 'object') {
        for (var k in expected) {
            if (!matches(actual[k], expected[k])) {
                return false;
            }
        }
        return true;
    }
    else if (Array.isArray(expected) && Array.isArray(actual)) {
        if (expected.length !== actual.length)
            return false; // TODO: Subset does not match
        for (var i = 0; i < expected.length; i++) {
            if (!matches(actual[i], expected[i])) {
                return false;
            }
        }
        return true;
    }
    return actual === expected;
};
//# sourceMappingURL=index.js.map