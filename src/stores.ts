import { browser } from '$app/env';
import { writable } from 'svelte/store';

// read user from localstorage to persist between page refreshes.
export const user = writable(browser && (JSON.parse(localStorage.getItem("user")) || "empty"));
user.subscribe(value => browser && localStorage.setItem("user", JSON.stringify(value)));
