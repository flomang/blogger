import { writable } from 'svelte/store';

// user login session: username, email, etc
// the server login shall return this object
export const session = writable({email:null, username: null, avatar_url: null, id:null});