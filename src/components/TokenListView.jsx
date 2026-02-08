import TokenList from "./TokenList";

function TokenListView({ tokens, searchQuery, setSearchQuery, onSelectToken }) {
  return (
    <TokenList
      tokens={tokens}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSelectToken={onSelectToken}
    />
  );
}

export default TokenListView;
