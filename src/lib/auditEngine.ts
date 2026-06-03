import { PRICING, TOOL_LABELS, type Plan } from '@/data/pricing';
import type {
  AuditInput,
  AuditRecommendation,
  AuditResult,
  SpendItem,
} from './types';
import { nanoid } from 'nanoid';

function findPlan(item: SpendItem): Plan | undefined {
  return PRICING[item.tool].find(
    (plan) => plan.name.toLowerCase() === item.plan.toLowerCase()
  );
}

function isApiWorkflow(item: SpendItem): boolean {
  return (
    item.plan.toLowerCase().includes('api') ||
    item.tool.toLowerCase().includes('api')
  );
}

function cheapestFittingPlan(item: SpendItem, input: AuditInput): Plan {
  const plans = PRICING[item.tool];
  const current = findPlan(item) ?? plans[0];

  if (isApiWorkflow(item)) {
    return current;
  }

  if (
    item.tool === 'cursor' &&
    item.seats <= 2 &&
    input.useCase === 'coding'
  ) {
    return plans.find((p) => p.name === 'Pro') ?? current;
  }

  if (item.tool === 'copilot' && item.seats <= 2) {
    return plans.find((p) => p.name === 'Individual') ?? current;
  }

  if (
    item.tool === 'chatgpt' &&
    item.seats <= 2 &&
    ['writing', 'research', 'mixed'].includes(input.useCase)
  ) {
    return plans.find((p) => p.name === 'Plus') ?? current;
  }

  if (item.tool === 'claude' && item.seats <= 2 && item.plan !== 'Free') {
    return plans.find((p) => p.name === 'Pro') ?? current;
  }

  if (item.tool === 'gemini' && item.plan === 'Ultra' && input.teamSize < 10) {
    return plans.find((p) => p.name === 'Pro') ?? current;
  }

  if (item.tool === 'v0' && item.seats <= 2) {
    return plans.find((p) => p.name === 'Free') ?? current;
  }

  const fitting = plans.filter(
    (p) => p.bestFor.includes(input.useCase) || p.bestFor.includes('mixed')
  );

  return fitting.sort((a, b) => a.monthlyPerSeat - b.monthlyPerSeat)[0] ?? current;
}

function alternativeFor(
  item: SpendItem,
  input: AuditInput
): { label: string; estimatedSpend: number; reason: string } | null {
  const alreadyApi = isApiWorkflow(item);

  if (alreadyApi) {
    return null;
  }

  if (
    input.useCase === 'coding' &&
    ['cursor', 'v0'].includes(item.tool) &&
    item.monthlySpend > item.seats * 25
  ) {
    return {
      label: 'GitHub Copilot Business',
      estimatedSpend: item.seats * 19,
      reason:
        'For coding-heavy teams, Copilot Business can cover core coding assistance at a lower per-seat cost.',
    };
  }

  if (
    ['data', 'research'].includes(input.useCase) &&
    ['chatgpt', 'claude', 'gemini'].includes(item.tool) &&
    !item.plan.toLowerCase().includes('api') &&
    item.monthlySpend > item.seats * 35
  ) {
    return {
      label: `${input.useCase === 'data' ? 'OpenAI' : 'Anthropic'} API direct`,
      estimatedSpend: item.seats * 15,
      reason:
        'For structured research/data workflows, metered API usage may be cheaper than buying full seats for every user.',
    };
  }

  return null;
}

export function runAudit(input: AuditInput, summary = ''): AuditResult {
  const recommendations: AuditRecommendation[] = input.items.map((item) => {
    const currentPlan = findPlan(item);
    const currentSpend = Number.isFinite(item.monthlySpend)
      ? Math.max(0, item.monthlySpend)
      : 0;

    const fit = cheapestFittingPlan(item, input);
    const samePlan =
      fit.name.toLowerCase() === item.plan.toLowerCase();

    const sameVendorSpend = samePlan
      ? currentSpend
      : Math.min(currentSpend, fit.monthlyPerSeat * Math.max(1, item.seats));

    const alt = alternativeFor(item, input);

    let recommendedPlan = fit.name;
    let recommendedSpend = sameVendorSpend;

    let action = samePlan ? 'Keep plan' : `Downgrade/switch to ${fit.name}`;

    let reason = samePlan
      ? 'Your current plan broadly matches your use case and team size.'
      : `${fit.name} fits your stated use case and seat count better than ${item.plan}.`;

    if (isApiWorkflow(item) && samePlan) {
      action = 'Keep API workflow';
      reason =
        'You are already using a usage-based API workflow, so switching to another API vendor should only be considered if product quality or model fit is clearly better.';
    }

    if (alt && alt.estimatedSpend < recommendedSpend) {
      const possibleSavings = currentSpend - alt.estimatedSpend;

      if (possibleSavings >= 20) {
        recommendedPlan = alt.label;
        recommendedSpend = alt.estimatedSpend;
        action = `Evaluate ${alt.label}`;
        reason = alt.reason;
      }
    }

    let savingsMonthly = Math.max(
      0,
      Math.round(currentSpend - recommendedSpend)
    );

    if (savingsMonthly > 0 && savingsMonthly < 20) {
      recommendedPlan = currentPlan?.name ?? item.plan;
      recommendedSpend = currentSpend;
      savingsMonthly = 0;
      action = 'Keep current setup';
      reason =
        'The estimated savings are too small to justify migration effort or workflow disruption.';
    }

    const retailCreditSavings =
      currentSpend > 500 ? Math.round(currentSpend * 0.18) : 0;

    if (retailCreditSavings > savingsMonthly) {
      recommendedPlan = 'Credex-discounted credits / negotiated supply';
      recommendedSpend = Math.round(currentSpend - retailCreditSavings);
      savingsMonthly = Math.max(0, Math.round(currentSpend - recommendedSpend));
      action = 'Explore discounted AI credits';
      reason =
        'At this spend level, negotiated AI infrastructure credits can capture savings without forcing immediate workflow changes.';
    }

    return {
      itemId: item.id,
      tool: item.tool,
      toolLabel: TOOL_LABELS[item.tool],
      currentPlan: currentPlan?.name ?? item.plan,
      currentSpend,
      recommendedPlan,
      recommendedSpend,
      savingsMonthly,
      action,
      reason,
      confidence: currentPlan ? 'high' : 'medium',
    };
  });

  const totalMonthlySpend = recommendations.reduce(
    (sum, r) => sum + r.currentSpend,
    0
  );

  const totalRecommendedSpend = recommendations.reduce(
    (sum, r) => sum + r.recommendedSpend,
    0
  );

  const totalMonthlySavings = Math.max(
    0,
    Math.round(totalMonthlySpend - totalRecommendedSpend)
  );

  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    input,
    recommendations,
    totalMonthlySpend,
    totalRecommendedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    status:
      totalMonthlySavings > 500
        ? 'high_savings'
        : totalMonthlySavings < 100
          ? totalMonthlySavings === 0
            ? 'optimal'
            : 'low_savings'
          : 'low_savings',
    summary: summary || buildFallbackSummary(totalMonthlySavings, input.items.length),
  };
}

export function buildFallbackSummary(
  monthlySavings: number,
  itemCount: number
) {
  if (monthlySavings > 500) {
    return `Your AI stack shows meaningful savings potential across ${itemCount} tools. The biggest opportunity is to reduce premium seats, move structured workflows to usage-based APIs, and explore discounted credits for larger recurring spend.`;
  }

  if (monthlySavings > 0) {
    return `Your AI spend is mostly controlled, but there are still small optimizations available. A few plan adjustments could reduce waste while preserving the tools your team already uses.`;
  }

  return `Your current AI spend looks healthy for the provided team size and use case. There is no major overspend signal, but it is worth rechecking as vendor pricing and usage patterns change.`;
}