import ProjectGridScaleAnimation from "@/component/ui/animation/components/ProjectGridScaleAnimation";

const page = () => {
  return (
    <div>
      <div className="h-screen relative w-full flex items-center justify-center overflow-hidden">Intro</div>
      <ProjectGridScaleAnimation />
      <div className="h-screen relative w-full flex items-center justify-center overflow-hidden">Outro</div>
    </div>
  );
};

export default page;