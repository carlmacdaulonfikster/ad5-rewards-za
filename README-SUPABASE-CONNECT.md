# AD5 Rewards ZA — Supabase-connected Capacitor source

This package updates the supplied dual-mode Capacitor MVP with Supabase email authentication and authenticated, read-only wallet queries protected by the existing PostgreSQL RLS policies.

## Supabase project configuration

`www/config.js` contains the project's public URL and publishable key. The URL was filled as `https://phdtmathewgcybrfwbtg.supabase.co` based on the project reference shown in the supplied dashboard screenshot. Confirm this exact URL in Supabase Project Settings before building. Publishable keys are public; never put a `sb_secret_` key, service-role key, database password, webhook secret, or payment credential in this file or the APK.

## What changed

- Adds email sign-up, sign-in, and sign-out using Supabase Auth.
- Uses the existing `profiles` and `wallets` auth-user trigger to create each new user's profile and zero-balance ZAR wallet.
- Reads only the signed-in user's wallet and ledger rows through RLS.
- Keeps demo credits local and separate from the real wallet.
- Does not enable sponsor earnings or withdrawals.

## Build

Requires Node.js 20+ recommended. From this folder run:

```bash
npm install
npm run build
```

This bundles `@supabase/supabase-js` into `www/app.bundle.js`. Then sync/build Android using your existing Capacitor/GitHub Actions workflow. If an Android project already exists, run `npx cap sync android` after the build.

## Supabase dashboard checks

1. Confirm Email provider is enabled and email confirmation is enabled.
2. Confirm the five public tables exist and the AD5 RLS policies are present.
3. In Authentication → URL Configuration, set the Site URL to the actual production app website if you have one. For native Android confirmation deep links, configure an Android app URL scheme/deep-link handler before relying on email confirmation links inside the app. Until then, users can confirm email using their browser and then return to the app to sign in.
4. Register a test user. The database trigger should create a row in `profiles` and `wallets`.
5. Sign in from the app, select Real money, and verify the account shows R0.00. This is a read-only account balance, not a live earning or payout feature.

## Backend functions

The `supabase/` folder contains the starter migration and Edge Functions. The database migration matches the SQL setup already provided. Do not re-run it against the existing project. Deploy Edge Functions separately after configuring server-side secrets. The sponsor webhook is a protocol scaffold only and must not be used to issue rewards until a real sponsor contract and signed callback verification are in place. The withdrawal function intentionally remains locked (HTTP 423).

## Safety

- The client cannot write wallet balances, ledger entries, sponsor events, or withdrawals.
- Wallet reads require a Supabase authenticated session and RLS.
- The APK contains only the public publishable key.
- Demo values are never uploaded or copied into real-money balances.
- No real rewards, payments, or withdrawals are activated by this package.
