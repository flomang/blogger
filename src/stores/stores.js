import { writable } from 'svelte/store';

// user login session: username, email, etc
// the server login shall return this object
// TODO typescript this
const initialData = {email: null, username: null, avatar_url: null, id: null};
export const session = writable(initialData);

