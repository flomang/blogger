import { writable } from 'svelte/store';

export const session = writable({email:null, id:null});