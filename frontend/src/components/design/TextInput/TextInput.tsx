import React, { forwardRef } from "react";
import clsx from "clsx";
import styles from "./TextInput.module.css";

export const TextInput = forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(function TextInput({ className, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={clsx(
        className,
        styles.input,
        "appearance-none focus:outline-none rounded-md px-4 py-2 border-2 border-transparent",
        "hover:border-gray-400 dark:hover:border-gray-600",
        "focus:bg-white dark:focus:bg-black"
      )}
      {...rest}
    />
  );
});
