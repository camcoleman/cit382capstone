import { useMemo, useState } from "react";
import TokenList from "./components/TokenList";
import TokenDetail from "./components/TokenDetail";


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
  // This state lives in App.jsx
  const [view, setView] = useState("list");

  // This state lives in App.jsx
  const [tokens, setTokens] = useState(starterTokens);

  // This state lives in App.jsx
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  // This state lives in App.jsx
  const [searchQuery, setSearchQuery] = useState("");

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
                item.id === itemId
                  ? { ...item, done: !item.done }
                  : item
              )
            }
          : token
      )
    );
  }

  return (
    <div className="app-container">
      <h1>Token Research Explorer</h1>
      <p>A lightweight research dashboard for a college blockchain group.</p>

      {/* This variable controls which part of the UI is visible */}
      {/* view controls whether the list view or detail view is shown */}

      <button onClick={() => setView("list")}>List</button>
      <button onClick={() => setView("detail")}>Detail</button>

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

      {/* When the view changes, this data persists: */}
      {/* tokens, searchQuery, selectedTokenId, checklist state */}

      {/*
      Observations:
      - Data that persisted across views:
        tokens, searchQuery, selectedTokenId, checklist state
      - Data that reset when views changed:
        any local state inside view components
      */}

      {/*
      Possible future side effects in this app:
      - Load saved token research when the app opens
      - Save checklist progress when token data changes
      - Sync token data from an external source
      */}

      {/*
      Reflection:
      - One thing that surprised me about switching views:
        state in App.jsx persists even when views unmount
      - One thing that felt confusing:
        UI resets when state is moved into a view component
      - One question I have about how React manages data:
        when React decides to preserve versus recreate state
      */}
    </div>
  );
}

export default App;
