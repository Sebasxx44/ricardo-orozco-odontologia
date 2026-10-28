export type MotionCleanup = () => void;
export interface ScrollMotion {
  update: () => void;
  cleanup: MotionCleanup;
}
export interface FloatingArt {
  animations: Animation[];
  cleanup: MotionCleanup;
}
