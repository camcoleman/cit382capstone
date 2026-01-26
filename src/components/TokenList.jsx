import TokenCard from "./TokenCard";

function TokenList({ tokens, searchQuery, setSearchQuery, onSelectToken }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search by name, ticker, chain, or category"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

<ul className="list">
  {tokens.map(token => (
    <li key={token.id} style={{ marginBottom: 12 }}>
      <TokenCard token={token} onSelect={() => onSelectToken(token.id)} />
    </li>
  ))}
</ul>


      {tokens.length === 0 && <p>No tokens found.</p>}
    </div>
  );
}

export default TokenList;
