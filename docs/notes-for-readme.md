# Notes for README (Roshan rewrites in own words)

## Decisions
- REST Countries v3.1 is shut down; using v5 (see CLAUDE.MD 4.2).
- v5 facts verified against restcountries.com/docs/countries (21 Nov 2026):
  - Single country: `GET /countries/v5/codes.alpha_3/<CODE>`; list: `GET /countries/v5`.
  - Responses are `{ data: { objects: [...], meta: { total, more, limit, offset } } }`.
  - Free plan max page size is 100 and there are ~250 countries, so the list endpoint is paged (3 requests), then cached 24h.
  - An unknown code returns **200 with an empty `objects` array**, not a 404. The app treats that as "not found".
  - Region filter exists (`?region=Europe`), but the app filters client-side on the cached list to save quota.
- Only the first call of the list pays; Favourites reads the same cache (no extra requests).
- Tokens: `me` and `refresh` read the token from the Keychain inside their `queryFn`, and `login` uses `track: false`. Reason: RTK Query stores mutation results and query args in Redux, which would have put `accessToken` in the store.
- Deep links: container is mounted only after the launch-time session check, so a cold-start link is judged with the real auth state. Logged-out links are diverted into `pendingLinkSlice` (see `gateLink` in `linking.ts`); `RootNavigator` opens the stored code after login.
- `navigate(..., { initial: false })` and `initialRouteName: Home` in the linking config keep Home under Details so Back works after a deep link.
- Missing/placeholder API key is detected in `config.ts`; the API then fails fast with a readable message and sends no request (4xx would count against the quota).
- Favourites survive logout on purpose (device wishlist, not account data). Change if you disagree.

## AI corrections
(none yet. Add one line here each time you reject or change generated code.)

## Bugs the tests caught while building (useful for the video)
- `login` mutation result (with tokens) was being kept in the Redux store. Found by the "no token in Redux state" test; fixed with `track: false`.
- `refresh` returned `{ data: undefined }`, which RTK Query rejects. Now returns `null`.

## Not verified on a device yet
- No emulator/adb/Maestro on the machine used for this work. Lint, typecheck and Jest (incl. a navigation-level deep link test) pass; the app has NOT been run on Android/iOS, and the real REST Countries key has NOT been used (`.env` still has the placeholder).
