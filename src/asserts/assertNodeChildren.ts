import { VNode } from 'snabbdom/vnode';
import { assertLooksLike, Wildcard } from '../index';
import { isWildcard } from '../wildcard';
import {
    ChildrenMismatchedError,
    InvalidWildcardUsageError,
    NotEnoughChildrenError,
} from '../errors';

type VNodeAssertion = (
    actual: VNode,
    expected: VNode,
    longError: boolean
) => void;
type NodeChildren = (string | VNode)[];
type Distribution = number[];

export const assertNodeChildren: VNodeAssertion = (
    actual,
    expected,
    longError
) => {
    if (!Array.isArray(actual.children) || !Array.isArray(expected.children))
        return; // TODO: Is this right?

    assertWildCardUsage(actual, expected, longError);
    assertChildrenLength(actual, expected, longError);

    const results = preparePossibleExpectedChildren(
        actual.children,
        expected.children
    ).map((expectedChildren) => {
        try {
            expectedChildren.forEach((expectedChild, i) =>
                assertLooksLike(
                    (actual.children || [])[i],
                    expectedChild,
                    longError
                )
            );

            return 'success';
        } catch (error) {
            if (error.message.includes('Children mismatched')) throw error;
            return error;
        }
    });

    if (results.indexOf('success') === -1) {
        throw ChildrenMismatchedError(actual, expected, longError);
    }
};

const assertChildrenLength: VNodeAssertion = (actual, expected, longError) => {
    if (!Array.isArray(actual.children) || !Array.isArray(expected.children))
        return;

    if (
        expected.children.filter((s) => !isWildcard(s)).length >
        actual.children.length
    ) {
        throw NotEnoughChildrenError(actual, expected, longError);
    }
};

const assertWildCardUsage: VNodeAssertion = (actual, expected, _longError) => {
    if (!Array.isArray(actual.children) || !Array.isArray(expected.children))
        return;

    const hasConsecutiveWildcards =
        expected.children.reduce(
            (a: any, c: any) =>
                a == 1
                    ? isWildcard(c)
                        ? 2
                        : 0
                    : a === 2
                    ? 2
                    : isWildcard(c)
                    ? 1
                    : 0,
            0
        ) === 2;

    if (hasConsecutiveWildcards) throw InvalidWildcardUsageError;
};

const preparePossibleExpectedChildren = (
    actual: NodeChildren,
    expected: NodeChildren
): NodeChildren[] => {
    const wildcardLength = expected.filter(isWildcard).length;

    if (wildcardLength === 0) {
        return [expected];
    }

    const missingNodeLength =
        actual.length - (expected.length - wildcardLength);

    if (missingNodeLength === 0) {
        return [expected.filter((e) => !isWildcard(e))];
    }

    const splitNodes = splitOn(expected, isWildcard);

    return getPossibleDistributions(
        Array(wildcardLength).fill(0),
        missingNodeLength
    ).map((distribution) =>
        distribution.reduce(
            (acc, length, j) =>
                acc
                    .concat(Array(length).fill(Wildcard()))
                    .concat(splitNodes[j + 1]),
            splitNodes[0]
        )
    );
};

const splitOn = <T>(arr: T[], fn: (a: any) => boolean): T[][] => {
    const i = arr.map(fn).indexOf(true);
    if (i === -1) {
        return [arr];
    }
    return [arr.slice(0, i)].concat(splitOn(arr.slice(i + 1), fn));
};

const getPossibleDistributions = (
    array: number[],
    k: number
): Distribution[] => {
    if (k === 0) {
        return [array];
    }

    let result: number[][] = [];

    for (let i = 0; i < array.length; i++) {
        let a = array.slice(0);
        a[i]++;
        result = result.concat(getPossibleDistributions(a, k - 1));
    }
    return result;
};
