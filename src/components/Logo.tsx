import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-signal">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M4 14c2 0 3-6 5-6s2 8 4 8 2-10 4-10 2 6 3 6"
            stroke="#0a0d02"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-lg font-bold tracking-tight text-ink">Signal</span>
    </div>
  )
}
