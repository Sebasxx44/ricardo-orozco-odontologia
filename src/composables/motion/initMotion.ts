import { initJourneyRail } from "@/composables/motion/rail";
import { initReveals } from "@/composables/motion/reveal";
import { initHeroMotion } from "@/composables/motion/hero";
import { initScrollFrame } from "@/composables/motion/scrollFrame";
import type { MotionCleanup } from "@/composables/motion/types";
export const initMotion = (): MotionCleanup => {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cleanup: MotionCleanup = () => {};
  const start = () => {
    cleanup();
    const rail = initJourneyRail(preference.matches);
    const hero = initHeroMotion(preference.matches);
    const stopReveal = initReveals(preference.matches);
    const stopScroll = preference.matches
      ? () => {}
      : initScrollFrame(() => {
          rail.update();
          hero.update();
        });
    cleanup = () => {
      stopScroll();
      stopReveal();
      rail.cleanup();
      hero.cleanup();
    };
  };
  start();
  preference.addEventListener("change", start);
  return () => {
    preference.removeEventListener("change", start);
    cleanup();
  };
};
