import { MessageSquare, X } from 'lucide-react'

export function WidgetMock() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
      {/* fake browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-surface-2 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-positive/60" />
        <div className="ml-3 h-5 flex-1 rounded bg-base/60" />
      </div>

      {/* fake page content with a "pricing" section highlighted */}
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded bg-elevated" />
        <div className="h-2 w-2/3 rounded bg-elevated/60" />
        <div className="relative mt-5 rounded-xl border border-signal/40 bg-signal-dim p-4">
          <span className="absolute -top-2 left-3 rounded bg-signal px-1.5 py-0.5 font-mono text-[10px] font-semibold text-signal-ink">
            PRICING · 18s
          </span>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2 rounded-lg bg-base/50 p-2">
                <div className="h-2 w-full rounded bg-elevated" />
                <div className="h-4 w-2/3 rounded bg-elevated" />
                <div className="h-1.5 w-full rounded bg-elevated/50" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* proactive bubble */}
      <div className="animate-bubble-in absolute bottom-20 right-4 max-w-[220px] rounded-2xl rounded-br-sm border border-signal/30 bg-elevated p-3.5 shadow-glow">
        <button className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border border-border bg-surface text-ink-faint">
          <X className="h-3 w-3" />
        </button>
        <p className="text-sm leading-snug text-ink">
          ¿Comparando planes? Te digo en 10s cuál te conviene 👀
        </p>
      </div>

      {/* widget launcher */}
      <div className="animate-pulse-ring absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-signal text-signal-ink">
        <MessageSquare className="h-5 w-5" />
      </div>
    </div>
  )
}
