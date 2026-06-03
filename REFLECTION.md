# Reflection

## 1. Hardest bug
The hardest bug was making public audit URLs work consistently across local and production environments. At first, the result page worked immediately after creating an audit because the in-memory Map still had the data. But when the page was refreshed or opened in a new serverless instance, the audit disappeared. My first hypothesis was that the dynamic route was wrong, then I checked the API response and realized the ID was correct. The real issue was that in-memory storage is not durable in serverless deployments. I solved it by keeping the in-memory fallback only for local demos and adding Supabase persistence for production. This also changed how I thought about the project: shareable links are not just a frontend feature; they require real storage.

## 2. Decision reversed
I initially planned to use an LLM for the audit recommendations because the assignment includes AI. I reversed that decision after thinking through what a finance person would expect. If the same input gives different recommendations on different runs, the audit loses credibility. I moved the audit logic into deterministic TypeScript rules and reserved the LLM only for the personalized summary paragraph. This made the product more trustworthy and easier to test. It also helped me write specific unit tests for downgrade cases, API-direct recommendations, and high-savings Credex opportunities.

## 3. Week 2 plan
In week 2, I would build benchmark mode and a pricing-data admin workflow. Benchmark mode would show AI spend per developer compared with companies of similar team size and stage. The pricing workflow would store vendor pricing as versioned records, so old audits remain reproducible even when pricing changes. I would also add analytics instrumentation for audit started, audit completed, lead captured, consultation clicked, and share link copied. Finally, I would add a PDF export because founders often forward cost-saving reports internally.

## 4. AI tools usage
I used AI tools for scaffolding ideas, copy alternatives, and checking edge cases in the business documents. I did not trust AI for pricing numbers, final audit math, or user interview content. One specific issue AI got wrong was treating some enterprise prices as fixed public prices even when vendors list them as “contact sales.” I caught this by checking official pricing pages and changed those values to clearly marked estimates. The main lesson was that AI is useful for speed, but financial claims need source-backed verification.

## 5. Self-rating
**Discipline: 8/10** — I kept scope focused on the six MVP requirements before attempting extras.  
**Code quality: 7/10** — The app has typed data structures and tested core logic, but pricing data could become cleaner with a database-backed versioning system.  
**Design sense: 7/10** — The UI is clean and shareable, though it could use more custom visual identity.  
**Problem-solving: 8/10** — I separated deterministic financial logic from AI-generated text and handled storage failure modes.  
**Entrepreneurial thinking: 7/10** — The GTM and economics are specific, but real traction data would make them stronger.
