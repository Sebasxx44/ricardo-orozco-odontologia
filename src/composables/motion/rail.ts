import { nodeProgress, pageProgress } from "@/composables/motion/progress";
import type { ScrollMotion } from "@/composables/motion/types";
export const initJourneyRail = (reduced: boolean): ScrollMotion => {
  const root = document.documentElement;
  const rails = [
    ...document.querySelectorAll<HTMLElement | SVGElement>("[data-journey-rail]"),
  ];
  const paths = [
    ...document.querySelectorAll<SVGPathElement>("[data-journey-path]"),
  ];
  const nodes = [
    ...document.querySelectorAll<HTMLElement>("[data-journey-node]"),
  ];
  paths.forEach((path) => {
    path.setAttribute("pathLength", "1");
    path.style.strokeDasharray = "1";
    path.style.strokeDashoffset = "1";
  });
  const update = () => {
    const progress = reduced
      ? 1
      : pageProgress(window.scrollY, window.innerHeight, root.scrollHeight);
    const value = progress.toFixed(4);
    root.dataset.journeyProgress = value;
    root.style.setProperty("--journey-progress", value);
    rails.forEach((rail) => {
      rail.dataset.journeyProgress = value;
      rail.style.setProperty("--journey-progress", value);
    });
    paths.forEach((path) => {
      path.style.strokeDashoffset = (1 - progress).toFixed(4);
    });
    nodes.forEach((node) => {
      const box = node.getBoundingClientRect();
      const local = reduced
        ? 1
        : nodeProgress(box.top, box.height, window.innerHeight);
      node.dataset.journeyProgress = local.toFixed(4);
      node.style.setProperty("--journey-progress", local.toFixed(4));
    });
  };
  update();
  return { update, cleanup: () => {} };
};
