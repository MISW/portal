import { useRef, useState, useCallback, useEffect } from "react";

export const useDropdown = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const toggle = useCallback(() => {
    setShow((s) => !s);
  }, []);
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const target = ev.target;
      if (
        target instanceof Node &&
        rootRef.current != null &&
        !rootRef.current.contains(target)
      ) {
        setShow(false);
      }
    };
    const onKeyup = (ev: KeyboardEvent) => {
      if (ev.key === "Esc" || ev.key === "Escape") {
        setShow(false);
      }
    };
    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("keyup", onKeyup, { passive: true });
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keyup", onKeyup);
    };
  }, []);
  return {
    rootRef,
    show,
    toggle,
  } as const;
};
