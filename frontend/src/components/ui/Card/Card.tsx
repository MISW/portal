import React from "react";
import clsx from "clsx";

export type CardProps<As extends keyof JSX.IntrinsicElements> = {
  as?: As;
  interactive?: boolean;
} & JSX.IntrinsicElements[As];

/**
 * ある一定の意味のまとまりを示す
 * aka. Surface
 */
export class Card<
  As extends keyof JSX.IntrinsicElements
> extends React.Component<CardProps<As>> {
  render(): React.ReactElement {
    const {
      as = "div",
      interactive,
      className,
      children,
      ...rest
    } = this.props;

    return React.createElement(
      as,
      {
        className: clsx(
          "bg-white border-gray-200 divide-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:divide-gray-800",
          interactive &&
            "active:bg-gray-200 dark:active:bg-gray-700 hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800",
          className
        ),
        ...rest,
      },
      children
    );
  }
}
