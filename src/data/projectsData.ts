export interface IProjectTheoryStep {
    title: string;
    content: string;
}

export interface IProjectTheory {
    overview: string;
    steps: IProjectTheoryStep[];
}

export interface IProject {
    id: number;
    slug: string;
    title: string;
    description: string;
    longDescription: string;
    thumbnail: string;
    tags: string[];
    year: number;
    component: string;
    code: string;
    theory: IProjectTheory;
    liveUrl?: string;
    githubUrl?: string;
}

// ─── Project 1 ────────────────────────────────────────────────────────────────

const expandingGalleryCode = `"use client";

import { useState } from "react";
import Image from "next/image";

const galleryItems = [
    {
        src: "https://images.unsplash.com/photo-1633885274964-d5a5d914bcb3?q=80&w=687&auto=format&fit=crop",
        alt: "Abstract Art",
        title: "Abstract Art",
        description: "Explore vibrant colors and modern geometric designs",
    },
    {
        src: "https://images.unsplash.com/photo-1589194837807-30a2f9540ad9?q=80&w=687&auto=format&fit=crop",
        alt: "Nature Photography",
        title: "Nature Photography",
        description: "Breathtaking landscapes and natural wonders",
    },
    {
        src: "https://images.unsplash.com/photo-1582644826651-f71401f0f3f6?q=80&w=687&auto=format&fit=crop",
        alt: "Urban Design",
        title: "Urban Design",
        description: "Modern architecture and city life captured beautifully",
    },
    {
        src: "https://images.unsplash.com/photo-1614679967638-fe153775eff6?q=80&w=765&auto=format&fit=crop",
        alt: "Creative Workspace",
        title: "Creative Workspace",
        description: "Inspiring workspaces for creative professionals",
    },
    {
        src: "https://images.unsplash.com/photo-1617195737496-bc30194e3a19?q=80&w=735&auto=format&fit=crop",
        alt: "Digital Innovation",
        title: "Digital Innovation",
        description: "The future of technology and creative tools",
    },
];

const ProjectExpandingGallery = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const isAnyExpanded = expandedIndex !== null;

    const getColumnFlex = (index: number) => {
        if (isAnyExpanded) return expandedIndex === index ? 3 : 0.5;
        if (hoveredIndex !== null) return hoveredIndex === index ? 3 : 0.5;
        return 1;
    };

    const handleClick = (index: number) => {
        setExpandedIndex((prev) => (prev === index ? null : index));
    };

    const isOverlayVisible = (index: number) =>
        expandedIndex === index || (expandedIndex === null && hoveredIndex === index);

    const isMobileExpanded = (index: number) => expandedIndex === index;

    return (
        <div className="w-full max-w-3xl mx-auto p-5">
            <div className="flex max-md:flex-col gap-3 h-112.5 max-md:h-auto overflow-hidden">
                {galleryItems.map((item, index) => (
                    <div
                        key={index}
                        className={[
                            "group relative cursor-pointer overflow-hidden rounded-3xl",
                            "max-md:flex-none max-md:transition-[height] max-md:duration-800 max-md:ease-in-out",
                            isMobileExpanded(index) ? "max-md:h-87.5" : "max-md:h-30",
                            "transition-[flex] duration-800 ease-in-out",
                        ].join(" ")}
                        style={{ flex: getColumnFlex(index) }}
                        onClick={() => handleClick(index)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="relative w-full h-full overflow-hidden rounded-3xl">
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, 20vw"
                                className="object-cover object-center rounded-3xl transition-transform duration-800 ease-in-out group-hover:scale-110"
                            />
                            <div
                                className={[
                                    "absolute bottom-0 left-0 right-0 px-5 py-7.5",
                                    "bg-[linear-gradient(to_top,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.12)_40%,transparent_100%)]",
                                    "transition-[transform,opacity] duration-800 ease-in-out",
                                    isOverlayVisible(index)
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-full opacity-0",
                                ].join(" ")}
                            >
                                <h3 className="mb-2 font-mono text-[22px] font-bold text-white truncate">
                                    {item.title}
                                </h3>
                                <p className="font-mono text-sm font-normal leading-relaxed text-white line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectExpandingGallery;`;

const expandingGalleryTheory: IProjectTheory = {
    overview:
        "The Expanding Gallery uses CSS Flexbox flex-grow values controlled by React state to smoothly expand and collapse columns. No GSAP or JavaScript animation is needed — pure CSS transitions handle the motion.",
    steps: [
        {
            title: "1. Flex-grow as the animation driver",
            content:
                "Each column lives in a flex container. By changing the `flex` value (via an inline style) between 0.5 (collapsed) and 3 (expanded), and applying `transition: flex 800ms ease-in-out` via Tailwind's `transition-[flex] duration-800 ease-in-out`, the browser smoothly interpolates the width of every column simultaneously — no JS animation loop required.",
        },
        {
            title: "2. State: expandedIndex & hoveredIndex",
            content:
                "`expandedIndex` stores which column is click-locked open. `hoveredIndex` stores which column the mouse is currently over. `getColumnFlex(index)` reads both: if something is click-locked, it takes priority; otherwise the hovered column wins. All others collapse to flex 0.5.",
        },
        {
            title: "3. Click-to-lock toggle",
            content:
                "`handleClick` sets `expandedIndex` to the clicked column, or back to `null` if it was already locked. This lets the user pin a column open without needing to keep the mouse over it — useful on touch devices or when reading the overlay text.",
        },
        {
            title: "4. Overlay slide-up animation",
            content:
                "Each column has an absolutely-positioned overlay div at the bottom. When `isOverlayVisible(index)` returns true, Tailwind classes `translate-y-0 opacity-100` are applied; otherwise `translate-y-full opacity-0`. The `transition-[transform,opacity] duration-800` on the overlay handles the smooth slide-up/fade-in.",
        },
        {
            title: "5. Mobile: height instead of flex",
            content:
                "On screens below `md` (768 px) the flex container switches to `flex-direction: column` and each column gets a fixed height (`h-30` collapsed, `h-87.5` expanded). The `transition-[height]` Tailwind class animates the height change, giving the same expanding feel in a vertical stacked layout.",
        },
        {
            title: "6. Image scale on hover (group modifier)",
            content:
                "The column div carries the `group` class. The inner `<Image>` uses `group-hover:scale-110` so it scales up whenever the parent column is hovered. Combined with `overflow-hidden rounded-3xl` on the wrapper, this creates a contained zoom-in effect.",
        },
    ],
};

// ─── Project 2 ────────────────────────────────────────────────────────────────

const gridScaleCode = `"use client";

import { useEffect, useRef } from "react";
import { projectsData } from "../../../public/data/projects";
import Image from "next/image";
import gsap from "gsap";

const PROJECTS_PER_ROW = 9;

const ProjectGridScaleAnimation = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const rowsRef = useRef<HTMLDivElement[]>([]);
    const rowStartWidth = useRef<number>(125);
    const rowEndWidth = useRef<number>(500);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const rows = rowsRef.current;
        const isMobile = window.innerWidth < 1000;
        rowStartWidth.current = isMobile ? 250 : 125;
        rowEndWidth.current = isMobile ? 750 : 500;

        // Measure the height of one fully-expanded row
        const firstRow = rows[0];
        firstRow.style.width = \`\${rowEndWidth.current}%\`;
        const expandedRowHeight = firstRow.offsetHeight;
        firstRow.style.width = "";

        const sectionGap = parseFloat(getComputedStyle(section).gap) || 0;
        const sectionPadding = parseFloat(getComputedStyle(section).paddingTop) || 0;
        const expandedSectionHeight =
            expandedRowHeight * rows.length +
            sectionGap * (rows.length - 1) +
            sectionPadding * 2;

        // Pre-set section height so the page has correct scroll room
        section.style.height = \`\${expandedSectionHeight}px\`;

        const onScrollUpdate = () => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            rows.forEach((row) => {
                const rect = row.getBoundingClientRect();
                const rowTop = rect.top + scrollY;
                const rowBottom = rowTop + rect.height;

                const scrollStart = rowTop - viewportHeight;
                const scrollEnd = rowBottom;

                let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
                progress = Math.max(0, Math.min(1, progress));

                const width =
                    rowStartWidth.current +
                    (rowEndWidth.current - rowStartWidth.current) * progress;

                row.style.width = \`\${width}%\`;
            });
        };

        gsap.ticker.add(onScrollUpdate);
    }, []);

    const total = projectsData.length;
    const half = Math.floor(PROJECTS_PER_ROW / 2);

    // Split projects into two alternating lanes
    const TOTAL_ROWS = total;
    const splitPoint = Math.ceil(total / 2);

    const rowsData = Array.from({ length: TOTAL_ROWS }, (_, rowIndex) => {
        const parityStep = Math.floor(rowIndex / 2);
        const centerIndex =
            rowIndex % 2 === 0
                ? (splitPoint + parityStep) % total
                : (0 + parityStep) % total;

        return Array.from({ length: PROJECTS_PER_ROW }, (_, colIndex) => {
            const offset = colIndex - half;
            const projectIndex = ((centerIndex + offset) % total + total) % total;
            return projectsData[projectIndex];
        });
    });

    return (
        <section
            ref={sectionRef}
            className="projects relative w-full py-2 flex flex-col items-center gap-2 overflow-hidden"
        >
            {rowsData.map((rowProjects, rowIndex) => (
                <div
                    key={rowIndex}
                    className="projects-row w-[125%] flex gap-4"
                    ref={(el) => { if (el) rowsRef.current[rowIndex] = el; }}
                >
                    {rowProjects.map((project, colIndex) => (
                        <div
                            key={colIndex}
                            className="project flex-1 aspect-7/5 flex flex-col overflow-hidden"
                        >
                            <div className="project-img flex-1 min-h-0 overflow-hidden">
                                <Image
                                    className="w-full h-full object-cover"
                                    src={project.imageUrl}
                                    alt={project.title}
                                />
                            </div>
                            <div className="project-info flex justify-between py-1">
                                <p className="uppercase text-[0.75rem] font-medium tracking-[-0.02rem] leading-0.5">
                                    {project.title}
                                </p>
                                <p className="uppercase text-[0.75rem] font-medium tracking-[-0.02rem] leading-0.5">
                                    {project.year}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </section>
    );
};

export default ProjectGridScaleAnimation;`;

const gridScaleTheory: IProjectTheory = {
    overview:
        "The Grid Scale Animation is a scroll-driven effect built on the GSAP ticker. Each row starts narrower than the viewport and expands to full width as it scrolls into view, creating a cinematic reveal. No ScrollTrigger plugin is used — the progress is computed manually from raw scroll position.",
    steps: [
        {
            title: "1. GSAP ticker instead of a scroll event listener",
            content:
                "`gsap.ticker.add(callback)` registers a function that runs on every GSAP animation frame (synced to requestAnimationFrame). This is smoother than `window.addEventListener('scroll', ...)` because GSAP batches and optimises frame calls. Inside the callback we read `window.scrollY` and drive widths directly — no tweens, no timelines.",
        },
        {
            title: "2. Pre-measuring section height",
            content:
                "Before the scroll loop starts, we temporarily set the first row to its max width (`rowEndWidth%`) and read its `offsetHeight`. We then calculate the total expanded section height (`rowHeight × rows + gaps + padding`) and hard-set `section.style.height` to it. This is critical — without it the browser would collapse the section because rows are positioned relatively and their visual width exceeds 100%, causing layout shifts.",
        },
        {
            title: "3. Per-row scroll progress (0 → 1)",
            content:
                "For each row we compute `scrollStart` (when the row bottom enters the top of the viewport) and `scrollEnd` (when the row bottom leaves the bottom of the viewport). `progress = (scrollY - scrollStart) / (scrollEnd - scrollStart)` is then clamped to [0, 1]. This gives a normalised value that drives the width interpolation: `width = startWidth + (endWidth - startWidth) × progress`.",
        },
        {
            title: "4. Two-lane centre cycling algorithm",
            content:
                "Every row shows `PROJECTS_PER_ROW` (9) images, but each row has a different project as its centre. The projects are split at `splitPoint = Math.ceil(total / 2)`. Odd-indexed rows (0, 2, 4…) take centres from the upper half; even-indexed rows take from the lower half. The `offset` loop (`colIndex - half`) wraps around with modulo arithmetic so all 9 slots are filled regardless of how many total projects exist.",
        },
        {
            title: "5. Responsive start/end widths",
            content:
                "On mobile (`window.innerWidth < 1000`) the start width is 250% and end width is 750%, vs 125% / 500% on desktop. This keeps the effect visually proportional on smaller screens where a 125%-wide row would already be nearly full-width.",
        },
        {
            title: "6. No CSS transitions — direct DOM writes",
            content:
                "Width is set via `row.style.width = width + '%'` on every frame. There are no CSS transitions on the rows. The smoothness comes entirely from the fact that `scrollY` changes gradually as the user scrolls, producing a naturally eased visual motion. GSAP ticker runs at ~60 fps so the update is imperceptible.",
        },
    ],
};

// ─── Project 3 ────────────────────────────────────────────────────────────────

const tiltCardCode = `"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { IProject } from "@/data/projectsData";

const ROTATION_RANGE = 18;

const TiltCard = ({ project }: { project: IProject }) => {
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

        // gsap.set avoids colour interpolation artifacts on gradient strings
        gsap.set(glowRef.current, {
            background: \`radial-gradient(200px circle at \${gX}% \${gY}%, rgba(10,228,72,0.1), transparent 70%)\`,
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
                    boxShadow: "0 20px 60px -10px rgba(0,0,0,0.6)",
                }}
                className="relative flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 will-change-transform"
            >
                <div ref={glowRef} className="pointer-events-none absolute inset-0 z-10 rounded-2xl" />

                <div
                    style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
                    className="relative aspect-video w-full overflow-hidden rounded-t-2xl"
                >
                    <Image src={project.thumbnail} alt={project.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    <span
                        style={{ transform: "translateZ(30px)" }}
                        className="absolute top-3 right-3 text-xs font-mono bg-black/60 text-white px-2 py-1 rounded-full"
                    >
                        {project.year}
                    </span>
                </div>

                <div
                    style={{ transform: "translateZ(12px)", transformStyle: "preserve-3d" }}
                    className="flex flex-col gap-3 p-5"
                >
                    <h3 className="font-mono text-lg font-bold text-white leading-tight">{project.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed line-clamp-2">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mt-1">
                        {project.tags.map((tag) => (
                            <span key={tag} className="text-xs font-mono bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <Link
                        href={\`/project/\${project.id}\`}
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

export default TiltCard;`;

const tiltCardTheory: IProjectTheory = {
    overview:
        "The 3D Tilt Card uses GSAP to animate CSS 3D transforms (rotateX / rotateY) driven by the cursor position relative to the card. A spring-like elastic reset plays on mouse leave. A radial gradient glow follows the cursor using gsap.set for instant (no-interpolation) updates.",
    steps: [
        {
            title: "1. Perspective & preserve-3d",
            content:
                "The outer wrapper has `style={{ perspective: '900px' }}` which sets the vanishing-point distance. The inner card div has `transformStyle: 'preserve-3d'` so child elements can float at different Z depths (translateZ). Without these two properties the rotateX/Y transforms look flat.",
        },
        {
            title: "2. Cursor-to-rotation mapping",
            content:
                "`getBoundingClientRect()` gives the card's position. The cursor offset from center is normalised to the range −0.5 → +0.5 by doing `(clientX - rect.left) / rect.width - 0.5`. Multiplied by `ROTATION_RANGE` (18 °) this gives `rotateY`; the Y axis is negated for `rotateX` so the card tilts toward the cursor naturally.",
        },
        {
            title: "3. gsap.to for smooth tilt",
            content:
                "`gsap.to(cardRef.current, { rotateX, rotateY, duration: 0.4, ease: 'power2.out' })` — GSAP interpolates from the current rotation to the target on every mouse move event. The 0.4 s duration means rapid cursor movements are smoothed out; the card lags slightly behind for a fluid feel.",
        },
        {
            title: "4. elastic.out spring reset on leave",
            content:
                "On `mouseLeave`, `gsap.to` targets `rotateX: 0, rotateY: 0` with `ease: 'elastic.out(1, 0.45)'` and `duration: 0.9`. The elastic easing overshoots then settles, mimicking a physical spring — the card bounces back to flat rather than snapping or gliding.",
        },
        {
            title: "5. gsap.set for glow (no interpolation)",
            content:
                "The cursor glow uses `gsap.set` (not `gsap.to`) to update the radial-gradient background. `gsap.to` on gradient strings causes colour interpolation artifacts — it passes through unexpected hues (pink, magenta) as it tries to tween between two gradient values. `gsap.set` writes the new value instantly on every frame so there is no in-between state.",
        },
        {
            title: "6. Z-depth layers for parallax feel",
            content:
                "Child elements use inline `transform: translateZ(n)` to float at different depths: the thumbnail at 20 px, the year badge at 30 px, the content block at 12 px, the CTA link at 20 px. As the card tilts, elements at higher Z values move more in screen space than those at lower Z, creating a parallax pop-out effect without any JS math.",
        },
    ],
};

// ─── Exported data ─────────────────────────────────────────────────────────────

export const projectsData: IProject[] = [
    {
        id: 1,
        slug: "expanding-gallery",
        title: "Expanding Gallery",
        description:
            "An interactive expanding gallery with smooth transitions and click-to-lock expansion.",
        longDescription:
            "A pure CSS + React expanding gallery where hovering a column stretches it out while the others shrink. Clicking locks the expansion in place. Fully responsive — on mobile it switches to a vertical stack with tap-to-expand behaviour. Overlay titles and descriptions slide up smoothly on the active panel.",
        thumbnail: "/assets/images/projectimgs/expending_gallery.png",
        tags: ["React", "Tailwind CSS", "CSS Transitions", "Responsive"],
        year: 2025,
        component: "expanding-gallery",
        code: expandingGalleryCode,
        theory: expandingGalleryTheory,
    },
    {
        id: 2,
        slug: "grid-scale-animation",
        title: "Grid Scale Animation",
        description:
            "A scroll-driven grid that scales each row from compressed to full-width as it enters the viewport.",
        longDescription:
            "Built with GSAP ticker and manual scroll tracking. Each row starts narrow and expands to full width as it scrolls into view, creating a cinematic reveal effect. The layout dynamically splits any number of projects into two alternating lanes so every project acts as a focal centre exactly once.",
        thumbnail: "/assets/images/projectimgs/grid_scale.png",
        tags: ["GSAP", "React", "Scroll Animation", "Grid Layout"],
        year: 2025,
        component: "grid-scale",
        code: gridScaleCode,
        theory: gridScaleTheory,
    },
    {
        id: 3,
        slug: "tilt-card",
        title: "3D Tilt Card",
        description:
            "A GSAP-powered 3D tilt card that rotates toward the cursor with a spring reset and a radial glow effect.",
        longDescription:
            "Each card tilts along both axes as the cursor moves over it, using GSAP to smoothly interpolate rotateX and rotateY. On mouse leave an elastic spring easing bounces it back to flat. Child elements sit at different Z depths (preserve-3d) to create a parallax pop-out. The cursor glow uses gsap.set to avoid gradient interpolation colour artifacts.",
        thumbnail: "/assets/images/projectimgs/tilt_card.png",
        tags: ["GSAP", "React", "3D CSS", "preserve-3d"],
        year: 2025,
        component: "tilt-card",
        code: tiltCardCode,
        theory: tiltCardTheory,
    },
];

export const getProjectById = (id: number): IProject | undefined =>
    projectsData.find((p) => p.id === id);

export const getProjectBySlug = (slug: string): IProject | undefined =>
    projectsData.find((p) => p.slug === slug);
