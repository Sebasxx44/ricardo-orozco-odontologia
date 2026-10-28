import type { MotionCleanup } from "@/composables/motion/types";
export const initReveals = (reduced: boolean): MotionCleanup => {
  const elements = [...document.querySelectorAll<HTMLElement>(".reveal")];
  if (reduced || typeof IntersectionObserver === "undefined") {
    elements.forEach((element) => element.classList.add("is-visible"));
    document.body.classList.add("motion-ready");
    return () => document.body.classList.remove("motion-ready");
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
  );
  elements.forEach((element) => observer.observe(element));
  document.body.classList.add("motion-ready");
  return () => {
    observer.disconnect();
    document.body.classList.remove("motion-ready");
  };
};
