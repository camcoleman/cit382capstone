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
  },
  {
    id: 3,
    name: "Arbitrum",
    ticker: "ARB",
    chain: "Ethereum",
    category: "L2",
    thesis: [
      "Scales Ethereum using optimistic rollups",
      "Strong ecosystem adoption and developer traction"
    ],
    risks: [
      "Sequencer decentralization timeline uncertainty",
      "Competition from other rollup ecosystems"
    ],
    keyMetrics: {
      fdv: 0,
      mcap: 0,
      tvl: 0,
      volume24h: 0
    },
    checklist: [
      { id: "dao", label: "Review DAO treasury and governance", done: false },
      { id: "usage", label: "Analyze usage and fee trends", done: false },
      { id: "tech", label: "Understand fraud proof roadmap", done: false }
    ]
  }
];

function App() {
  const [tokens, setTokens] = useState(starterTokens);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
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
    setTokens(prevTokens =>
      prevTokens.map(token => {
        if (token.id !== tokenId) return token;
        return {
          ...token,
          checklist: token.checklist.map(item =>
            item.id === itemId
              ? { ...item, done: !item.done }
              : item
          )
        };
      })
    );
  }

  return (
    <div className="app-container">
      <h1>Token Research Explorer</h1>
      <p>
        A lightweight research dashboard for a college blockchain group.
      </p>

      {!selectedToken && (
        <TokenList
          tokens={filteredTokens}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectToken={setSelectedTokenId}
        />
      )}

      {selectedToken && (
        <TokenDetail
          token={selectedToken}
          onBack={() => setSelectedTokenId(null)}
          onToggleChecklist={toggleChecklist}
        />
      )}
    </div>
  );
}

export default App;
