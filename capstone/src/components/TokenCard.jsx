function TokenCard({ token, onSelect }) {
    return (
      <div className="card row">
        <div>
          <div style={{ fontWeight: 750 }}>
            {token.name} ({token.ticker})
          </div>
          <div className="muted">
            {token.chain} · {token.category}
          </div>
        </div>
        <button onClick={onSelect}>Open</button>
      </div>
    );
  }
  
  export default TokenCard;
  