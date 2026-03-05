"use client";

import React, { useState } from "react";

// ─────────────────────────────────────────────
// ProConList
// ─────────────────────────────────────────────
export const ProConList = ({ pros, cons }: { pros: string[]; cons: string[] }) => (
    <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-xl p-3">
            <p className="text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
                ✅ Pros
            </p>
            <ul className="flex flex-col gap-1.5">
                {pros.map((p, i) => (
                    <li key={i} className="text-emerald-300/80 text-[11px] leading-relaxed flex gap-1.5">
                        <span className="mt-0.5 shrink-0">•</span>
                        <span>{p}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="bg-red-950/40 border border-red-800/30 rounded-xl p-3">
            <p className="text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
                ❌ Cons
            </p>
            <ul className="flex flex-col gap-1.5">
                {cons.map((c, i) => (
                    <li key={i} className="text-red-300/80 text-[11px] leading-relaxed flex gap-1.5">
                        <span className="mt-0.5 shrink-0">•</span>
                        <span>{c}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

// ─────────────────────────────────────────────
// TheoryBox
// ─────────────────────────────────────────────
export const TheoryBox = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-zinc-900/80 border border-zinc-700/40 rounded-xl p-4 text-zinc-400 text-[12px] leading-relaxed">
        {children}
    </div>
);

// ─────────────────────────────────────────────
// DemoCard
// ─────────────────────────────────────────────
export interface DemoCardProps {
    label: string;
    theory: React.ReactNode;
    pros: string[];
    cons: string[];
    code?: string;
    children: React.ReactNode;
}

const DemoCard = ({ label, theory, pros, cons, code, children }: DemoCardProps) => {
    const [open, setOpen] = useState(false);
    const [openCode, setOpenCode] = useState(false);

    return (
        <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-2xl p-5 flex flex-col gap-4">
            {/* Label row */}
            <div className="flex items-center justify-between gap-2">
                <span className="inline-block bg-secondary/10 text-secondary text-xs font-mono px-2 py-1 rounded">
                    {label}
                </span>
                <div className="flex gap-2">
                    {code && (
                        <button
                            onClick={() => setOpenCode((v) => !v)}
                            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-600 transition-colors"
                        >
                            {openCode ? "▲ hide code" : "▼ show code"}
                        </button>
                    )}
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-600 transition-colors"
                    >
                        {open ? "▲ hide theory" : "▼ show theory"}
                    </button>
                </div>
            </div>

            {/* Collapsible code */}
            {openCode && code && (
                <pre className="bg-zinc-950 border border-zinc-700/40 rounded-xl p-4 text-[11px] text-secondary font-mono overflow-x-auto leading-5 whitespace-pre">
                    <code>{code}</code>
                </pre>
            )}

            {/* Collapsible theory + pros/cons */}
            {open && (
                <div className="flex flex-col gap-3">
                    <TheoryBox>{theory}</TheoryBox>
                    <ProConList pros={pros} cons={cons} />
                </div>
            )}

            {/* Divider */}
            <div className="border-t border-zinc-700/40" />

            {/* Live demo */}
            <div>{children}</div>
        </div>
    );
};

export default DemoCard;
