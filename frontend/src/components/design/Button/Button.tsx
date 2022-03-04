import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { tw } from 'tailwind-variant.macro';
import { colors } from './colors';

type Color = keyof typeof colors;

const buttonStyle = (color: Color) =>
  clsx(
    'rounded px-4 py-2 text-white',
    colors[color],
    tw.disabled('cursor-not-allowed', 'opacity-50', 'text-gray-900', 'dark:text-white', 'bg-gray-300', 'dark:bg-gray-700'),
  );

type ButtonProps<Props> = Props & {
  readonly color: keyof typeof colors;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps<JSX.IntrinsicElements['button']>>(function Button(
  { children, color, className, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={clsx(buttonStyle(color), className)} {...rest}>
      {children}
    </button>
  );
});

export const LinkButton = forwardRef<HTMLAnchorElement, ButtonProps<JSX.IntrinsicElements['a']>>(function LinkButton(
  { children, color, className, ...rest },
  ref,
) {
  return (
    <a ref={ref} className={clsx(buttonStyle(color), 'block text-center', className)} {...rest}>
      {children}
    </a>
  );
});
