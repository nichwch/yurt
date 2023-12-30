import { writable } from 'svelte/store';

export const modalStore = writable<boolean>(false);

export const showingTagFilters = writable<boolean>(false);
// for now, only allow filtering by one tag. change this if its a big hinderance.
export const focusedTag = writable<string | null>(null);
