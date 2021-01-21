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
        var actualChildren = actual.children || [];
        var results = expectedChildren.map(function (expectedChild, i) {
            try {
                index_1.assertLooksLike(actualChildren[i], expectedChild, longError);
                return 'success';
            }
            catch (error) {
                if (error.message.includes('Children mismatched'))
                    throw error;
                return { actual: actualChildren[i], expected: expectedChild, error: error };
            }
        });
        if (expectedChildren.length === results.filter(function (result) { return result === 'success'; }).length) {
            return { state: 'success', errors: [] };
        }
        else {
            return { state: 'error', errors: results.filter(function (result) { return result !== 'success'; }) };
        }
    });
    if (results.map(function (result) { return result.state; }).indexOf('success') === -1) {
        var result = results.sort(function (r1, r2) { return r1.errors.length - r2.errors.length; })[0];
        throw errors_1.ChildrenMismatchedError(result, longError);
    }
};
exports.assertNodeChildren = assertNodeChildren;
var assertChildrenLength = function (actual, expected, longError) {
    if (!Array.isArray(actual.children) || !Array.isArray(expected.children))
        return;
    if (expected.children.filter(function (s) { return !wildcard_1.isWildcard(s); }).length >
        actual.children.length) {
        throw errors_1.NotEnoughChildrenError(actual, expected, longError);
    }
};
var assertWildCardUsage = function (actual, expected, _longError) {
    if (!Array.isArray(actual.children) || !Array.isArray(expected.children))
        return;
    var hasConsecutiveWildcards = expected.children.reduce(function (a, c) {
        return a == 1
            ? wildcard_1.isWildcard(c)
                ? 2
                : 0
            : a === 2
                ? 2
                : wildcard_1.isWildcard(c)
                    ? 1
                    : 0;
    }, 0) === 2;
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
        return distribution.reduce(function (acc, length, j) {
            return acc
                .concat(Array(length).fill(index_1.Wildcard()))
                .concat(splitNodes[j + 1]);
        }, splitNodes[0]);
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