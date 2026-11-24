# AD5 Rewards ZA — Supabase-connected Android source

This is the GitHub-ready Capacitor source for the AD5 Rewards ZA dual-mode app. It adds Supabase email sign-up/sign-in and authenticated read-only wallet reads. Demo balances remain local and separate.

## Before building

1. In Supabase Project Settings → API, confirm the Project URL is exactly `https://phdtmathewgcybrfwbtg.supabase.co`.
2. The public publishable key is configured in `www/config.js`. Publishable keys are intended for client apps. Never add a `sb_secret_` key, service-role key, database password, webhook secret, or payment credential to the app or GitHub.
3. The AD5 SQL schema was already applied to the user's project and verified. **Do not re-run the migration** on that project.

## Build

The included GitHub Actions workflow runs `npm install`, bundles the Supabase client with `npm run build`, syncs Capacitor, builds a debug APK, and uploads it as an artifact. To trigger manually: GitHub repository → Actions → Build AD5 Rewards ZA Android APK → Run workflow.

## Authentication and wallet

- Email sign-up, sign-in, and sign-out use Supabase Auth.
- New auth users receive a profile and zero-balance ZAR wallet through the database trigger in `supabase/migrations/202611220001_ad5_core.sql`.
- Wallet and ledger reads are scoped to the signed-in user by database Row Level Security.
- The client cannot write financial balances or ledger records.
- Email confirmation is enabled in the project. Until Android deep-link handling is configured, users may confirm the email in their browser and then return to the app to sign in.

## Still disabled

Real sponsor earnings, reward redemption, and withdrawals are not activated. The sponsor webhook is a protocol scaffold and must not issue rewards until a contracted sponsor's signed server callback has been integrated and verified. The withdrawal Edge Function deliberately returns HTTP 423 until KYC, payout provider, admin approval, fraud controls, and reconciliation are implemented.

This package is a software prototype, not a promise of earnings or an active financial service.
