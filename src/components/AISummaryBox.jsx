import { useEffect, useMemo, useState } from "react";

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
Provide a small comparison table with 5–8 rows of criteria.

2) Growth: Past and Future
Past growth (facts only)
Provide 6–10 concrete metrics with dates.
Future growth (scenarios)
Write a bull growth path with 3–6 drivers.
Write a bear growth path with 3–6 drivers.
List 5 leading indicators.

3) Threats
List 8–12 threats with likelihood, severity, and earliest warning signal.

4) Token Value Accrual Chain
4A) Mechanism
4B) Rights
4C) Differentiation
4D) Current Token Value
4E) Catalysts
4F) Vesting and incentives
4G) Light multiple valuation
4H) Roadmap
4I) Trade

Required Closing Artifacts
A) Bull Thesis (10 bullets)
B) Bear Thesis (10 bullets)
C) Key Unknowns (5–10 bullets)
D) Source List grouped by Official, On-chain/Data, Third-party Research, News.`;
}

function AISummaryBox({ token, savedOutput, onSaveOutput }) {
  const [activeTab, setActiveTab] = useState("output");
  const [draftOutput, setDraftOutput] = useState(savedOutput || "");
  const [copied, setCopied] = useState(false);

  const tokenName = token ? token.name : "Unknown";

  const promptText = useMemo(() => {
    return buildDeepResearchPrompt(tokenName);
  }, [tokenName]);

  // Keep the text area synced when switching tokens or when saved output changes
  useEffect(() => {
    setDraftOutput(savedOutput || "");
  }, [savedOutput, token?.id]);

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

  function save() {
    if (!token) return;
    onSaveOutput(token.id, draftOutput);
  }

  function clear() {
    setDraftOutput("");
    if (!token) return;
    onSaveOutput(token.id, "");
  }

  return (
    <div className="ai-panel card">
      <div className="ai-panel-header">
        <div>
          <div className="ai-title">{token ? `${token.name} Research` : "Research"}</div>
          <div className="muted">
            Copy the prompt, run it, paste the answer, and save it per token.
          </div>
        </div>
      </div>

      <div className="ai-tabs">
        <button
          className={activeTab === "output" ? "ai-tab ai-tab-active" : "ai-tab"}
          onClick={() => setActiveTab("output")}
        >
          AI Output
        </button>
        <button
          className={activeTab === "prompt" ? "ai-tab ai-tab-active" : "ai-tab"}
          onClick={() => setActiveTab("prompt")}
        >
          Prompt
        </button>
      </div>

      {activeTab === "output" && (
        <>
          <div className="ai-actions">
            <button onClick={save} disabled={!token}>Save</button>
            <button onClick={clear} disabled={!token}>Clear</button>
          </div>

          <textarea
            className="ai-textarea"
            placeholder="Paste the AI answer here. It will be saved for the selected token."
            value={draftOutput}
            onChange={(e) => setDraftOutput(e.target.value)}
            spellCheck={false}
          />
        </>
      )}

      {activeTab === "prompt" && (
        <>
          <div className="ai-actions">
            <button onClick={copyPrompt}>
              {copied ? "Copied" : "Copy Prompt"}
            </button>
          </div>

          <textarea className="ai-textarea" value={promptText} readOnly spellCheck={false} />
        </>
      )}
    </div>
  );
}

export default AISummaryBox;
