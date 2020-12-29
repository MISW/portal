import React, { forwardRef } from "react";
import clsx from "clsx";

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
    <nav
      className={clsx(
        "absolute rounded-sm shadow bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-500",
        top,
        left,
        right,
        width
      )}
    >
      {children}
    </nav>
  ) : null;
};

type DropdownItemProps<As extends keyof JSX.IntrinsicElements> = Readonly<
  {
    as: As;
    children?: React.ReactNode;
  } & Omit<JSX.IntrinsicElements[As], "className">
>;
export class DropdownItem<
  As extends keyof JSX.IntrinsicElements
> extends React.Component<DropdownItemProps<As>> {
  render(): React.ReactElement {
    const { as, children, ...rest } = this.props;
    return React.createElement(
      as,
      {
        className: `
          block w-full text-left
          hover:bg-gray-100 dark:hover:bg-gray-600
          focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600
        `,
        ...rest,
      },
      children
    );
  }
}
