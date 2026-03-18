import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectById } from "@/data/projectsData";
import ProjectDemoSection from "@/component/Projects/ProjectDemoSection";

const ProjectDetailPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;
    const project = getProjectById(Number(id));

    if (!project) notFound();

    return (
        <div className="min-h-screen w-full pt-32 pb-20">
            {/* ── Constrained header ── */}
            <div className="max-w-5xl mx-auto px-6 mb-12">
                {/* Back */}
                <Link
                    href="/project"
                    className="inline-flex items-center gap-2 font-mono text-sm text-white/50 hover:text-white transition-colors mb-10"
                >
                    ← Back to projects
                </Link>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs font-mono bg-white/10 text-white/70 px-2 py-0.5 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h1 className="font-mono text-4xl font-bold text-white mb-2">
                    {project.title}
                </h1>
                <p className="text-white/40 text-sm font-mono mb-8">{project.year}</p>

                {/* Thumbnail */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
                    <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Description */}
                <p className="text-white/70 leading-relaxed max-w-2xl">
                    {project.longDescription}
                </p>
            </div>

            {/* ── Full-width demo section ── */}
            <ProjectDemoSection project={project} />
        </div>
    );
};

export default ProjectDetailPage;
