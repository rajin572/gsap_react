"use client";

import { useRef } from "react";
import gsap from "gsap";

const ROTATION_RANGE = 18;

const DEMO_ITEMS = [
    { title: "Abstract Art", year: 2025, bg: "from-violet-500 to-indigo-600" },
    { title: "Urban Design", year: 2025, bg: "from-emerald-500 to-teal-600" },
    { title: "Night Photography", year: 2025, bg: "from-rose-500 to-pink-600" },
];

const SingleCard = ({ title, year, bg }: { title: string; year: number; bg: string }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        const rX = -((e.clientY - rect.top) / rect.height - 0.5) * ROTATION_RANGE;
        const rY = ((e.clientX - rect.left) / rect.width - 0.5) * ROTATION_RANGE;
        const gX = ((e.clientX - rect.left) / rect.width) * 100;
        const gY = ((e.clientY - rect.top) / rect.height) * 100;

        gsap.to(cardRef.current, {
            rotateX: rX,
            rotateY: rY,
            transformPerspective: 900,
            duration: 0.4,
            ease: "power2.out",
        });
        gsap.set(glowRef.current, {
            background: `radial-gradient(200px circle at ${gX}% ${gY}%, rgba(10,228,72,0.15), transparent 70%)`,
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.9,
            ease: "elastic.out(1, 0.45)",
        });
        gsap.set(glowRef.current, { background: "none" });
    };

    return (
        <div
            style={{ perspective: "900px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={cardRef}
                style={{
                    transformStyle: "preserve-3d",
                    boxShadow: "0 20px 60px -10px rgba(0,0,0,0.7)",
                }}
                className="relative flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 will-change-transform"
            >
                {/* Glow */}
                <div ref={glowRef} className="pointer-events-none absolute inset-0 z-10 rounded-2xl" />

                {/* Thumbnail */}
                <div
                    style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
                    className={`relative h-40 w-full bg-linear-to-br ${bg} flex items-center justify-center rounded-t-2xl overflow-hidden`}
                >
                    <span
                        style={{ transform: "translateZ(30px)" }}
                        className="font-mono text-3xl font-bold text-white/20 select-none"
                    >
                        3D
                    </span>
                    {/* Year badge */}
                    <span
                        style={{ transform: "translateZ(30px)" }}
                        className="absolute top-3 right-3 text-xs font-mono bg-black/40 text-white px-2 py-1 rounded-full"
                    >
                        {year}
                    </span>
                </div>

                {/* Content */}
                <div
                    style={{ transform: "translateZ(12px)", transformStyle: "preserve-3d" }}
                    className="flex flex-col gap-2 p-4"
                >
                    <h3 className="font-mono text-base font-bold text-white">{title}</h3>
                    <p className="font-mono text-xs text-white/50 leading-relaxed">
                        Hover to tilt · click-to-lock · GSAP spring reset
                    </p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                        {["GSAP", "React", "3D CSS"].map((t) => (
                            <span key={t} className="text-xs font-mono bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TiltCardDemo = () => {
    return (
        <div className="w-full p-10 flex flex-wrap gap-6 justify-center items-start">
            {DEMO_ITEMS.map((item) => (
                <div key={item.title} className="w-64">
                    <SingleCard {...item} />
                </div>
            ))}
        </div>
    );
};

export default TiltCardDemo;
