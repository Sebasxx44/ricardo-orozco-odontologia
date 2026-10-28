export const initNavigation = (): (() => void) => {
  const toggle = document.querySelector<HTMLButtonElement>("#menu-toggle");
  const menu = document.querySelector<HTMLElement>("#mobile-nav");
  if (!toggle || !menu) return () => {};
  const desktop = window.matchMedia("(min-width: 960px)");
  const setOpen = (open: boolean, restoreFocus = false) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar navegación" : "Abrir navegación");
    menu.hidden = !open;
    if (open) menu.querySelector<HTMLAnchorElement>("a[href]")?.focus();
    else if (restoreFocus && !desktop.matches) toggle.focus();
  };
  const onToggle = () =>
    setOpen(toggle.getAttribute("aria-expanded") !== "true", true);
  const onEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && !menu.hidden) setOpen(false, true);
  };
  const onLink = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest("a[href]"))
      setOpen(false, true);
  };
  const onDesktop = () => {
    if (desktop.matches) {
      const hadMenuFocus = menu.contains(document.activeElement);
      setOpen(false);
      if (hadMenuFocus)
        document
          .querySelector<HTMLAnchorElement>(
            "header nav:not(#mobile-nav) a[href]",
          )
          ?.focus();
    }
  };
  const onOutside = (event: PointerEvent) => {
    if (
      !menu.hidden &&
      event.target instanceof Node &&
      !menu.contains(event.target) &&
      !toggle.contains(event.target)
    )
      setOpen(false, true);
  };
  setOpen(false);
  toggle.addEventListener("click", onToggle);
  document.addEventListener("keydown", onEscape);
  menu.addEventListener("click", onLink);
  desktop.addEventListener("change", onDesktop);
  document.addEventListener("pointerdown", onOutside);
  return () => {
    toggle.removeEventListener("click", onToggle);
    document.removeEventListener("keydown", onEscape);
    menu.removeEventListener("click", onLink);
    desktop.removeEventListener("change", onDesktop);
    document.removeEventListener("pointerdown", onOutside);
  };
};
