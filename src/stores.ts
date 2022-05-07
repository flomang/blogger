import { browser } from '$app/env';
import { writable } from 'svelte/store';


class UserInfo{
    avatar_url: string;
    email: string;
    id: string;
    username: string;
}

// read user from localstorage to persist between page refreshes.
export const user = writable(browser && (JSON.parse(localStorage.getItem("user")) || "empty"));
user.subscribe((info: UserInfo) => browser && localStorage.setItem("user", JSON.stringify(info)));
