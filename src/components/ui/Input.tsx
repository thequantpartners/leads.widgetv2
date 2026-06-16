import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const base =
  'w-full rounded-lg border border-border bg-base/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal/40'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(base, className)} {...props} />
  )
)
Input.displayName = 'Input'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(base, 'min-h-[90px] resize-y', className)} {...props} />
))
Textarea.displayName = 'Textarea'

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('mb-1.5 block text-xs font-medium text-ink-soft', className)}>
      {children}
    </label>
  )
}
