import Navbar from "@/component/shared/Navbar";
import DaynamicCursor from "@/component/ui/animation/DaynamicCursor";
import SmoothScroller from "@/component/ui/animation/SmoothScroller";
import React from "react";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <DaynamicCursor />

            <div className="fixed top-0 w-full z-100!">
                <Navbar />
            </div>
            <SmoothScroller smooth={1.5} effects={true}>
                <div>
                    {children}
                </div>
            </SmoothScroller>
        </div>
    );
};

export default MainLayout;
