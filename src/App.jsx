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

const STORAGE_KEY = "cit382_researchByTokenId_v1";

function safeLoadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return {};
  } catch {
    return {};
  }
}

function App() {
  const [view, setView] = useState("list");
  const [tokens, setTokens] = useState(starterTokens);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Shared state: saved AI output per token id
  const [researchByTokenId, setResearchByTokenId] = useState(() => safeLoadFromStorage());

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

  const savedOutput = selectedToken ? (researchByTokenId[selectedToken.id] || "") : "";

  // Week 5 required useEffect
  // External sync: keep localStorage updated when saved research changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(researchByTokenId));
    } catch {
      // Ignore storage errors for now
    }
  }, [researchByTokenId]);

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
