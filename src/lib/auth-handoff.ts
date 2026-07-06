/**
 * Cookie names used to carry the post-login destination and chosen language
 * across an OAuth / email-link round-trip.
 *
 * Why cookies instead of `redirectTo` query params: Supabase glob-matches the
 * full callback URL against its Redirect URLs allow list. The allow-list entries
 * are bare paths (`https://…/auth/callback`), so any `?next=…&locale=…` query
 * string fails the match and Supabase silently falls back to the Site URL —
 * landing the user on the wrong domain in the wrong language. Keeping the
 * callback bare (exact match) means the provider returns to the same domain the
 * login started on, so these same-domain cookies are available again on return.
 */
export const AUTH_NEXT_COOKIE = "beaumont-auth-next";
export const AUTH_LOCALE_COOKIE = "beaumont-auth-locale";
