import Navbar from "@/component/shared/Navbar";
import CustomCursor from "@/component/ui/animation/CustomCursor";
import SmoothScroller from "@/component/ui/animation/SmoothScroller";
import React from "react";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <CustomCursor />

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
