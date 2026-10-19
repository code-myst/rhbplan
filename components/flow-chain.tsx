export default function FlowChain({ items }: { items: string[] }) {
  return (
    <div className="my-3 flex flex-wrap items-center gap-2">
      {items.map((s, i) => {
        const [a, b] = s.split("|");
        return (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted-foreground" aria-hidden="true">→</span>}
            <div className="flow-box"><b className="block">{a}</b>{b && <small className="block text-xs leading-tight text-muted-foreground">{b}</small>}</div>
          </div>
        );
      })}
    </div>
  );
}
