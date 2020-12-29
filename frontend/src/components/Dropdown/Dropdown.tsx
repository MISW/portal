import React, { forwardRef } from "react";
import clsx from "clsx";
import styles from "./Dropdown.module.css";

export const DropdownRoot = forwardRef<
  HTMLDivElement,
  { children?: React.ReactNode }
>(function DropdownRoot({ children }, ref) {
  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
});

type DropdownProps = Readonly<{
  show?: boolean;
  top?: `top-${number}`;
  left?: `left-${number}`;
  right?: `right-${number}`;
  width?: `w-${number}`;
}>;
export const Dropdown: React.FC<DropdownProps> = ({
  show = true,
  top,
  left,
  right,
  width,
  children,
}) => {
  return show ? (
    <nav className={clsx(styles.dropdown, top, left, right, width)}>
      {children}
    </nav>
  ) : null;
};
