import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/cn';

const buttonVariants = cva(
  [
    'group/button',
    'text-sm whitespace-nowrap',
    'border border-transparent outline-none',
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-md',
    'transition-all select-none',
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:not-aria-[haspopup]:translate-y-px',
    '[&_svg]:shrink-0 [&>svg]:pointer-events-none [&>svg]:size-4',
    'dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: [
          'bg-destructive text-white',
          'dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        ],
        outline: [
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
          'dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        ],
        ghost: [
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
          'dark:hover:bg-muted/50',
        ],
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        'default': [
          'h-8 px-2.5 gap-1.5',
          'has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        ],
        'xs': [
          'h-6 px-2 gap-1 text-xs rounded-[min(var(--radius-md),10px)] [&_svg:not([class*="size-"])]:size-3',
          'in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
        ],
        'sm': [
          'h-7 px-2.5 gap-1 text-[0.8rem] rounded-[min(var(--radius-md),12px)] [&_svg:not([class*="size-"])]:size-3.5',
          'in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
        ],
        'lg': [
          'h-9 px-2.5 gap-1.5',
          'has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        ],
        'icon': 'size-8',
        'icon-xs':
          'size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*="size-"])]:size-3',
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export function Button({
  className,
  size = 'default',
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ size, variant }), className)}
      {...props}
    />
  );
}
