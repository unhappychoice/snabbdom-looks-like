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

export interface AssertNodeChildrenResult {
    state: 'success' | 'error';
    errors: EEEE[]
}

interface EEEE {
    actual: VNode | string;
    expected: VNode | string;
    error: Error;
}

export const assertNodeChildren: VNodeAssertion = (
    actual,
    expected,
    longError
) => {
    if (!Array.isArray(actual.children) || !Array.isArray(expected.children))
        return; // TODO: Is this right?

    assertWildCardUsage(actual, expected, longError);
    assertChildrenLength(actual, expected, longError);

    const results: AssertNodeChildrenResult[] = preparePossibleExpectedChildren(
        actual.children,
        expected.children
    ).map((expectedChildren): AssertNodeChildrenResult => {
        const actualChildren = actual.children || [];
        const results: ('success'|EEEE)[] = expectedChildren.map((expectedChild, i) => {
            try {
                assertLooksLike(actualChildren[i], expectedChild, longError);
                return 'success'
            } catch (error) {
                if (error.message.includes('Children mismatched')) throw error;
                return { actual: actualChildren[i], expected: expectedChild, error };
            }
        });

        if (expectedChildren.length === results.filter(result => result === 'success').length) {
            return { state: 'success', errors: [] };
        } else {
            return { state: 'error', errors: results.filter(result => result !== 'success') as EEEE[] };
        }
    });

    if (results.map(result => result.state).indexOf('success') === -1) {
        const result = results.sort((r1, r2) => r1.errors.length - r2.errors.length)[0];
        throw ChildrenMismatchedError(result, longError);
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
