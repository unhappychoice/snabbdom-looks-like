import { VNode } from 'snabbdom/vnode';
declare type VNodeAssertion = (actual: VNode, expected: VNode, longError: boolean) => void;
export interface AssertNodeChildrenResult {
    state: 'success' | 'error';
    errors: EEEE[];
}
interface EEEE {
    actual: VNode | string;
    expected: VNode | string;
    error: Error;
}
export declare const assertNodeChildren: VNodeAssertion;
export {};
