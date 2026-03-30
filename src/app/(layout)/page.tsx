import Practice from "@/component/Home/GSAPPractice";
import ParallaxMarquee from "@/component/ui/animation/components/AnimatedMarque";
import Container from "@/component/ui/Container";
import { AllImages } from "../../../public/assets/AllImages";
import HorizontalScroll from "@/component/ui/animation/components/Horizontalscroll";
import Banner from "@/component/Home/Banner";
import ProjectExpandingGallery from "@/component/ui/animation/components/ProjectExpandingGallery";
import ProjectGridScaleAnimation from "@/component/ui/animation/components/ProjectGridScaleAnimation";

const images = [
  AllImages?.image1.src,
  AllImages?.image2.src,
  AllImages?.image3.src,
  AllImages?.image4.src,
  AllImages?.image5.src,
  AllImages?.image6.src,
  AllImages?.image7.src,
];

const textRow1 = [
  { text: "GSAP", mod: "" as const },
  { text: "✦", mod: "sep" as const },
  { text: "CREATIVE", mod: "--accent" as const },
  { text: "✦", mod: "sep" as const },
  { text: "FRONTEND", mod: "--outline" as const },
  { text: "✦", mod: "sep" as const },
  { text: "SCROLL", mod: "" as const },
  { text: "✦", mod: "sep" as const },
  { text: "VELOCITY", mod: "--accent" as const },
  { text: "✦", mod: "sep" as const },
  { text: "ANIMATION", mod: "--outline" as const },
  { text: "✦", mod: "sep" as const },
];

const textRow2 = [
  { text: "MOTION", mod: "" as const },
  { text: "✦", mod: "sep" as const },
  { text: "WEB", mod: "--outline" as const },
  { text: "✦", mod: "sep" as const },
  { text: "STUDIO", mod: "--accent" as const },
  { text: "✦", mod: "sep" as const },
  { text: "TICKER", mod: "" as const },
  { text: "✦", mod: "sep" as const },
  { text: "MARQUEE", mod: "--accent" as const },
  { text: "✦", mod: "sep" as const },
  { text: "INFINITE", mod: "--outline" as const },
  { text: "✦", mod: "sep" as const },
];

const textRow3 = [
  { text: "TRIGGER", mod: "" as const },
  { text: "✦", mod: "sep" as const },
  { text: "STAGGER", mod: "" as const },
  { text: "✦", mod: "sep" as const },
  { text: "TIMELINE", mod: "--accent" as const },
  { text: "✦", mod: "sep" as const },
  { text: "LOOP", mod: "--outline" as const },
  { text: "✦", mod: "sep" as const },
  { text: "EASING", mod: "" as const },
  { text: "✦", mod: "sep" as const },
  { text: "TWEEN", mod: "--accent" as const },
  { text: "✦", mod: "sep" as const },
];

const page = () => {
  return (
    <div>

      <Banner />



      <section className="my-10">

        <div className="space-y-10">
          <ParallaxMarquee items={images} direction={1} baseVelocity={2} scrollBoost />

          <section>
            <div className="space-y-2">
              <ParallaxMarquee items={textRow1} direction={1} baseVelocity={1.5} itemWidth={210} gap={0} textSize="text-4xl" scrollBoost />
              <ParallaxMarquee items={textRow2} direction={-1} baseVelocity={1.5} itemWidth={210} gap={0} textSize="text-4xl" scrollBoost />
              <ParallaxMarquee items={textRow3} direction={1} baseVelocity={1.5} itemWidth={210} gap={0} textSize="text-4xl" scrollBoost />
            </div>
          </section>
          <ParallaxMarquee items={images} direction={-1} baseVelocity={1.5} scrollBoost />
        </div>
      </section>
      <ProjectGridScaleAnimation />
      <ProjectExpandingGallery />


      <HorizontalScroll />
      <Practice />

      {/* </Container> */}
    </div>
  );
};

export default page;
