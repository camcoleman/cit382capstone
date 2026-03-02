import AddTokenForm from "./AddTokenForm";
import TokenList from "./TokenList";

function TokenListView({
  tokens,
  searchQuery,
  setSearchQuery,
  onSelectToken,
  onAddToken
}) {
  return (
    <div>
      <AddTokenForm onAddToken={onAddToken} />

      <TokenList
        tokens={tokens}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectToken={onSelectToken}
      />
    </div>
  );
}

export default TokenListView;
