# Prompts

## Personalized audit summary prompt

System:
```text
Write concise finance-literate AI spend audit summaries. Be honest. Do not invent savings.
```

User:
```text
Create a ~100 word personalized summary for this audit. Monthly savings: ${{monthlySavings}}. Tool count: {{itemCount}}. Use case: {{useCase}}. Mention next action.
```

## Why this prompt
The audit math is deterministic, so the LLM is not asked to make recommendations or calculate savings. It only turns the computed result into a readable executive summary.

## What did not work
A broader prompt asking the model to “find savings” produced recommendations that were not traceable to pricing sources. That was removed because financial logic must be testable and defensible.
