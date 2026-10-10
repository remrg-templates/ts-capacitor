# Getting Started

## Prerequisites

- Node.js 22.12 or later.
- npm 10.8.2 or later.
- Git.

For Android, install Android Studio, the Android SDK required by Capacitor 8, and JDK 21. For iOS, use macOS with Xcode 26 or later and its command-line tools. iOS projects use Swift Package Manager by default. Configure an emulator/simulator or connect a device for native testing.

## Install Dependencies

From the repository root, install the dependencies recorded in the lockfile:

```bash
npm ci
```

Install the browsers used by the end-to-end tests:

```bash
npx playwright install
```

On a supported Linux environment that needs browser system dependencies, use `npx playwright install --with-deps` instead. Installing system dependencies may require administrator privileges.

## Run the Web Application

```bash
npm run dev
```

Open the URL printed by Vite, normally <http://localhost:8080>. If that port is already in use, the development server selects another available port.

## Build and Preview

```bash
npm run build
npm run preview
```

The production web build is written to `dist/`. Open the preview URL printed by Vite. Preview is for checking the build locally, not a production hosting server.

## Validate Changes

Check TypeScript types and formatting/lint rules without modifying files:

```bash
npm run typecheck
npm run lint:check
```

Run unit tests with coverage:

```bash
npx vitest run --coverage
```

Run browser end-to-end tests:

```bash
npm run test:e2e
```

Playwright starts the Vite development server on port 8080. Keep that port free, or ensure any existing server there is this application's development server: outside CI, Playwright reuses an existing server.

For all configured checks and tests:

```bash
npm run test:ci
```

The end-to-end suite uses Chromium, Firefox, and WebKit. For a quick Chromium-only smoke test, run `npm run test:e2e -- --project=chromium`.

Interactive test commands are also available:

```bash
npm run test:dev
npm run test:dev:e2e
```

Use `npm run lint` to apply formatting and automatic lint fixes. Unlike `npm run test:ci`, `npm test` runs this modifying lint command before checking types and running tests.

## Set Up Native Platforms

Generate the platforms you need (you can repeat these steps for `ios` as well):

```bash
npm install @capacitor/android
npx cap add android
npx cap open android
```

See [Capacitor Android Docs](https://capacitorjs.com/docs/android) for more information.

Commit the generated `android/` and `ios/` source projects to your consumer repository. They are intentionally not stored in the template, so remrg updates do not merge SDK-generated native files. Local build output, SDK paths, and signing credentials are ignored.

After changing web code or adding a Capacitor plugin, rebuild and sync:

```bash
npx cap sync android
```

This syncs the Android project with the latest web assets and plugins.

## Run on a Device or Emulator

```bash
npx cap run android
```

The command prompts you to select a device or emulator. To select a known device explicitly, pass `--target`, for example `npx cap run android --target DEVICE_ID`.

Open the native project in its IDE when you need native configuration or debugging:

```bash
npx cap open android
```

On each target platform, verify that the app launches, displays its native name/version and platform, and still opens after the development server is stopped. The app loads bundled assets; it does not require a running Vite server. Verify permission prompts and plugin behavior on real devices when adding capabilities.

## Native Builds and Releases

```bash
npx cap build android
```

This syncs assets and invokes Capacitor's Android release build. A configured native toolchain and signing credentials are required; they are not configured by the template. Inspect available options with `npx cap build android --help`.

Configure your release keystore securely and choose APK or AAB output for your distribution channel. Use your CI secret store for credentials; do not commit keystores or passwords.

Set native version/build numbers in the generated platform projects before a release. Changing the npm package version alone does not update Android/iOS release versions. A successful Vite build or browser test is not evidence that a native build succeeds: build and smoke-test each target platform with its own toolchain.

The included [CI workflow](../../.github/workflows/ci.yml) runs web checks, builds an Android debug app, and builds for the iOS simulator without release signing. It generates missing native projects or syncs projects already committed by a consumer. Device testing and signed distribution remain separate release steps.
