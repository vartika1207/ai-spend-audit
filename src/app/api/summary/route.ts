import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildFallbackSummary } from '@/lib/auditEngine';

export async function POST(req: Request) {
  const body = await req.json();
  const monthlySavings = Number(body.monthlySavings ?? 0);
  const itemCount = Number(body.itemCount ?? 0);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ summary: buildFallbackSummary(monthlySavings, itemCount), fallback: true });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Write concise finance-literate AI spend audit summaries. Be honest. Do not invent savings.' },
        { role: 'user', content: `Create a ~100 word personalized summary for this audit. Monthly savings: $${monthlySavings}. Tool count: ${itemCount}. Use case: ${body.useCase}. Mention next action.` },
      ],
      temperature: 0.3,
      max_tokens: 170,
    });
    return NextResponse.json({ summary: response.choices[0]?.message?.content ?? buildFallbackSummary(monthlySavings, itemCount), fallback: false });
  } catch {
    return NextResponse.json({ summary: buildFallbackSummary(monthlySavings, itemCount), fallback: true });
  }
}
