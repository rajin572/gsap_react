import TiltCard from "@/component/ui/animation/components/TiltCard";
import Container from "@/component/ui/Container";
import { projectsData } from "@/data/projectsData";

const ProjectsPage = () => {
    return (
        <Container>
            <div className="min-h-screen w-full px-6 py-32">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="font-mono text-4xl font-bold text-white mb-3">
                        Projects
                    </h1>
                    <p className="text-white/50 font-mono text-sm">
                        {projectsData.length} project{projectsData.length !== 1 ? "s" : ""} — GSAP animations & interactions
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectsData.map((project) => (
                        <TiltCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default ProjectsPage;
