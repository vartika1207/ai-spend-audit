import { describe, expect, it } from 'vitest';
import { runAudit } from '@/lib/auditEngine';
import type { AuditInput } from '@/lib/types';

const base: AuditInput = { teamSize: 2, useCase: 'coding', items: [] };

describe('audit engine', () => {
  it('downgrades small Cursor Business teams to Pro', () => {
    const result = runAudit({ ...base, items: [{ id: '1', tool: 'cursor', plan: 'Business', monthlySpend: 80, seats: 2 }] });
    expect(result.recommendations[0].recommendedPlan).toBe('Pro');
    expect(result.totalMonthlySavings).toBe(40);
  });

  it('does not manufacture savings when spend is already optimal', () => {
    const result = runAudit({ ...base, items: [{ id: '1', tool: 'copilot', plan: 'Individual', monthlySpend: 10, seats: 1 }] });
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.status).toBe('optimal');
  });

  it('flags high savings for large retail spend', () => {
    const result = runAudit({ ...base, teamSize: 50, items: [{ id: '1', tool: 'openai_api', plan: 'API direct', monthlySpend: 4000, seats: 50 }] });
    expect(result.totalMonthlySavings).toBeGreaterThan(500);
    expect(result.status).toBe('high_savings');
  });

  it('recommends API direct for data workflows', () => {
    const result = runAudit({ teamSize: 3, useCase: 'data', items: [{ id: '1', tool: 'chatgpt', plan: 'Team', monthlySpend: 150, seats: 3 }] });
    expect(result.recommendations[0].recommendedPlan).toContain('API direct');
  });

  it('calculates annual savings as 12x monthly savings', () => {
    const result = runAudit({ ...base, items: [{ id: '1', tool: 'v0', plan: 'Business', monthlySpend: 200, seats: 2 }] });
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });
});
