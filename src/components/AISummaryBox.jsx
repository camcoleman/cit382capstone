import { useMemo, useState } from "react";

function buildDeepResearchPrompt(tokenName) {
  const cleanName = (tokenName || "Unknown").replace(/^\$/g, "");

  return `Deep Research Pitch Scaffold Prompt (Bull + Bear)
You are a crypto public-markets research analyst writing a decision-ready pitch scaffold for ${cleanName}. Produce a bullish and bearish take, grounded in verifiable evidence.

Non-negotiables
Use only sourced facts for numbers, claims about mechanisms, schedules, allocations, revenues/fees, and partnerships.
If a data point cannot be verified, write “Unknown” and list exactly what would verify it.
Include inline citations or links for every non-trivial factual claim. Prefer primary sources: docs, governance forums, audits, GitHub, official dashboards, and reputable data providers (DeFiLlama, Token Terminal, CoinGecko/CoinMarketCap, Messari, Dune, project explorers).
Do not use the “$” symbol in token names.
Write in American English.
Use properly worded bullet points only, with no sub-bullets.
Avoid starting sentences with “This”.

Output Format (use these exact section titles) and output this info
1) Relative Competition and Positioning
Identify the closest competitors (direct and adjacent) and define the category ${cleanName} is competing in.
State the core differentiation in one sentence for the bull case.
State the strongest “commoditization” argument in one sentence for the bear case.
Provide a small comparison table with 5–8 rows of criteria (examples: product scope, trust model, key risks, revenue source, distribution, moat, switching costs, regulatory exposure).

2) Growth: Past and Future
Past growth (facts only)
Provide 6–10 concrete metrics with dates, such as users, TVL, volume, fees, revenue, active addresses, integrations, liquidity depth, and retention proxies.
Highlight 2–3 inflection points that explain the trajectory.
Future growth (scenarios)
Write a bull growth path with 3–6 drivers that must be true.
Write a bear growth path with 3–6 drivers that would stall adoption.
List 5 leading indicators to monitor weekly or monthly.

3) Threats
List 8–12 threats across categories: technical, market structure, governance, regulatory, liquidity, reflexivity, competition, and operational risk.
For each threat, include: likelihood (Low/Medium/High), severity (Low/Medium/High), and the earliest observable warning signal.

4) Token Value Accrual Chain
Follow the chain exactly, in order, and keep it tightly argued.
4A) Token Value Accrual Mechanism
Explain, step-by-step, how value is created in the system and where it can flow.
Identify which actors pay (users, LPs, integrators, traders, validators, borrowers, etc.).
Identify which sink(s) exist (burns, buybacks, staking demand, required collateral, fee capture, governance rents, emissions with lockups).

4B) Token Value Accrual Rights
Enumerate the explicit rights the token has today (fee share, governance, staking yield, collateral utility, access, protocol-owned liquidity hooks, etc.).
Separate “live today” vs “proposed / roadmap” vs “speculated.”
Call out any dependencies (governance vote, legal constraints, off-chain entities, admin keys, parameter risks).

4C) Fundamental Differentiation
State the moat claim for the bull case in 3–6 bullets.
State the best rebuttal for the bear case in 3–6 bullets.
Include evidence for both.

4D) Current Token Value
Provide current market cap, FDV, circulating supply, total supply, major venues/liquidity, and a short liquidity read (depth, concentration, major holders if known).
Summarize market-implied expectations in 3–5 bullets (what price appears to be pricing in).

4E) Direct Catalysts for Token Value Accrual
List 6–12 catalysts that directly change token value accrual (not generic hype), such as fee switch proposals, launch of a core module, integrations that expand fee base, emissions changes, burns, buybacks, collateral adoption, listings that change liquidity, or regulatory clarity.
For each catalyst: expected date window (if known), mechanism impact, and falsifiable success criteria.

4F) Vesting Schedules, Allocation Charts, and Current Expenditures in Native Token
Provide an allocation breakdown with dates and cliffs, including investor/team/foundation/ecosystem/liquidity categories.
Highlight supply-expansion risk windows over the next 3–12 months.
Describe treasury flows and recurring expenditures funded in the native token (incentives, grants, market making, contributors), with numbers where available.
REALLY FOCUS ON DESCRIBING THE INCENTIVE PROGRAM
Include a simple “supply overhang” summary that identifies the largest unlock months.

4G) Light Multiple Valuation
Pick 2–4 relevant valuation lenses, based on what ${cleanName} actually is, such as FDV/fees, MC/TVL, FDV/revenue, PS-like proxy, or security-budget comparisons.
Create a comps set of 5–10 comparable assets and show the multiples in a table.
Provide a bull multiple and bear multiple, with a one-sentence justification each.
Output a rough implied range for price or market cap under bull and bear, showing your math clearly.

4H) Roadmap
List 6–12 roadmap items that matter for adoption or value accrual.
Label each item as “Execution Risk: Low/Medium/High.”
Highlight the 2–3 roadmap items that would most change the bull/bear debate.

4I) Trade
Provide a clear trade expression: spot, structured entry, or “wait” recommendation.
Include invalidation levels (what would make the thesis wrong).
Provide a bull case, base case, and bear case outcome frame with rough probabilities that sum to 100%.
List the top 5 things to monitor post-entry.

Required Closing Artifacts
A) Bull Thesis (10 bullets)
Each bullet must be a complete sentence and must reference a concrete mechanism or metric.
B) Bear Thesis (10 bullets)
Each bullet must be a complete sentence and must reference a concrete mechanism or metric.
C) Key Unknowns (5–10 bullets)
Each bullet must state what is unknown and the exact source that would verify it.
D) Source List
Provide a clean list of sources grouped by: Official, On-chain/Data, Third-party Research, and News.`;
}

function AISummaryBox({ token }) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const promptText = useMemo(() => {
    const name = token ? token.name : "Unknown";
    return buildDeepResearchPrompt(name);
  }, [token]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      alert("Copy failed. Select the text and copy manually.");
    }
  }

  const title = token ? `${token.name} AI Research` : "AI Research";

  return (
    <div className="ai-panel card">
      <div className="ai-panel-header">
        <div>
          <div className="ai-title">{title}</div>
          <div className="muted">
            Copy the research prompt. The full template is hidden to reduce clutter.
          </div>
        </div>
      </div>

      {!token && (
        <div className="ai-hint card section">
          <div className="muted">
            Select a token to generate a token specific research prompt.
          </div>
        </div>
      )}

      <div className="ai-actions">
        <button onClick={copyPrompt}>
          {copied ? "Copied" : "Copy Prompt"}
        </button>

        <button onClick={() => setShowPreview(prev => !prev)}>
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {showPreview && (
        <div className="card section">
          <div className="muted" style={{ marginBottom: 8 }}>
            Preview (first 350 characters):
          </div>
          <div
            className="muted"
            style={{
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: 12,
              whiteSpace: "pre-wrap",
              lineHeight: 1.35
            }}
          >
            {promptText.slice(0, 350)}…
          </div>
        </div>
      )}
    </div>
  );
}

export default AISummaryBox;
