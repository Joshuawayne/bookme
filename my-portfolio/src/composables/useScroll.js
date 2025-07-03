import { onMounted, onUnmounted, nextTick } from 'vue';
import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScroll(containerRef) {
  let locomotiveScroll;

  const updateScroll = () => {
    if (locomotiveScroll) {
      locomotiveScroll.update();
    }
  };

  onMounted(() => {
    nextTick(() => {
      // ** START OF THE TRY...CATCH BLOCK **
      try {
        if (!containerRef.value) {
          // This is a specific error we can throw if the container doesn't exist.
          throw new Error("useScroll Error: The container ref is not available in the DOM.");
        }

        console.log("useScroll: Initializing Locomotive Scroll on", containerRef.value);

        locomotiveScroll = new LocomotiveScroll({
          el: containerRef.value,
          smooth: true,
          lerp: 0.08,
        });

        console.log("useScroll: Locomotive Scroll initialized.");

        locomotiveScroll.on('scroll', ScrollTrigger.update);
        console.log("useScroll: GSAP ScrollTrigger.update listener attached.");

        ScrollTrigger.scrollerProxy(containerRef.value, {
          scrollTop(value) {
            return arguments.length 
              ? locomotiveScroll.scrollTo(value, { duration: 0, disableLerp: true }) 
              : locomotiveScroll.scroll.instance.scroll.y;
          },
          getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
          },
          pinType: containerRef.value.style.transform ? 'transform' : 'fixed',
        });
        console.log("useScroll: ScrollTrigger.scrollerProxy configured.");

        window.addEventListener('curtain-revealed', updateScroll);
        ScrollTrigger.addEventListener('refresh', updateScroll);
        
        ScrollTrigger.refresh();
        console.log("useScroll: ScrollTrigger refreshed.");

        setTimeout(() => {
          console.log("useScroll: Firing delayed update call.");
          updateScroll();
        }, 500);

        console.log("useScroll: Setup completed successfully.");

      } catch (error) {
        // ** THE CATCH BLOCK **
        // If any part of the 'try' block fails, the code will jump here.
        console.error("useScroll: A critical error occurred during initialization.", error);
      }
      // ** END OF THE TRY...CATCH BLOCK **
    });
  });

  onUnmounted(() => {
    if (locomotiveScroll) {
      locomotiveScroll.destroy();
    }
    window.removeEventListener('curtain-revealed', updateScroll);
  });

  return { locomotiveScroll };
}