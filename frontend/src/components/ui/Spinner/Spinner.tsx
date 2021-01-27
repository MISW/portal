import React from "react";
import clsx from "clsx";
import styles from "./Spinner.module.css";
import type { Colors } from "themes/colors";
import { useThemeColor } from "themes/useThemeColor";

type SpinnerProps = {
  spin?: boolean;
  tintColor?: Colors;
};
export const Spinner: React.VFC<SpinnerProps> = ({
  spin = true,
  tintColor = "blue-500",
}) => {
  const vars = useThemeColor(["--tint-color", tintColor]);
  return (
    <div
      className={clsx(
        styles.spinner,
        "rounded-full border-8",
        spin && "animate-spin",
        "w-24 h-24"
      )}
      style={vars}
    />
  );
};
