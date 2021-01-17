import React, { forwardRef } from "react";
import clsx from "clsx";
import styles from "./Select.module.css";

export const Select = forwardRef(function Select(
  { className, ...rest }: JSX.IntrinsicElements["select"],
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  return (
    <select ref={ref} className={clsx(styles.select, className)} {...rest} />
  );
});
