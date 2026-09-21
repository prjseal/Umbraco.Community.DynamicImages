# Working in this repository

## Toolchain

The remote container has no .NET SDK. **Always install it via bash at the start of a session**
before any build or test, with the official script (the project targets `net10.0`):

```bash
curl -sSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh
bash /tmp/dotnet-install.sh --channel 10.0 --install-dir "$HOME/.dotnet"
export PATH="$HOME/.dotnet:$PATH" DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_NOLOGO=1
```

Shell state does not persist between commands, so prefix each `dotnet` command with that
`export`, or call `$HOME/.dotnet/dotnet` directly. Then:

- `dotnet build src/DynamicImages.sln`
- `dotnet test test/DynamicImages.Tests`
- Client: `cd src/DynamicImages/Client && npm ci && npm run typecheck && npm test &&
  npm run test:browser && npm run build` (the built bundle under
  `wwwroot/App_Plugins/DynamicImages/` is committed; the release workflow has no npm step, and
  `ci.yml` fails if the committed bundle does not match its source).

`npm test` is the fast node project. `npm run test:browser` is the vitest **browser-mode** project:
real Chromium through Playwright, for anything that needs layout — jsdom does none, so a
`getBoundingClientRect()` assertion means nothing there. Specs are named `*.browser.test.ts`.

## End-to-end tests

`npm run test:e2e` (`src/DynamicImages/Client/e2e/`, driven by `Client/playwright.config.ts`)
runs against a booted `src/DynamicImages.TestSite.Clean`. Not part of `npm test` or of `ci.yml`:
the site's first boot imports ~192 uSync items, so it is minutes rather than seconds. CI runs it
from `.github/workflows/e2e.yml` behind `workflow_dispatch`.

Leaving `E2E_BASE_URL` unset makes the config boot the site itself. Against a site you already
have running:

```bash
cd src/DynamicImages/Client
E2E_BASE_URL=https://localhost:44344 npm run test:e2e
```

Three things to know before trying to boot that site by hand, each of which costs an hour to
rediscover — `plans/ui-review-method.md` §6 has the full list:

- **It has to be HTTPS.** The backoffice's OpenIddict endpoint rejects plain HTTP before rendering
  a login form, and the symptom is a blank page with no inputs, which looks like a mounting
  problem. `dotnet dev-certs https`, and `ignoreHTTPSErrors` handles trust.
- **`appsettings.Local.json` is `#if DEBUG` only**, so a Release build needs
  `Umbraco__CMS__Unattended__*` environment variables.
- **Probe `/umbraco`, never `/`** — the Clean.Core front end 500s by design.

### Driving the backoffice from a session

This works in the remote container and is worth doing for any change with a UI surface — the E2E
suite is the only layer that sees the designer, the server render and the database round trip at
once. The whole sequence, from a container with no SDK:

```bash
curl -sSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh
bash /tmp/dotnet-install.sh --channel 10.0 --install-dir "$HOME/.dotnet"
export PATH="$HOME/.dotnet:$PATH" DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_NOLOGO=1
dotnet dev-certs https

# Boot it in the background; the first boot is minutes (uSync imports ~192 items).
ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=https://localhost:44344 \
Umbraco__CMS__Unattended__InstallUnattended=true \
Umbraco__CMS__Unattended__UnattendedUserName="Test Editor" \
Umbraco__CMS__Unattended__UnattendedUserEmail=test@example.com \
Umbraco__CMS__Unattended__UnattendedUserPassword='CHANGE-ME-local-only-1234' \
dotnet run --project src/DynamicImages.TestSite.Clean -c Release --no-launch-profile > /tmp/site.log 2>&1 &

# Ready when this answers 200. Never probe `/`.
curl -sk -o /dev/null -w "%{http_code}\n" https://localhost:44344/umbraco

cd src/DynamicImages/Client
E2E_BASE_URL=https://localhost:44344 npx playwright test canvas-fill --reporter=list
```

**The login is the unattended admin above** — `test@example.com` / `CHANGE-ME-local-only-1234`,
the throwaway values in `appsettings.Local.json.example`, which `Client/playwright.config.ts` and
`e2e/helpers.ts` already default to. There is no `appsettings.Local.json` in a fresh clone; it is
gitignored, and the environment variables above are what a Release build reads instead.

**Playwright's pinned Chromium is usually not the one the container ships.** The failure is
`Executable doesn't exist at /opt/pw-browsers/chromium_headless_shell-<pinned>/…`, and it stops
`npm run test:browser` as well as the E2E suite. Do not run `playwright install` — point the
pinned build at the installed one (`ls /opt/pw-browsers` for the real number):

```bash
INSTALLED=1194; PINNED=1243   # whatever the two actually are
mkdir -p /opt/pw-browsers/chromium_headless_shell-$PINNED/chrome-headless-shell-linux64
ln -sfn /opt/pw-browsers/chromium-$INSTALLED/chrome-linux /opt/pw-browsers/chromium-$PINNED/chrome-linux
ln -sfn /opt/pw-browsers/chromium_headless_shell-$INSTALLED/chrome-linux/headless_shell \
  /opt/pw-browsers/chromium_headless_shell-$PINNED/chrome-headless-shell-linux64/chrome-headless-shell
```

Four selector traps, all of which look like a broken feature and are not:

- **Scope workspace view tabs to the editor.** Umbraco's own *section* tabs are Content, Media,
  **Settings**, Users…, so `uui-tab:has-text('Settings')` navigates out of the template entirely.
  Use `umb-workspace-editor uui-tab`. The preview tab is labelled **"Preview & test"**.
- **Playwright's CSS pierces open shadow roots**, which cuts both ways: `.field > span` inside a
  panel also matches the spans inside every `di-number-field` in it. Scope by the custom element,
  or walk the light DOM in `evaluate`.
- **`uui-select` needs its inner native control**: `locator("… uui-select select").selectOption(…)`,
  and scope it (`umb-property-layout[label="Format"] select`) rather than taking `.first()`.
- **`di-layer-box` is never `toBeVisible`** — it is a positioned wrapper whose paint is in its
  shadow root. Wait for `state: "attached"` and assert on the computed style inside.

And one fact about the fixture itself: **the uSync-imported "Article OG image" template has a
`cover` base image**, so any validation rule that is suppressed when the base image covers the
canvas (`TransparencyNotKept`) will correctly *not* fire on it until the fit is changed.

## Plans

Feature work is planned before it is implemented, and the two happen in separate sessions.

- **A planning session's deliverable is a plan file in `plans/`.** Name it
  `<feature>-plan.md` in kebab-case (for example `plans/web-fonts-plan.md`) and commit it to the
  session's branch. Follow the structure of the plans already there: Context (including the
  decisions made with the user and any library facts verified), Design, Files (new, modified,
  reused as-is), Implementation order, Verification. A planning session does not implement.
- **Once the plan is written, approved and placed in `plans/`**, end the session by telling the
  user which model should implement it, with a one-line reason, and giving a ready-to-paste
  prompt for that implementation session in a fenced code block. The prompt names the plan file
  and how to verify the work.
- **An implementation session starts by reading its plan from `plans/`** and follows it. Where
  the code forces a different choice, say so in the commit message and update the plan so it
  still describes what was built.
