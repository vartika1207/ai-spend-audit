import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runAudit } from '@/lib/auditEngine';
import { saveAudit } from '@/lib/storage';

const schema = z.object({
  teamSize: z.number().min(1).max(100000),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
  items: z.array(z.object({
    id: z.string(),
    tool: z.enum(['cursor','copilot','claude','chatgpt','anthropic_api','openai_api','gemini','v0']),
    plan: z.string().min(1),
    monthlySpend: z.number().min(0),
    seats: z.number().min(1),
  })).min(1),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const result = runAudit(parsed.data);
  await saveAudit(result);
  return NextResponse.json(result);
}
