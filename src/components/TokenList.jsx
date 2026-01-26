import TokenCard from "./TokenCard";

function TokenList({ tokens, searchQuery, setSearchQuery, onSelectToken }) {
  // This component represents the "list" view of the application.
  // It does not control which view is visible.
  // App.jsx controls visibility using the view state.

  return (
    <div>
      {/* 
        This input uses state that lives in App.jsx.
        When switching views, this input value persists
        because the state is owned by App.jsx, not this component.
      */}
      <input
        type="text"
        placeholder="Search by name, ticker, chain, or category"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      {/* 
        This list is derived from props.
        The data persists across view changes because it is passed
        down from App.jsx state.
      */}
      <ul className="list">
        {tokens.map(token => (
          <li key={token.id} style={{ marginBottom: 12 }}>
            <TokenCard
              token={token}
              onSelect={() => onSelectToken(token.id)}
            />
          </li>
        ))}
      </ul>

      {/* 
        This conditional message re-renders based on filtered data.
        It does not persist any state on its own.
      */}
      {tokens.length === 0 && <p>No tokens found.</p>}
    </div>
  );
}

export default TokenList;
