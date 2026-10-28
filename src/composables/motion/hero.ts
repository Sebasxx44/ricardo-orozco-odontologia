import { heroShift } from "@/composables/motion/progress";
import type { ScrollMotion } from "@/composables/motion/types";
export const initHeroMotion = (reduced: boolean): ScrollMotion => {
  const art = document.querySelector<HTMLElement | SVGElement>("[data-hero-art]");
  if (!art) return { update: () => {}, cleanup: () => {} };
  const anchor = art.closest("section") ?? art;
  const objects = [
    ...art.querySelectorAll<HTMLElement | SVGElement>(
      "[data-hero-float],[data-float-object]",
    ),
  ];
  const animations: Animation[] = [];
  if (!reduced) {
    objects.forEach((object, index) => {
      if (typeof object.animate !== "function") return;
      const offset = index % 2 === 0 ? -8 : 7;
      animations.push(
        object.animate(
          [
            { translate: "0px 0px" },
            { translate: `0px ${offset}px` },
            { translate: "0px 0px" },
          ],
          {
            duration: 6200 + index * 850,
            iterations: Infinity,
            easing: "ease-in-out",
            delay: -index * 1100,
          },
        ),
      );
    });
  }
  let visible = true;
  const sync = () => {
    animations.forEach((animation) => {
      if (document.hidden || !visible) animation.pause();
      else animation.play();
    });
  };
  const observer =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          sync();
        });
  observer?.observe(art);
  document.addEventListener("visibilitychange", sync);
  sync();
  const update = () => {
    art.style.setProperty(
      "--hero-shift",
      `${reduced ? 0 : heroShift(anchor.getBoundingClientRect().top)}px`,
    );
  };
  update();
  return {
    update,
    cleanup: () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      animations.forEach((animation) => animation.cancel());
      art.style.setProperty("--hero-shift", "0px");
    },
  };
};
