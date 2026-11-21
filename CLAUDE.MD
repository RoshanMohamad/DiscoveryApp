# CLAUDE.md — Passport 🌍

> **Passport** — Explore the world's countries, build a travel wishlist, and share any country with a deep link.
>
> IN3210 Mobile Applications Development · Assignment 2 · Roshan (index **234183A**)
> **Deadline: 13 December 2026, 11:59 PM (Asia/Colombo)**

This file tells Claude how to work in this repo. Read it fully before making changes.

---

## 1. What this project is

A React Native "discovery app" built to the IN3210 Assignment 2 brief.

| Index digit | Value | Meaning |
|---|---|---|
| Last digit | **3** | Domain → **Travel & Countries** |
| Second-last digit | **8** | Twist → **Share & deep link** |

**User flow:** Register / Login → Home (list of countries as cards) → Country Details (favourite toggle + share) → Favourites tab (travel wishlist, persisted) → share a country → opening `passport://country/<CODE>` launches the app directly on that country's Details screen.

---

## 2. Tech stack (fixed — do not swap without asking)

| Concern | Choice |
|---|---|
| Framework | React Native **CLI** (not Expo), **TypeScript** everywhere |
| Navigation | React Navigation — native stack + bottom tabs, typed params |
| State / async | **Redux Toolkit + RTK Query** |
| Forms / validation | react-hook-form + **Zod** (`@hookform/resolvers/zod`) |
| Token storage | **react-native-keychain** (NEVER AsyncStorage/MMKV for tokens) |
| Persistence (non-secret) | **react-native-mmkv** (favourites, theme preference) via redux-persist MMKV adapter |
| Icons | **Feather only** (react-native-vector-icons / `@react-native-vector-icons/feather`) |
| Config / secrets | react-native-config (`.env`, gitignored) |
| Testing | Jest (unit), React Native Testing Library (bonus component tests), Maestro (E2E) |
| Lint | ESLint (`@react-native` config) + Prettier — **must pass with zero errors** |
| Bonus | Dark mode toggle, persisted across restarts |

Use the latest stable versions; check each library's install docs for native setup (pods, Gradle) rather than guessing.

---

## 3. Commands

```bash
npm install
cd ios && pod install && cd ..      # macOS only
npm run android                      # or: npx react-native run-android
npm run ios
npm start                            # Metro
npm run lint                         # must be 0 errors before any commit
npm run typecheck                    # tsc --noEmit
npm test                             # Jest
maestro test .maestro/               # E2E flows
```

Test a deep link:

```bash
# Android
adb shell am start -W -a android.intent.action.VIEW -d "passport://country/LKA"
# iOS simulator
xcrun simctl openurl booted "passport://country/LKA"
```

**Before every commit:** `npm run lint && npm run typecheck && npm test` must all pass.

---

## 4. APIs

### 4.1 Authentication — DummyJSON (required by brief)

Base: `https://dummyjson.com`

| Action | Request | Notes |
|---|---|---|
| Login | `POST /auth/login` `{ username, password, expiresInMins }` | Returns `accessToken, refreshToken, id, username, email, firstName, lastName, gender, image` |
| Current user | `GET /auth/me` with `Authorization: Bearer <accessToken>` | Use on app start to restore session |
| Register (simulated) | `POST /users/add` `{ firstName, lastName, username, email, password }` | Returns a fake user; it **cannot** actually log in. On success → show success message → redirect to Login |

Demo credentials for testing/demo: `emilys` / `emilyspass`.

- Store `accessToken` (+ refresh token) **only** in Keychain via `features/auth/services/tokenStorage.ts`.
- User profile (name, image) may live in Redux state; it is not secret.
- Logout = clear Keychain + reset auth slice + reset RTK Query cache (`api.util.resetApiState()`).
- Show the user's first name in the Home header and on the Profile screen.

### 4.2 Countries data

⚠️ **REST Countries v3.1 (`restcountries.com/v3.1`) is DEAD** — it now returns a deprecation error. Do not copy v3.1 tutorial code.

**Primary: REST Countries v5**
- Base: `https://api.restcountries.com/countries/v5`
- Auth: `Authorization: Bearer <REST_COUNTRIES_API_KEY>` — key in `.env` via react-native-config, never committed.
- Free tier: ~1,000 requests/month; account can be disabled if >15% of requests return 4xx. So:
  - Always request only needed fields (`response_fields=...`).
  - Set a long `keepUnusedDataFor` in RTK Query; don't refetch on every focus.
  - Validate params before calling (bad codes → 4xx → counts against us).
- Response shape differs from v3.1 (e.g. `names.common`, `codes.alpha_3`, `flag.url_png`). Define types in `features/countries/types.ts` and map raw → app model in **one** place (`mappers.ts`).
- **TO VERIFY against https://restcountries.com/docs/countries before coding:** exact path for fetching a single country by alpha-3 code, and available region filter params.

**Fallback (if quota/key becomes a problem):** Countries GraphQL API `https://countries.trevorblades.com/` (no key) + flag images from `https://flagcdn.com/w320/<alpha2-lowercase>.png`. Only the API slice + mappers should need to change — keep UI independent of the data source.

Whichever is used, the README must explain why (v3.1 shutdown) — the brief allows a different API if justified.

### 4.3 Item ID

The country's **ISO alpha-3 code** (e.g. `LKA`) is the item ID everywhere: route params, favourites keys, deep links. Details receives **only the code**, never the country object, and fetches its own data.

---

## 5. Folder structure (feature-based)

```
src/
  app/
    store.ts                 # configureStore, persistor, RootState, AppDispatch
    hooks.ts                 # typed useAppDispatch / useAppSelector
    api.ts                   # RTK Query base api (createApi), shared baseQuery
    navigation/
      RootNavigator.tsx      # switches AuthStack vs AppTabs on auth state
      AuthStack.tsx
      AppTabs.tsx            # Home, Favourites, Profile tabs
      HomeStack.tsx          # Home → CountryDetails
      linking.ts             # deep-link config (prefixes, paths)
      types.ts               # ALL ParamLists + typed screen props
  features/
    auth/
      screens/               # LoginScreen, RegisterScreen
      components/
      authApi.ts             # login, register, me endpoints (injectEndpoints)
      authSlice.ts
      schemas.ts             # Zod: loginSchema, registerSchema
      services/tokenStorage.ts  # Keychain wrapper (save/get/clear)
    countries/
      screens/               # HomeScreen, CountryDetailsScreen
      components/            # CountryCard, RegionChips, InfoRow
      countriesApi.ts
      mappers.ts
      types.ts
    favourites/
      screens/FavouritesScreen.tsx
      components/FavouriteButton.tsx
      favouritesSlice.ts
      selectors.ts
    share/                   # TWIST
      shareCountry.ts        # builds message + calls Share.share
      deepLink.ts            # buildCountryLink(code), parseCountryLink(url)
      pendingLinkSlice.ts    # holds a link opened while logged out
    settings/
      themeSlice.ts          # dark mode (bonus)
      screens/ProfileScreen.tsx
  shared/
    components/              # Screen, AppText, Button, TextField, LoadingView, ErrorView, EmptyView
    hooks/
    utils/
  theme/
    colors.ts                # light + dark palettes
    spacing.ts
    typography.ts
    index.ts                 # useTheme() hook
__tests__/ (or colocated *.test.ts)
.maestro/
  login.yaml
  deeplink.yaml
```

**Layering rule:** screens → hooks/selectors → slices / RTK Query endpoints → services. Screens never call `fetch` directly. Components in `shared/` never import from `features/`.

---

## 6. Requirements checklist (maps to marking scheme)

Tick these off as they're done. Don't mark something done unless it actually works on device.

### Authentication & validation — 15
- [ ] Login + Register screens with react-hook-form + Zod; clear inline error messages
- [ ] Sensible rules: username ≥3 chars, valid email, password ≥6 chars, confirm password matches, names required
- [ ] Token in Keychain only; session restored on launch via `/auth/me`
- [ ] User's name shown in header/profile; Logout clears everything
- [ ] Loading state on submit button; API errors (wrong password) shown to user

### Navigation — 10
- [ ] Separate auth flow vs app flow (conditional on auth state)
- [ ] Bottom tabs: Home, Favourites, Profile
- [ ] Home → CountryDetails stack
- [ ] All params typed in `navigation/types.ts`; no `any` in navigation

### API integration & data display — 15
- [ ] Country cards: flag image, common name, region / capital / population
- [ ] Loading, error (with **Retry**), and empty states on Home and Details
- [ ] Details loads its own data from the code param

### State management & persistence — 15
- [ ] RTK Query for server data; slices for auth, favourites, theme, pendingLink
- [ ] Favourites toggle from both card and Details
- [ ] Favourites survive app restart (MMKV); auth is NOT in redux-persist

### Twist: Share & deep link — 10
- [ ] Share button in Details header (Feather `share-2`)
- [ ] `passport://country/<CODE>` registered on Android + iOS
- [ ] Cold start and warm start both open the correct Details screen
- [ ] Link opened while logged out → stored → user logs in → auto-navigate to that country
- [ ] Invalid/unknown code → friendly error state, not a crash

### UI/UX & responsiveness — 10
- [ ] All colours/spacing/typography from `theme/` — no hard-coded values in components
- [ ] Feather icons only
- [ ] Touch targets ≥ 44pt / 48dp (use `hitSlop` or min sizes)
- [ ] Works on small phones and tablets; respects safe areas

### Code quality & tests — 15
- [ ] TypeScript strict mode; no `any`
- [ ] ESLint 0 errors
- [ ] ≥3 meaningful Jest tests, planned:
  1. `schemas.test.ts` — Zod login/register rules (valid + invalid cases)
  2. `favouritesSlice.test.ts` — add / remove / toggle / no duplicates
  3. `deepLink.test.ts` — `buildCountryLink` / `parseCountryLink` (valid, lowercase, invalid URLs)
- [ ] Maestro: `login.yaml`, `deeplink.yaml` (uses `openLink`)

### Bonus (+5) — Dark mode
- [ ] Toggle on Profile screen, persisted in MMKV, applied via theme tokens

### Git, README, video — 10
- [ ] Feature-based commits spread over the assignment period
- [ ] README: setup steps, screenshots (Login, Home, Details, Favourites, Share/deep link), architecture overview, state-management choice, **Key decisions**
- [ ] AI_USAGE.md
- [ ] Demo video ≤3 min (1 min flow incl. app restart + deep link; 2 min narrated code walkthrough)
- [ ] Optional: release APK as GitHub release

---

## 7. Twist implementation spec (Share & deep link)

1. **URL format:** `passport://country/<ALPHA3>` (uppercase normalised in parser).
2. **Native registration:**
   - Android `AndroidManifest.xml`: `intent-filter` with `VIEW`, `DEFAULT`, `BROWSABLE`, `<data android:scheme="passport" />`; MainActivity `launchMode="singleTask"`.
   - iOS: `CFBundleURLTypes` with scheme `passport` in `Info.plist`; `RCTLinkingManager` `openURL` handler in AppDelegate.
3. **React Navigation `linking`** in `app/navigation/linking.ts`:
   `prefixes: ['passport://']`, path `country/:code` → `AppTabs > HomeTab > CountryDetails`.
4. **Auth gate:** if a link arrives while logged out, save it in `pendingLinkSlice`; after successful login, navigate to it and clear it.
5. **Share:** `Share.share({ message: \`Check out ${name} ${flagEmoji} on Passport: passport://country/${code}\` })`. Handle the user dismissing the share sheet without error.
6. Keep link building/parsing as **pure functions** in `deepLink.ts` so they're unit-testable.
7. Note for demo: custom-scheme links usually aren't tappable in WhatsApp/Gmail — demo via `adb`/`simctl` or Maestro.

---

## 8. Coding conventions

- Functional components + hooks only. Named exports (except screens may default-export if navigation needs it — be consistent).
- Files: `PascalCase.tsx` for components/screens, `camelCase.ts` for logic.
- No inline styles except trivial dynamic values; use `StyleSheet.create` with theme tokens via a `makeStyles(theme)` pattern.
- No magic strings: route names, storage keys, API paths go in constants.
- Every async UI must handle loading / error / empty.
- Accessibility: `accessibilityLabel` on icon-only buttons; `accessibilityRole` on pressables.
- Don't add libraries beyond Section 2 without asking Roshan first.

---

## 9. Git workflow

- Commit after each feature, small and focused. **Never** produce one giant commit.
- Conventional Commits: `feat(auth): add Zod login validation`, `fix(favourites): prevent duplicates`, `test(deeplink): ...`, `chore: ...`, `docs: ...`.
- Suggested commit sequence:
  1. `chore: init RN CLI TypeScript project, ESLint, Prettier`
  2. `feat(theme): add colour, spacing and typography tokens`
  3. `feat(navigation): auth stack, tabs, home stack with typed params`
  4. `feat(auth): login/register forms with Zod validation`
  5. `feat(auth): DummyJSON login and Keychain token storage`
  6. `feat(auth): restore session and logout`
  7. `feat(countries): RTK Query countries API and mappers`
  8. `feat(countries): home list with loading/error/empty states`
  9. `feat(countries): country details screen`
  10. `feat(favourites): slice, toggle button and MMKV persistence`
  11. `feat(favourites): favourites tab`
  12. `feat(share): share country from details`
  13. `feat(deeplink): passport:// scheme + linking config`
  14. `feat(deeplink): handle links opened while logged out`
  15. `test: validation, favourites reducer, deep link utils`
  16. `test(e2e): Maestro login and deep link flows`
  17. `feat(theme): persisted dark mode toggle`
  18. `docs: README, screenshots, AI_USAGE`
- Ask before committing; Roshan reviews each feature.

---

## 10. Academic integrity notes (important)

- Roshan must understand and be able to explain every line (narrated code walkthrough is graded).
- When generating non-trivial code, briefly explain **why** in the chat so it can be explained in the video.
- **Do NOT write the README "Key decisions" section or AI_USAGE.md in final form.** These must be in Roshan's own words. Claude may keep factual notes in `docs/notes-for-readme.md` (decisions made, alternatives considered, corrections Roshan made to AI output) for Roshan to rewrite.
- When Roshan corrects or rejects generated code, add a one-line entry to `docs/notes-for-readme.md` under "AI corrections" — AI_USAGE.md needs at least one such case.

---

## 11. Timeline

| Dates | Focus |
|---|---|
| Nov 22–28 | Project setup, theme, navigation, auth (lighter until 26 Nov — other deadline) |
| Nov 29 – Dec 5 | Countries API, Home, Details, Favourites + persistence |
| Dec 6–10 | Share + deep link, tests, dark mode bonus |
| Dec 11–13 | README, screenshots, AI_USAGE, demo video, APK |