import { VNode } from 'snabbdom/vnode';

export function Wildcard(): VNode {
    return {
        sel: '',
        elm: undefined,
        text: undefined,
        key: undefined,
        children: [],
        data: {
            isWildcard: true,
        },
    };
}

export const isWildcard = (vnode: any) =>
    isObj(vnode) && vnode.data && vnode.data.isWildcard;

export const isObj = (a: any): a is VNode => typeof a === 'object';
