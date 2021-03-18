import React, { forwardRef } from "react";
import clsx from "clsx";
import styles from "./Select.module.css";

export const Select = forwardRef(function Select(
  { className, ...rest }: JSX.IntrinsicElements["select"],
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  return (
    <select
      ref={ref}
      className={clsx(
        styles.select,
        styles["dark:select-dark"],
        "appearance-none focus:outline-none rounded-md pl-4 pr-12 py-2 border-2 border-transparent",
        "dark:hover:border-gray-600 hover:border-gray-400",
        "focus:bg-white dark:focus:bg-black",
        className
      )}
      {...rest}
    />
  );
});
