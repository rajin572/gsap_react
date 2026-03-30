"use client";

import { useEffect, useRef } from "react";
import { projectsData } from "../../../../../public/data/projects";
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

        const firstRow = rows[0];
        firstRow.style.width = `${rowEndWidth.current}%`;
        const expandedRowHeight = firstRow.offsetHeight;
        firstRow.style.width = "";

        const sectionGap = parseFloat(getComputedStyle(section).gap) || 0;
        const sectionPadding = parseFloat(getComputedStyle(section).paddingTop) || 0;
        const expandedSectionHeight =
            expandedRowHeight * rows.length +
            sectionGap * (rows.length - 1) +
            sectionPadding * 2;

        section.style.height = `${expandedSectionHeight}px`;

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

                row.style.width = `${width}%`;
            });
        };

        gsap.ticker.add(onScrollUpdate);
    }, []);

    const total = projectsData.length;
    const half = Math.floor(PROJECTS_PER_ROW / 2);

    /**
     * Dynamically splits ANY number of projects into two lanes:
     *
     * splitPoint = Math.ceil(total / 2)
     *
     * total=6:  splitPoint=3 → odd lane: P4,P5,P6 | even lane: P1,P2,P3
     * total=16: splitPoint=8 → odd lane: P9..P16   | even lane: P1..P8
     * total=60: splitPoint=30→ odd lane: P31..P60  | even lane: P1..P30
     *
     * Odd  rows (0,2,4,...): centers start at splitPoint, advance +1 each odd row
     * Even rows (1,3,5,...): centers start at 0,          advance +1 each even row
     *
     * TOTAL_ROWS = total → every project appears as center exactly once
     */
    const TOTAL_ROWS = total;
    const splitPoint = Math.ceil(total / 2);

    const rowsData = Array.from({ length: TOTAL_ROWS }, (_, rowIndex) => {
        const parityStep = Math.floor(rowIndex / 2);

        const centerIndex =
            rowIndex % 2 === 0
                ? (splitPoint + parityStep) % total  // Odd rows:  second half
                : (0 + parityStep) % total;          // Even rows: first half

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
                    ref={(el) => {
                        if (el) rowsRef.current[rowIndex] = el;
                    }}
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
                                    fetchPriority="high"
                                    sizes="(max-width: 768px) 80vw, 50vw"
                                    priority
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

export default ProjectGridScaleAnimation;