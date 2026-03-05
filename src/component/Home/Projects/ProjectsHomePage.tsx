"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectGridScaleAnimation from "./ProjectGridScaleAnimation";

gsap.registerPlugin(ScrollTrigger);

const ProjectsHomePage = () => {

    return (
        <>
            <div className="h-screen relative w-full flex items-center justify-center overflow-hidden">
                Intro
            </div>

            <ProjectGridScaleAnimation />

            <div className="h-screen relative w-full flex items-center justify-center overflow-hidden">
                Outro
            </div>
        </>
    );
};

export default ProjectsHomePage;