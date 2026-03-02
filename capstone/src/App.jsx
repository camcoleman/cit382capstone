import { useEffect, useMemo, useState } from "react";
import AISummaryBox from "./components/AISummaryBox";
import TokenListView from "./components/TokenListView";
import TokenDetailView from "./components/TokenDetailView";

const starterTokens = [
  {
    id: 1,
    name: "Solana",
    ticker: "SOL",
    chain: "Solana",
    category: "L1",
    thesis: [
      "High throughput and low fees optimized for consumer applications",
      "Strong developer ecosystem and improving network reliability"
    ],
    risks: [
      "Ecosystem concentration and validator centralization risk",
      "Execution risk as the network continues to scale"
    ],
    keyMetrics: {
      fdv: 90000000000,
      mcap: 80000000000,
      tvl: 1500000000,
      volume24h: 2500000000
    },
    checklist: [
      { id: "tokenomics", label: "Review tokenomics and emissions", done: false },
      { id: "revenue", label: "Understand fee and revenue drivers", done: false },
      { id: "competition", label: "Compare to competing L1s", done: false }
    ]
  },
  {
    id: 2,
    name: "EigenLayer",
    ticker: "EIGEN",
    chain: "Ethereum",
    category: "Restaking",
    thesis: [
      "Introduces shared security for new decentralized services",
      "Expands Ethereum’s economic security beyond L1"
    ],
    risks: [
      "Complex slashing mechanics and unclear risk boundaries",
      "Early stage governance and centralization concerns"
    ],
    keyMetrics: {
      fdv: 0,
      mcap: 0,
      tvl: 0,
      volume24h: 0
    },
    checklist: [
      { id: "avs", label: "Map the AVS landscape", done: false },
      { id: "slashing", label: "Understand slashing conditions", done: false },
      { id: "supply", label: "Review supply schedule and unlocks", done: false }
    ]
  }
];

const TOKENS_KEY = "cit382_tokens_v1";
const RESEARCH_KEY = "cit382_researchByTokenId_v1";

function safeJsonParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeLoadTokens() {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    if (!raw) return starterTokens;
    const parsed = safeJsonParse(raw, starterTokens);
    return Array.isArray(parsed) ? parsed : starterTokens;
  } catch {
    return starterTokens;
  }
}

function safeLoadResearch() {
  try {
    const raw = localStorage.getItem(RESEARCH_KEY);
    if (!raw) return {};
    const parsed = safeJsonParse(raw, {});
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function App() {
  const [view, setView] = useState("list");

  // Shared state: tokens list, persists (new feature)
  const [tokens, setTokens] = useState(() => safeLoadTokens());

  // Shared state: selected token
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  // Shared state: search query
  const [searchQuery, setSearchQuery] = useState("");

  // Shared state: saved AI output per token
  const [researchByTokenId, setResearchByTokenId] = useState(() => safeLoadResearch());

  const selectedToken = useMemo(() => {
    return tokens.find(t => t.id === selectedTokenId) || null;
  }, [tokens, selectedTokenId]);

  const filteredTokens = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tokens.filter(token =>
      `${token.name} ${token.ticker} ${token.chain} ${token.category}`
        .toLowerCase()
        .includes(q)
    );
  }, [tokens, searchQuery]);

  function toggleChecklist(tokenId, itemId) {
    setTokens(prev =>
      prev.map(token => {
        if (token.id !== tokenId) return token;
        return {
          ...token,
          checklist: token.checklist.map(item =>
            item.id === itemId ? { ...item, done: !item.done } : item
          )
        };
      })
    );
  }

  // New feature: add token into shared tokens state
  function addToken(tokenData) {
    const newToken = {
      id: Date.now(),
      name: tokenData.name || "Unknown",
      ticker: (tokenData.ticker || "").toUpperCase(),
      chain: tokenData.chain || "",
      category: tokenData.category || "",
      thesis: [],
      risks: [],
      keyMetrics: { fdv: 0, mcap: 0, tvl: 0, volume24h: 0 },
      checklist: []
    };

    setTokens(prev => [...prev, newToken]);
    setSearchQuery("");
  }

  function saveResearchOutput(tokenId, text) {
    setResearchByTokenId(prev => ({
      ...prev,
      [tokenId]: text
    }));
  }

  const savedOutput = selectedToken ? (researchByTokenId[selectedToken.id] || "") : "";

  // Effect 1: persist tokens list (new feature, obvious in demo after refresh)
  useEffect(() => {
    try {
      localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
    } catch {
      // ignore
    }
  }, [tokens]);

  // Effect 2: persist research output
  useEffect(() => {
    try {
      localStorage.setItem(RESEARCH_KEY, JSON.stringify(researchByTokenId));
    } catch {
      // ignore
    }
  }, [researchByTokenId]);

  // Effect 3: visible production behavior, document title updates
  useEffect(() => {
    if (view === "list") {
      document.title = "Token Research Explorer";
      return;
    }
    if (view === "detail" && selectedToken) {
      document.title = `${selectedToken.name} Research`;
      return;
    }
    document.title = "Token Research Explorer";
  }, [view, selectedToken]);

  return (
    <div className="app-container">
      <div className="app-shell">
        <div className="main-column">
          <h1>Token Research Explorer</h1>
          <p>A lightweight research dashboard for a college blockchain group.</p>

          {view === "list" && (
            <TokenListView
              tokens={filteredTokens}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectToken={(id) => {
                setSelectedTokenId(id);
                setView("detail");
              }}
              onAddToken={addToken}
            />
          )}

          {view === "detail" && selectedToken && (
            <TokenDetailView
              token={selectedToken}
              onBack={() => {
                setSelectedTokenId(null);
                setView("list");
              }}
              onToggleChecklist={toggleChecklist}
            />
          )}
        </div>

        <div className="side-column">
          <AISummaryBox
            token={selectedToken}
            savedOutput={savedOutput}
            onSaveOutput={saveResearchOutput}
          />
        </div>
      </div>
    </div>
  );
}

export default App;