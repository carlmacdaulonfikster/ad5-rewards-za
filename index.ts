import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, json, env } from '../_shared/http.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);
  const auth = req.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return json({ error: 'unauthorized' }, 401);
  const token = auth.slice(7);
  const url = env('SUPABASE_URL');
  const anon = env('SUPABASE_ANON_KEY');
  const service = env('SUPABASE_SERVICE_ROLE_KEY');
  const userClient = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
  const { data: userData, error: userError } = await userClient.auth.getUser(token);
  if (userError || !userData.user) return json({ error: 'unauthorized' }, 401);
  const admin = createClient(url, service, { auth: { persistSession: false } });
  const userId = userData.user.id;
  const [{ data: wallet, error: walletError }, { data: rows, error: rowsError }] = await Promise.all([
    admin.from('wallets').select('currency,available_cents,pending_cents,total_earned_cents,updated_at').eq('user_id', userId).maybeSingle(),
    admin.from('wallet_ledger').select('id,entry_type,amount_cents,description,created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(30),
  ]);
  if (walletError || rowsError) return json({ error: 'wallet_unavailable' }, 500);
  if (!wallet) return json({ error: 'wallet_not_found' }, 404);
  const money = (cents: number) => (cents / 100).toFixed(2);
  return json({ currency: 'ZAR', available_balance: money(wallet.available_cents), pending_balance: money(wallet.pending_cents), total_earned: money(wallet.total_earned_cents), updated_at: wallet.updated_at,
    transactions: (rows || []).map((r) => ({ id: r.id, description: r.description, entry_type: r.entry_type, amount_formatted: `${r.amount_cents >= 0 ? '+' : '-'}R${money(Math.abs(r.amount_cents))}`, created_at: r.created_at })) });
});
