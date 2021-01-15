import React from "react";
import clsx from "clsx";
import styles from "./Card.module.css";

type CardProps<As extends keyof JSX.IntrinsicElements> = {
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
  render() {
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
          styles.card,
          interactive && styles.interactive,
          className
        ),
        ...rest,
      },
      children
    );
  }
}
