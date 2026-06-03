import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveLead } from '@/lib/storage';
import { sendAuditEmail } from '@/lib/email';

const schema = z.object({
  auditId: z.string(),
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.number().optional(),
  monthlySavings: z.number().optional(),
  website: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true }); // honeypot
  await saveLead({ ...parsed.data, created_at: new Date().toISOString(), high_savings: (parsed.data.monthlySavings ?? 0) > 500 });
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  await sendAuditEmail(parsed.data.email, `${base}/audit/${parsed.data.auditId}`, parsed.data.monthlySavings ?? 0);
  return NextResponse.json({ ok: true });
}
