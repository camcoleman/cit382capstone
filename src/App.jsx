import { useMemo, useState, useEffect } from "react";
import TokenList from "./components/TokenList";
import TokenDetail from "./components/TokenDetail";
import AISummaryBox from "./components/AISummaryBox";
import NewTokenForm from "./components/NewTokenForm";

const TOKENS_STORAGE_KEY = "capstone_tokens_v1";
const RESEARCH_STORAGE_KEY = "capstone_research_v1";

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

function App() {
  // 1) State first
  const [view, setView] = useState("list");

  const [tokens, setTokens] = useState(() => {
    try {
      const raw = localStorage.getItem(TOKENS_STORAGE_KEY);
      if (!raw) return starterTokens;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : starterTokens;
    } catch {
      return starterTokens;
    }
  });

  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [researchByTokenId, setResearchByTokenId] = useState(() => {
    try {
      const raw = localStorage.getItem(RESEARCH_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  // 2) Effects after state
  useEffect(() => {
    try {
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
    } catch {
      // ignore
    }
  }, [tokens]);

  useEffect(() => {
    try {
      localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(researchByTokenId));
    } catch {
      // ignore
    }
  }, [researchByTokenId]);

  // 3) Memos after effects
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

  // 4) Functions
  function toggleChecklist(tokenId, itemId) {
    setTokens(prev =>
      prev.map(token =>
        token.id === tokenId
          ? {
              ...token,
              checklist: token.checklist.map(item =>
                item.id === itemId ? { ...item, done: !item.done } : item
              )
            }
          : token
      )
    );
  }

  function saveResearchOutput(tokenId, text) {
    setResearchByTokenId(prev => ({
      ...prev,
      [tokenId]: text
    }));
  }

  function addToken(newTokenFields) {
    setTokens(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(t => t.id)) + 1 : 1;

      const newToken = {
        id: nextId,
        ...newTokenFields,
        thesis: [],
        risks: [],
        keyMetrics: { fdv: 0, mcap: 0, tvl: 0, volume24h: 0 },
        checklist: [
          { id: "tokenomics", label: "Review tokenomics and emissions", done: false },
          { id: "competition", label: "Compare to competitors", done: false },
          { id: "catalysts", label: "List catalysts and risk windows", done: false }
        ]
      };

      return [newToken, ...prev];
    });

    setView("list");
  }

  function resetDemoData() {
    try {
      localStorage.removeItem(TOKENS_STORAGE_KEY);
      localStorage.removeItem(RESEARCH_STORAGE_KEY);
    } catch {
      // ignore
    }

    setTokens(starterTokens);
    setResearchByTokenId({});
    setSelectedTokenId(null);
    setSearchQuery("");
    setView("list");
  }

  const savedOutput = selectedToken ? (researchByTokenId[selectedToken.id] || "") : "";

  // 5) Return last
  return (
    <div className="app-container">
      <div className="app-shell">
        <div className="main-column">
          <div className="row">
            <div>
              <h1>Token Research Explorer</h1>
              <p>A lightweight research dashboard for a college blockchain group.</p>
            </div>

            <div className="row">
              <button onClick={() => setView("new")}>New Token</button>
              <button onClick={resetDemoData}>Reset</button>
            </div>
          </div>

          {view === "new" && (
            <NewTokenForm
              onSave={addToken}
              onCancel={() => setView("list")}
            />
          )}

          {view === "list" && (
            <TokenList
              tokens={filteredTokens}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectToken={(id) => {
                setSelectedTokenId(id);
                setView("detail");
              }}
            />
          )}

          {view === "detail" && selectedToken && (
            <TokenDetail
              token={selectedToken}
              onBack={() => {
                setSelectedTokenId(null);
                setView("list");
              }}
              onToggleChecklist={toggleChecklist}
            />
          )}

          {view === "detail" && !selectedToken && (
            <div className="card section">
              <p className="muted">No token selected. Go back to the list.</p>
              <button onClick={() => setView("list")}>Back to List</button>
            </div>
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
