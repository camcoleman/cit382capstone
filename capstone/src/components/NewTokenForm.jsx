import { useMemo, useState } from "react";

function NewTokenForm({ onSave, onCancel }) {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [chain, setChain] = useState("");
  const [category, setCategory] = useState("");

  const canSave = useMemo(() => {
    return (
      name.trim().length > 0 &&
      ticker.trim().length > 0 &&
      chain.trim().length > 0 &&
      category.trim().length > 0
    );
  }, [name, ticker, chain, category]);

  function handleSave() {
    if (!canSave) return;

    onSave({
      name: name.trim(),
      ticker: ticker.trim().toUpperCase(),
      chain: chain.trim(),
      category: category.trim()
    });

    setName("");
    setTicker("");
    setChain("");
    setCategory("");
  }

  return (
    <div className="card section">
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <div className="muted">Token name</div>
          <input
            type="text"
            value={name}
            placeholder="Solana"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ width: 160 }}>
          <div className="muted">Ticker</div>
          <input
            type="text"
            value={ticker}
            placeholder="SOL"
            onChange={(e) => setTicker(e.target.value)}
          />
        </div>
      </div>

      <div className="row section" style={{ alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <div className="muted">Chain</div>
          <input
            type="text"
            value={chain}
            placeholder="Solana"
            onChange={(e) => setChain(e.target.value)}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div className="muted">Category</div>
          <input
            type="text"
            value={category}
            placeholder="L1"
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>

      <div className="row section">
        <button onClick={handleSave} disabled={!canSave}>
          Save Token
        </button>
        <button onClick={onCancel}>
          Cancel
        </button>
      </div>

      <div className="muted section">
        This form uses controlled inputs. Data is saved into shared state in App.jsx and persists across views.
      </div>
    </div>
  );
}

export default NewTokenForm;
