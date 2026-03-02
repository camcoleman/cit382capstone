function formatCurrency(value) {
    if (!value) return "—";
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  }
  
  function TokenDetail({ token, onBack, onToggleChecklist }) {
    return (

    
      <div>
        <button onClick={onBack} style={{ marginBottom: 12 }}>
          Back
        </button>
  
        <h2>
          {token.name} ({token.ticker})
        </h2>
        <p>
          Chain: {token.chain} | Category: {token.category}
        </p>
  
        <h3>Key Metrics</h3>
        <ul>
          <li>FDV: {formatCurrency(token.keyMetrics.fdv)}</li>
          <li>Market Cap: {formatCurrency(token.keyMetrics.mcap)}</li>
          <li>TVL: {formatCurrency(token.keyMetrics.tvl)}</li>
          <li>24h Volume: {formatCurrency(token.keyMetrics.volume24h)}</li>
        </ul>
  
        <h3>Thesis</h3>
        <ul>
          {token.thesis.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
  
        <h3>Risks</h3>
        <ul>
          {token.risks.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
  
        <h3>Research Checklist</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {token.checklist.map(item => (
            <li key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => onToggleChecklist(token.id, item.id)}
                />{" "}
                {item.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
      
    );
  }
  <div className="card section">
  <h3>Key Metrics</h3>
  ...
</div>

  export default TokenDetail;
  