"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNodeChildren = void 0;
var index_1 = require("../index");
var wildcard_1 = require("../wildcard");
var errors_1 = require("../errors");
var assertNodeChildren = function (actual, expected, longError) {
    if (!Array.isArray(actual.children) || !Array.isArray(expected.children))
        return; // TODO: Is this right?
    assertWildCardUsage(actual, expected, longError);
    assertChildrenLength(actual, expected, longError);
    var results = preparePossibleExpectedChildren(actual.children, expected.children).map(function (expectedChildren) {
        var _a;
        try {
            if (expectedChildren.length !== ((_a = actual.children) === null || _a === void 0 ? void 0 : _a.length)) {
                throw errors_1.ChildrenMismatchedError(actual, expected, longError);
            }
            expectedChildren.forEach(function (expectedChild, i) {
                return index_1.assertLooksLike((actual.children || [])[i], expectedChild, longError);
            });
            return 'success';
        }
        catch (error) {
            return error;
        }
    });
    if (results.indexOf('success') === -1)
        throw results[results.length - 1];
};
exports.assertNodeChildren = assertNodeChildren;
var assertChildrenLength = function (actual, expected, longError) {
    if (!Array.isArray(actual.children) || !Array.isArray(expected.children))
        return;
    if (expected.children.filter(function (s) { return !wildcard_1.isWildcard(s); }).length > actual.children.length) {
        throw errors_1.NotEnoughChildrenError(actual, expected, longError);
    }
};
var assertWildCardUsage = function (actual, expected, _longError) {
    if (!Array.isArray(actual.children) || !Array.isArray(expected.children))
        return;
    var hasConsecutiveWildcards = expected.children
        .reduce(function (a, c) { return a == 1 ? wildcard_1.isWildcard(c) ? 2 : 0 : a === 2 ? 2 : wildcard_1.isWildcard(c) ? 1 : 0; }, 0)
        === 2;
    if (hasConsecutiveWildcards)
        throw errors_1.InvalidWildcardUsageError;
};
var preparePossibleExpectedChildren = function (actual, expected) {
    var wildcardLength = expected.filter(wildcard_1.isWildcard).length;
    if (wildcardLength === 0) {
        return [expected];
    }
    var missingNodeLength = actual.length - (expected.length - wildcardLength);
    if (missingNodeLength === 0) {
        return [expected.filter(function (e) { return !wildcard_1.isWildcard(e); })];
    }
    var splitNodes = splitOn(expected, wildcard_1.isWildcard);
    return getPossibleDistributions(Array(wildcardLength).fill(0), missingNodeLength).map(function (distribution) {
        return distribution.reduce(function (acc, length, j) { return acc.concat(Array(length).fill(index_1.Wildcard())).concat(splitNodes[j + 1]); }, splitNodes[0]);
    });
};
var splitOn = function (arr, fn) {
    var i = arr.map(fn).indexOf(true);
    if (i === -1) {
        return [arr];
    }
    return [arr.slice(0, i)].concat(splitOn(arr.slice(i + 1), fn));
};
var getPossibleDistributions = function (array, k) {
    if (k === 0) {
        return [array];
    }
    var result = [];
    for (var i = 0; i < array.length; i++) {
        var a = array.slice(0);
        a[i]++;
        result = result.concat(getPossibleDistributions(a, k - 1));
    }
    return result;
};
//# sourceMappingURL=assertNodeChildren.js.map