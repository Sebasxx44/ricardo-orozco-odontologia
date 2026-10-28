import type { MotionCleanup } from "@/composables/motion/types";
export const initScrollFrame = (update: () => void): MotionCleanup => {
  let frame = 0;
  let previous = 0;
  let stopped = false;
  const tick = (timestamp: number) => {
    frame = 0;
    if (stopped || document.hidden) return;
    if (timestamp - previous < 1000 / 30) {
      frame = requestAnimationFrame(tick);
      return;
    }
    previous = timestamp;
    update();
  };
  const schedule = () => {
    if (!stopped && !frame && !document.hidden)
      frame = requestAnimationFrame(tick);
  };
  const visibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else schedule();
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("load", schedule, { once: true });
  schedule();
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("load", schedule);
    document.removeEventListener("visibilitychange", visibility);
  };
};
