import { useState } from "react";

function AddTokenForm({ onAddToken }) {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [chain, setChain] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedTicker = ticker.trim();

    if (!trimmedName || !trimmedTicker) {
      alert("Name and ticker are required.");
      return;
    }

    if (typeof onAddToken !== "function") {
      alert("onAddToken is missing. Check TokenListView and App.jsx props.");
      return;
    }

    onAddToken({
      name: trimmedName,
      ticker: trimmedTicker.toUpperCase(),
      chain: chain.trim(),
      category: category.trim()
    });

    // Clear fields after submit
    setName("");
    setTicker("");
    setChain("");
    setCategory("");
  }

  return (
    <form onSubmit={handleSubmit} className="card section">
      <h3>Add Token</h3>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name (required)"
      />

      <input
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Ticker (required)"
      />

      <input
        value={chain}
        onChange={(e) => setChain(e.target.value)}
        placeholder="Chain"
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
      />

      <button type="submit">Add Token</button>
    </form>
  );
}

export default AddTokenForm;
