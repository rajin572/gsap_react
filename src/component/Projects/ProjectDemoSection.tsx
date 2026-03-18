"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { IProject } from "@/data/projectsData";

const componentMap: Record<string, React.ComponentType> = {
    "expanding-gallery": dynamic(() => import("../ui/animation/components/ProjectExpandingGallery")),
    "grid-scale": dynamic(() => import("../ui/animation/components/ProjectGridScaleAnimation")),
    "tilt-card": dynamic(() => import("../ui/animation/components/TiltCardDemo")),
};

type Tab = "demo" | "code" | "theory";

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "demo", label: "Live Demo", icon: "▶" },
    { id: "code", label: "Show Code", icon: "</>" },
    { id: "theory", label: "Show Theory", icon: "◈" },
];

const ProjectDemoSection = ({ project }: { project: IProject }) => {
    const [activeTab, setActiveTab] = useState<Tab>("demo");
    const [copied, setCopied] = useState(false);

    const Demo = componentMap[project.component];
    const activeIndex = TABS.findIndex((t) => t.id === activeTab);

    const copyCode = async () => {
        await navigator.clipboard.writeText(project.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full">
            {/* ── Tab bar ── */}
            <div className="px-6 mb-6 max-w-5xl mx-auto">
                <div className="relative inline-flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                    {/* Sliding pill */}
                    <div
                        className="absolute top-1 bottom-1 rounded-lg bg-white transition-transform duration-300 ease-in-out"
                        style={{
                            width: `calc((100% - 8px) / ${TABS.length})`,
                            transform: `translateX(calc(${activeIndex} * 100% + ${activeIndex * 4}px))`,
                        }}
                    />

                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={[
                                "relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs transition-colors duration-300 whitespace-nowrap",
                                activeTab === tab.id
                                    ? "text-black"
                                    : "text-white/50 hover:text-white/80",
                            ].join(" ")}
                        >
                            <span className="text-[10px]">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <div key={activeTab} className="animate-tab-in">
                {/* Demo */}
                {activeTab === "demo" && (
                    <div className="w-full border-y border-white/10 bg-white/5">
                        {Demo ? (
                            <Demo />
                        ) : (
                            <p className="text-white/40 font-mono text-sm text-center py-20">
                                No live demo available.
                            </p>
                        )}
                    </div>
                )}

                {/* Code */}
                {activeTab === "code" && (
                    <div className="px-6 max-w-5xl mx-auto">
                        <div className="rounded-2xl overflow-hidden border border-white/10">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    {/* traffic lights */}
                                    <div className="flex gap-1.5">
                                        <span className="w-3 h-3 rounded-full bg-red-500/70" />
                                        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                        <span className="w-3 h-3 rounded-full bg-green-500/70" />
                                    </div>
                                    <span className="font-mono text-xs text-white/40">
                                        {project.slug}.tsx
                                    </span>
                                </div>
                                <button
                                    onClick={copyCode}
                                    className="flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors duration-200"
                                >
                                    {copied ? "✓ copied" : "⎘ copy"}
                                </button>
                            </div>
                            {/* Body */}
                            <pre className="overflow-auto max-h-[70vh] p-5 text-sm leading-relaxed text-green-300 bg-[#0d1117] font-mono whitespace-pre">
                                <code>{project.code}</code>
                            </pre>
                        </div>
                    </div>
                )}

                {/* Theory */}
                {activeTab === "theory" && (
                    <div className="px-6 max-w-5xl mx-auto">
                        <div className="rounded-2xl border border-white/10 overflow-hidden">
                            {/* Overview */}
                            <div className="px-6 py-5 bg-white/5 border-b border-white/10">
                                <span className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-2 block">
                                    Overview
                                </span>
                                <p className="font-mono text-sm text-white/80 leading-relaxed">
                                    {project.theory.overview}
                                </p>
                            </div>

                            {/* Steps */}
                            <div className="divide-y divide-white/5">
                                {project.theory.steps.map((step, i) => (
                                    <div key={i} className="flex gap-4 px-6 py-5">
                                        <span className="font-mono text-xs text-secondary mt-0.5 shrink-0">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div>
                                            <h3 className="font-mono text-sm font-bold text-white mb-2">
                                                {step.title.replace(/^\d+\.\s*/, "")}
                                            </h3>
                                            <p className="font-mono text-sm text-white/60 leading-relaxed">
                                                {step.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDemoSection;
