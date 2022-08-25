import { forwardRef } from 'react';
import clsx from 'clsx';

export const TextInput = forwardRef<HTMLInputElement, JSX.IntrinsicElements['input']>(function TextInput({ className, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={clsx(
        className,
        'appearance-none focus:outline-none rounded-md px-4 py-2 border-2 border-transparent hover:border-gray-400 hover:dark:border-gray-600 focus:bg-white focus:dark:bg-black focus:border-blue-500',
      )}
      {...rest}
    />
  );
});
