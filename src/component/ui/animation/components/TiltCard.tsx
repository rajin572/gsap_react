"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { IProject } from "@/data/projectsData";

const ROTATION_RANGE = 5;

const TiltCard = ({ project }: { project: IProject }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        const rX = -((e.clientY - rect.top) / rect.height - 0.5) * ROTATION_RANGE;
        const rY = ((e.clientX - rect.left) / rect.width - 0.5) * ROTATION_RANGE;

        // Normalised cursor position (0–1) for glow
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
            background: `radial-gradient(200px circle at ${gX}% ${gY}%, rgba(10,228,72,0.1), transparent 70%)`,
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
        /* Perspective wrapper */
        <div
            style={{ perspective: "900px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Tiltable card */}
            <div
                ref={cardRef}
                style={{
                    transformStyle: "preserve-3d",
                    boxShadow: "0 20px 60px -10px rgba(0,0,0,0.6)",
                }}
                className="relative flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 will-change-transform"
            >
                {/* Cursor glow overlay */}
                <div
                    ref={glowRef}
                    className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
                />

                {/* Thumbnail — slightly elevated */}
                <div
                    style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
                    className="relative aspect-video w-full overflow-hidden rounded-t-2xl"
                >
                    <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                    {/* Year badge — most elevated */}
                    <span
                        style={{ transform: "translateZ(30px)" }}
                        className="absolute top-3 right-3 text-xs font-mono bg-black/60 text-white px-2 py-1 rounded-full"
                    >
                        {project.year}
                    </span>
                </div>

                {/* Content — mid elevation */}
                <div
                    style={{ transform: "translateZ(12px)", transformStyle: "preserve-3d" }}
                    className="flex flex-col gap-3 p-5"
                >
                    <h3 className="font-mono text-lg font-bold text-white leading-tight">
                        {project.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
                        {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-1">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs font-mono bg-white/10 text-white/70 px-2 py-0.5 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* CTA — most elevated in content */}
                    <Link
                        href={`/project/${project.id}`}
                        style={{ transform: "translateZ(20px)" }}
                        className="mt-2 inline-block text-sm font-mono text-secondary hover:underline"
                    >
                        View project →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TiltCard;
