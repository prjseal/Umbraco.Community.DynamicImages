import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests against a booted Clean test site.
 *
 * Not part of `npm test` or CI's pull-request run: the site's first boot imports ~192 uSync
 * items, so this is minutes rather than seconds. It runs from .github/workflows/e2e.yml behind
 * workflow_dispatch, or locally against a site you already have running.
 *
 * Boot facts, all of them learned the hard way and worth keeping written down:
 *
 * - **Probe `/umbraco`, never `/`.** The Clean.Core 7.x front end 500s by design on this site, so
 *   a readiness check against the root would wait forever for a page that is never going to be
 *   healthy.
 * - **`appsettings.Local.json` is loaded only under `#if DEBUG`** (see the test site's
 *   Program.cs), so a Release build cannot be configured that way. The unattended install has to
 *   come through environment variables, which is what `webServer.env` below does.
 * - **It has to be HTTPS, and so needs `ignoreHTTPSErrors`.** Plain HTTP is not an option to
 *   trade away the certificate: the backoffice's OpenIddict authorize endpoint rejects it outright
 *   with `error_description: This server only accepts HTTPS requests`, before any login form is
 *   rendered - so the symptom is a blank page with no inputs on it, which looks like a mounting
 *   problem and is not one. CI runs `dotnet dev-certs https` and lets `ignoreHTTPSErrors` handle
 *   the trust side.
 * - **Views take 5-10 seconds to mount.** Every assertion here must be an auto-waiting one; a
 *   fixed timeout would be both slower and flakier.
 */

const baseURL = process.env.E2E_BASE_URL ?? "https://localhost:44344";

/** The unattended admin the test site installs itself with. */
const user = {
  login: process.env.UMBRACO_USER_LOGIN ?? "test@example.com",
  password: process.env.UMBRACO_USER_PASSWORD ?? "CHANGE-ME-local-only-1234",
};

export default defineConfig({
  testDir: "./e2e",
  // A first render goes to the server for a real image, so these are not millisecond tests.
  timeout: 120_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  // One worker: the tests share one site, and several of them write to it.
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",

  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  // Only when E2E_BASE_URL is unset: otherwise a site is already running and this would fight it.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command:
          "dotnet run --project ../../DynamicImages.TestSite.Clean/DynamicImages.TestSite.Clean.csproj " +
          "-c Release --no-launch-profile",
        url: `${baseURL}/umbraco`,
        ignoreHTTPSErrors: true,
        reuseExistingServer: !process.env.CI,
        // The first boot imports ~192 uSync items. Minutes, not seconds.
        timeout: 600_000,
        stdout: "pipe",
        stderr: "pipe",
        env: {
          ASPNETCORE_ENVIRONMENT: "Development",
          ASPNETCORE_URLS: baseURL,
          Umbraco__CMS__Unattended__InstallUnattended: "true",
          Umbraco__CMS__Unattended__UnattendedUserName: "Test Editor",
          Umbraco__CMS__Unattended__UnattendedUserEmail: user.login,
          Umbraco__CMS__Unattended__UnattendedUserPassword: user.password,
        },
      },
});

export { baseURL, user };
