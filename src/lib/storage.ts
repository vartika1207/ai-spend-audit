import { createClient } from '@supabase/supabase-js';
import type { AuditResult } from './types';

const memory = new Map<string, AuditResult>();

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function saveAudit(result: AuditResult) {
  memory.set(result.id, result);
  const supabase = supabaseAdmin();
  if (!supabase) return result;
  await supabase.from('audits').insert({ id: result.id, payload: result });
  return result;
}

export async function getAudit(id: string) {
  if (memory.has(id)) return memory.get(id)!;
  const supabase = supabaseAdmin();
  if (!supabase) return null;
  const { data } = await supabase.from('audits').select('payload').eq('id', id).single();
  return (data?.payload as AuditResult) ?? null;
}

export async function saveLead(payload: Record<string, unknown>) {
  const supabase = supabaseAdmin();
  if (!supabase) return { ok: true, mode: 'memory' };
  const { error } = await supabase.from('leads').insert(payload);
  if (error) throw error;
  return { ok: true, mode: 'supabase' };
}
