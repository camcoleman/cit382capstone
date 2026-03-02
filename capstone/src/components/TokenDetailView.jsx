import TokenDetail from "./TokenDetail";

function TokenDetailView({ token, onBack, onToggleChecklist }) {
  return (
    <TokenDetail
      token={token}
      onBack={onBack}
      onToggleChecklist={onToggleChecklist}
    />
  );
}

export default TokenDetailView;
