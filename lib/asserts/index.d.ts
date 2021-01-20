import { VNode } from 'snabbdom/vnode';
export { assertNodeChildren } from './assertNodeChildren';
declare type NodeType = 'string' | 'object' | 'valid';
declare type VNodeAssertion = (actual: VNode, expected: VNode, longError: boolean) => void;
export declare const assertNodeType: (actual: VNode | string, expected: VNode | string | Symbol, longError: boolean) => NodeType;
export declare const assertNodeSelector: VNodeAssertion;
export declare const assertNodeText: VNodeAssertion;
export declare const assertNodeData: VNodeAssertion;
