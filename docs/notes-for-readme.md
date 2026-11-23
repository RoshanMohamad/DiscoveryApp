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

## UI redesign (from Roshan's mock-ups) — factual notes
- Design used flat colours (no gradient library) so `react-native-linear-gradient` was not added (CLAUDE.md §2 / §8). Palette changed to indigo/violet tokens in `theme/colors.ts`; light and dark both updated.
- Added screens: Onboarding (welcome + 3 slides, shown once; `onboarding.completed` is persisted via redux-persist/MMKV), Home search + "Filter by Region" bottom sheet, Details tabs (Overview / Facts / Media), Profile rows (Dark Mode, Saved Data, About Passport).
- Shown as non-working placeholders on purpose (decision by Roshan): Google sign-in, Forgot password, notification bell, Details map, Media tab. They show a "not available in this demo" message instead of doing nothing.
- Left out of the design: terms checkbox on Register (would change the Zod schema), and the custom WhatsApp/Telegram share sheet (spec requires native `Share.share`).
- Register keeps First/Last name (DummyJSON needs them; names are required by the brief) although the mock-up omits them.
- Login button is now "Sign In" and the title "Welcome Back"; Maestro flows were updated (they also skip onboarding after `clearState`).
- The "About" text on Details is built from API fields in `describe.ts` (the API has no description).

## Round 2 of the redesign: libraries and photos (Roshan allowed third-party libraries on request)
- Added (approved by Roshan, beyond CLAUDE.md section 2): `react-native-linear-gradient` (button + photo fades), `react-native-svg` (Google "G" logo, filled heart), `@react-native-clipboard/clipboard` (Copy link in the share sheet). All three are native, so the app needs a rebuild (`gradlew app:installDebug`), not just a Metro reload.
- Photos are free Unsplash images (Unsplash licence: free to use) bundled in `src/assets/images/`, registered once in `index.ts`. IDs: photo-1506905925346-21bda4d32df4 (welcome), photo-1519681393784-d120267933ba (headers), photo-1570077188670-e3a8d69ac5ff, photo-1501785888041-af3ef285b470, photo-1464822759023-fed622ff2c3b (slides / Details hero).
- Details hero uses one scenic photo for every country (the API has no per-country photos); the country's own flag is shown on it.
- Share: the in-app sheet shows the deep link with Copy and WhatsApp / Messages / Telegram targets (deep links into those apps) and "More" = the native `Share.share` sheet. If an app is not installed it falls back to `Share.share`, so the spec requirement still holds.
- Tab bar active tab is a rounded pill (`tabBarActiveBackgroundColor`).
