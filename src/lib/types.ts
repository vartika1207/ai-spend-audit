import type { ToolKey, UseCase } from '@/data/pricing';

export type SpendItem = {
  id: string;
  tool: ToolKey;
  plan: string;
  monthlySpend: number;
  seats: number;
};

export type AuditInput = {
  teamSize: number;
  useCase: UseCase;
  items: SpendItem[];
};

export type AuditRecommendation = {
  itemId: string;
  tool: ToolKey;
  toolLabel: string;
  currentPlan: string;
  currentSpend: number;
  recommendedPlan: string;
  recommendedSpend: number;
  savingsMonthly: number;
  action: string;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
};

export type AuditResult = {
  id: string;
  createdAt: string;
  input: AuditInput;
  recommendations: AuditRecommendation[];
  totalMonthlySpend: number;
  totalRecommendedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  status: 'high_savings' | 'low_savings' | 'optimal';
  summary: string;
};
