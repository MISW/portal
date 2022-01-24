import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { tw } from 'tailwind-variant.macro';

export const TextInput = forwardRef<
    HTMLInputElement,
    JSX.IntrinsicElements['input']
>(function TextInput({ className, ...rest }, ref) {
    return (
        <input
            ref={ref}
            className={clsx(
                className,
                'appearance-none focus:outline-none rounded-md px-4 py-2 border-2 border-transparent',
                tw.hover('border-gray-400 dark:border-gray-600'),
                tw.focus('bg-white dark:bg-black !border-blue-500'),
            )}
            {...rest}
        />
    );
});
