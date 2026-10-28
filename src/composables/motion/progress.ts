export const clampProgress = (value: number): number =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
export const pageProgress = (
  scrollY: number,
  viewportHeight: number,
  documentHeight: number,
): number => {
  const distance = documentHeight - viewportHeight;
  return distance <= 0 ? 1 : clampProgress(scrollY / distance);
};
export const nodeProgress = (
  top: number,
  height: number,
  viewportHeight: number,
): number => {
  if (viewportHeight <= 0) return 0;
  return clampProgress(
    (viewportHeight * 0.78 - top) /
      (Math.max(1, height) + viewportHeight * 0.32),
  );
};
export const heroShift = (sectionTop: number): number =>
  Number.isFinite(sectionTop)
    ? Math.max(-24, Math.min(24, -sectionTop * 0.06)) || 0
    : 0;
