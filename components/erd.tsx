"use client";

import { useMemo } from "react";
import { ERD_W, layoutErd, type Table } from "@/lib/db-generate";

const C = { line: "hsl(var(--muted-foreground))", box: "hsl(var(--card))", stroke: "hsl(var(--primary))", ink: "hsl(var(--foreground))" };

export default function Erd({ tables }: { tables: Table[] }) {
  const L = useMemo(() => layoutErd(tables), [tables]);
  return (
    <svg viewBox={`0 0 ${L.vw} ${L.vh}`} width="100%" style={{ minWidth: 640 }} role="img" aria-label="টেবিলের সম্পর্কের ডায়াগ্রাম">
      <defs>
        <marker id="ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill={C.line} /></marker>
      </defs>
      {L.lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={C.line} strokeWidth={1.2} opacity={0.6} markerEnd="url(#ar)" />)}
      {L.boxes.map((b) => (
        <g key={b.n}>
          <rect x={b.x} y={b.y} width={ERD_W} height={b.h} rx={8} strokeWidth={1.5} fill={C.box} stroke={C.stroke} />
          <text x={b.x + 10} y={b.y + 22} fontSize={14} fontWeight={700} fill={C.ink}>{b.n}</text>
          {b.keys.map((k, q) => <text key={q} x={b.x + 10} y={b.y + 42 + 17 * q} fontSize={12} fill={C.line}>{(k.pk ? "PK " : "FK ") + k.c}</text>)}
          {b.more > 0 && <text x={b.x + 10} y={b.y + 42 + 17 * b.keys.length} fontSize={12} fill={C.line}>+ আরও {b.more}টি কলাম</text>}
        </g>
      ))}
    </svg>
  );
}
