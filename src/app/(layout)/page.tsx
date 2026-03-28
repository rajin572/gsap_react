import Practice from "@/component/Home/GSAPPractice";
import ParallaxMarquee from "@/component/ui/animation/components/AnimatedMarque";
import Container from "@/component/ui/Container";
import { AllImages } from "../../../public/assets/AllImages";


const images = [
  AllImages?.image1.src,
  AllImages?.image2.src,
  AllImages?.image3.src,
  AllImages?.image4.src,
  AllImages?.image5.src,
  AllImages?.image6.src,
  AllImages?.image7.src,
];

const page = () => {
  return (
    <div>
      <div className="h-screen bg-zinc-700 w-full" data-cursor="animated_circle" />

      <Container className="py-20 space-y-16">

        {/* 1. Default — always playing, moves left */}
        <section>
          <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">Default (auto play)</p>
          <ParallaxMarquee items={images} direction={1} baseVelocity={5.5} scrollReverse={false} />
        </section>

        {/* 2. Scroll-driven — paused until scrolling; reverses on scroll-up */}
        <section>
          <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">Scroll to play</p>
          <ParallaxMarquee items={images} direction={1} baseVelocity={4} playMode="scroll" />
        </section>

        {/* 3. Hover-pause — plays normally, freezes on hover */}
        <section>
          <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">Hover to pause</p>
          <ParallaxMarquee items={images} direction={-1} baseVelocity={3} playMode="hover-pause" />
        </section>

        {/* 4. Draggable — grab and fling */}
        <section>
          <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">Draggable</p>
          <ParallaxMarquee items={images} direction={1} baseVelocity={2} draggable />
        </section>


        {/* 6. Stacked rows — opposite directions for a classic marquee look */}
        <section>
          <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">Stacked rows</p>
          <div className="space-y-4">
            <ParallaxMarquee items={images} direction={1} baseVelocity={2} />
            <ParallaxMarquee items={images} direction={-1} baseVelocity={2} />
          </div>
        </section>

        <Practice />

      </Container>
    </div>
  );
};

export default page;