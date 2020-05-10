import { useState, useCallback, useMemo, useEffect } from "react";

export const useSystemColorScheme = () => {
  const [colorScheme, setColorScheme] = useState<"dark" | "light">("dark");

  const callback = useCallback((param: { matches: boolean }) => {
    if (param.matches) {
      setColorScheme("dark");
    } else {
      setColorScheme("light");
    }
  }, []);

  useEffect(() => {
    const matches = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    callback({ matches });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', callback);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', callback);
    }
  }, [callback]);

  return colorScheme;
}