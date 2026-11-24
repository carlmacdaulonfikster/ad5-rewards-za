# Upload this source to your existing AD5 GitHub repository

1. Extract this ZIP on your computer or Android device. Upload the *contents* of the extracted folder to the root of your existing repository, not the ZIP file itself.
2. Preserve hidden paths such as `.github/workflows/build-apk.yml` and `.gitignore`.
3. Do not upload `node_modules`, build outputs, private keys, database passwords, or service-role keys.
4. Commit the changes to the `main` branch.
5. In GitHub open Actions → Build AD5 Rewards ZA Android APK → Run workflow (or wait for the push build).
6. Open the completed workflow run → Artifacts → download `AD5-Rewards-ZA-Supabase-APK`.
7. Extract the artifact ZIP and install `app-debug.apk` on the Android phone. Android may ask you to allow installation from the browser or Files app.

The workflow intentionally does not enable npm dependency caching because this source ZIP does not include a package-lock.json. It installs dependencies, bundles the app, creates/syncs the Capacitor Android project, builds a debug APK, and uploads it as an artifact.

Do not re-run the Supabase database migration; it has already been applied and verified. This build only uses the public Supabase URL and publishable key from `www/config.js`.

This build provides email sign-up/sign-in and authenticated read-only wallet/ledger access. It does not activate sponsor rewards, cash withdrawals, or payment processing.
