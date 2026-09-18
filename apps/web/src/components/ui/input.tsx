import * as React from 'react';

import { cn } from '@/lib/cn';

export function Input({
  type,
  className,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'placeholder:text-muted-foreground text-base md:text-sm',
        'h-8 w-full min-w-0 px-2.5 py-1',
        'border-input rounded-lg border bg-transparent transition-colors outline-none',
        'file:text-foreground file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
        'disabled:bg-input/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  );
}
