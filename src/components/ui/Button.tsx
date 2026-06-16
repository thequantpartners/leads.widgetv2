import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const button = cva(
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-signal text-signal-ink hover:bg-signal-soft shadow-[0_0_20px_-6px_rgba(201,242,74,0.5)]',
        secondary:
          'bg-elevated text-ink border border-border-strong hover:border-ink-faint hover:bg-surface-2',
        ghost: 'text-ink-soft hover:text-ink hover:bg-surface-2',
        danger: 'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
        outline:
          'border border-border-strong text-ink hover:border-signal hover:text-signal bg-transparent',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-13 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(button({ variant, size }), className)} {...props} />
  )
)
Button.displayName = 'Button'
