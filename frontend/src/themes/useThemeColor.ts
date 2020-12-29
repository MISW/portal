import { useMemo } from "react";
import colors, { Colors } from "themes/colors";

/**
 * Tailwindの色をCSS変数に結びつける
 */
export function useThemeColor(
  ...vars: readonly [variable: `--${string}`, color: Colors][]
): React.CSSProperties {
  /* eslint-disable react-hooks/exhaustive-deps */
  const deps = vars.flat();
  const style = useMemo((): React.CSSProperties => {
    const style: React.CSSProperties = {};
    for (const [variable, color] of vars) {
      (style as any)[variable] = colors[color];
    }
    return style;
  }, deps);
  return style;
}
