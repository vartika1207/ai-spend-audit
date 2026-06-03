export type ToolKey =
  | 'cursor'
  | 'copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'v0';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export type Plan = {
  name: string;
  monthlyPerSeat: number;
  description: string;
  bestFor: UseCase[];
  source: string;
};

export const TOOL_LABELS: Record<ToolKey, string> = {
  cursor: 'Cursor',
  copilot: 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  anthropic_api: 'Anthropic API direct',
  openai_api: 'OpenAI API direct',
  gemini: 'Gemini',
  v0: 'v0',
};

export const PRICING: Record<ToolKey, Plan[]> = {
  cursor: [
    { name: 'Hobby', monthlyPerSeat: 0, description: 'Free individual coding assistance', bestFor: ['coding'], source: 'https://cursor.com/pricing' },
    { name: 'Pro', monthlyPerSeat: 20, description: 'Individual developer AI coding plan', bestFor: ['coding'], source: 'https://cursor.com/pricing' },
    { name: 'Business', monthlyPerSeat: 40, description: 'Team admin and billing features', bestFor: ['coding'], source: 'https://cursor.com/pricing' },
    { name: 'Enterprise', monthlyPerSeat: 80, description: 'Estimated enterprise seat price; verify quote', bestFor: ['coding'], source: 'https://cursor.com/enterprise' },
  ],
  copilot: [
    { name: 'Individual', monthlyPerSeat: 10, description: 'Individual coding assistant', bestFor: ['coding'], source: 'https://github.com/features/copilot/plans' },
    { name: 'Business', monthlyPerSeat: 19, description: 'Business coding assistant with org controls', bestFor: ['coding'], source: 'https://github.com/features/copilot/plans' },
    { name: 'Enterprise', monthlyPerSeat: 39, description: 'Enterprise coding assistant', bestFor: ['coding'], source: 'https://github.com/features/copilot/plans' },
  ],
  claude: [
    { name: 'Free', monthlyPerSeat: 0, description: 'Basic Claude usage', bestFor: ['writing', 'research'], source: 'https://claude.com/pricing' },
    { name: 'Pro', monthlyPerSeat: 20, description: 'Individual advanced Claude usage', bestFor: ['writing', 'research', 'mixed'], source: 'https://claude.com/pricing' },
    { name: 'Max', monthlyPerSeat: 100, description: 'Power user usage tier', bestFor: ['research', 'coding'], source: 'https://claude.com/pricing' },
    { name: 'Team', monthlyPerSeat: 30, description: 'Team collaboration plan', bestFor: ['writing', 'research', 'mixed'], source: 'https://claude.com/pricing' },
    { name: 'Enterprise', monthlyPerSeat: 80, description: 'Estimated enterprise quote placeholder', bestFor: ['mixed'], source: 'https://claude.com/pricing' },
    { name: 'API direct', monthlyPerSeat: 15, description: 'Estimated light API usage per active user', bestFor: ['data', 'research'], source: 'https://claude.com/pricing' },
  ],
  chatgpt: [
    { name: 'Plus', monthlyPerSeat: 20, description: 'Individual ChatGPT plan', bestFor: ['writing', 'research', 'mixed'], source: 'https://openai.com/chatgpt/pricing/' },
    { name: 'Team', monthlyPerSeat: 30, description: 'Team workspace plan', bestFor: ['mixed', 'data'], source: 'https://openai.com/chatgpt/pricing/' },
    { name: 'Enterprise', monthlyPerSeat: 60, description: 'Estimated enterprise seat price; verify quote', bestFor: ['mixed'], source: 'https://openai.com/chatgpt/enterprise/' },
    { name: 'API direct', monthlyPerSeat: 15, description: 'Estimated light API usage per active user', bestFor: ['data', 'research'], source: 'https://openai.com/api/pricing/' },
  ],
  anthropic_api: [
    { name: 'API direct', monthlyPerSeat: 15, description: 'Pay-as-you-go API estimate', bestFor: ['data', 'research', 'coding'], source: 'https://claude.com/pricing' },
  ],
  openai_api: [
    { name: 'API direct', monthlyPerSeat: 15, description: 'Pay-as-you-go API estimate', bestFor: ['data', 'research', 'coding'], source: 'https://openai.com/api/pricing/' },
  ],
  gemini: [
    { name: 'Pro', monthlyPerSeat: 20, description: 'Google AI Pro plan', bestFor: ['writing', 'research', 'mixed'], source: 'https://gemini.google/subscriptions/' },
    { name: 'Ultra', monthlyPerSeat: 200, description: 'High-usage Google AI plan', bestFor: ['research', 'mixed'], source: 'https://gemini.google/subscriptions/' },
    { name: 'API', monthlyPerSeat: 12, description: 'Estimated light Gemini API usage', bestFor: ['data', 'research'], source: 'https://ai.google.dev/gemini-api/docs/pricing' },
  ],
  v0: [
    { name: 'Free', monthlyPerSeat: 0, description: 'Free prototyping credits', bestFor: ['coding'], source: 'https://v0.app/pricing' },
    { name: 'Team', monthlyPerSeat: 30, description: 'Team UI prototyping plan', bestFor: ['coding'], source: 'https://v0.app/pricing' },
    { name: 'Business', monthlyPerSeat: 100, description: 'Business plan with higher controls', bestFor: ['coding'], source: 'https://v0.app/pricing' },
  ],
};
