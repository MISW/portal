import { useState, useCallback, useEffect } from "react";

export const useSystemColorScheme = () => {
  const [colorScheme, setColorScheme] = useState<"dark" | "light">("light");

  const callback = useCallback(
    (param: { matches: boolean }) => {
      if (param.matches) {
        setColorScheme("dark");
      } else {
        setColorScheme("light");
      }
    },
    [setColorScheme]
  );

  useEffect(() => {
    const matches =
      window?.
        matchMedia("(prefers-color-scheme: dark)")?.
        matches ?? undefined;

    if (matches === undefined) {
      return;
    }

    callback({ matches });

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addListener(callback);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeListener(callback);
    };
  }, [callback]);

  return colorScheme;
};
