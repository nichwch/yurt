import {writable } from 'svelte/store'
export const focusedText = writable<string|null>(null);
export type Index = {
    content:string,
    parent:string,
    score:number
}
export const related = writable<Index[]|null>(null);