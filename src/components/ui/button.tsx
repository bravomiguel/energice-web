import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import LoadingSpinner from '../loading-spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-indigo-800 text-zinc-50 shadow hover:bg-indigo-800/90',
        destructive: 'bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90',
        outline:
          'border text-zinc-600 border-zinc-300 bg-transparent shadow-sm hover:bg-zinc-100 hover:text-zinc-900',
        secondary: 'bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-100/80',
        koldupGreen:
          'bg-green-koldup text-zinc-50 shadow hover:bg-green-koldup/90',
        koldupBlue:
          'bg-blue-koldup text-zinc-50 shadow hover:bg-blue-koldup/90',
        ghost: 'hover:bg-zinc-100 hover:text-zinc-900',
        link: 'text-zinc-900 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'h-9 px-4 py-2',
        default: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingBgColor?: string;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingBgColor = 'fill-indigo-900',
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner
            className="absolute translate-x-[calc(50%_-_12px)] translate-y-[calc(50%_-_12px)]"
            size={20}
            color="text-zinc-200"
            secondaryColor={loadingBgColor}
          />
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
