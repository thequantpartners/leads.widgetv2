import { useQuery } from '@tanstack/react-query'
import { Eye, MessageSquare, CreditCard, TrendingUp } from 'lucide-react'
import { api } from '@/lib/api'
import { formatMoney, formatPct } from '@/lib/utils'
import type { DashboardMetrics } from '@/lib/types'
import { Card } from '@/components/ui/Card'
import { PageHeader } from './PageHeader'

const EMPTY: DashboardMetrics = {
  viewed: 0,
  engaged: 0,
  paid: 0,
  revenue: 0,
  conversionRate: 0,
}

export function MetricsTab() {
  const { data = EMPTY } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => api.get<DashboardMetrics>('/api/dashboard'),
    placeholderData: EMPTY,
  })

  const stats = [
    { label: 'Visitantes', value: data.viewed, icon: Eye, tone: 'text-ink' },
    { label: 'Interactuaron', value: data.engaged, icon: MessageSquare, tone: 'text-violet' },
    { label: 'Pagaron', value: data.paid, icon: CreditCard, tone: 'text-signal' },
    { label: 'Ingresos', value: formatMoney(data.revenue), icon: TrendingUp, tone: 'text-positive' },
  ]

  const max = Math.max(data.viewed, 1)
  const funnel = [
    { label: 'Vieron', count: data.viewed, tone: 'bg-elevated' },
    { label: 'Interactuaron', count: data.engaged, tone: 'bg-violet/60' },
    { label: 'Pagaron', count: data.paid, tone: 'bg-signal' },
  ]

  return (
    <div>
      <PageHeader
        title="Métricas"
        subtitle="El recorrido completo: de visitante a cliente que paga."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-soft">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.tone}`} />
            </div>
            <div className="mt-3 font-mono text-3xl font-semibold tracking-tight text-ink">
              {s.value}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-1 font-semibold text-ink">Embudo de conversión</h3>
          <p className="mb-6 text-sm text-ink-soft">
            Tasa de cierre:{' '}
            <span className="font-mono text-signal">{formatPct(data.conversionRate)}</span>
          </p>
          <div className="space-y-4">
            {funnel.map((f) => (
              <div key={f.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{f.label}</span>
                  <span className="font-mono text-ink">{f.count}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-base">
                  <div
                    className={`h-full rounded-full ${f.tone} transition-all duration-700`}
                    style={{ width: `${Math.max((f.count / max) * 100, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-center p-6">
          <h3 className="mb-4 font-semibold text-ink">Audiencias Google Ads</h3>
          <div className="space-y-3 text-sm">
            <AudienceRow label="Clientes (lookalike)" count={data.paid} tone="text-signal" />
            <AudienceRow label="Remarketing tibio" count={data.engaged - data.paid} tone="text-warning" />
            <AudienceRow label="Audiencia fría" count={data.viewed - data.engaged} tone="text-ink-soft" />
          </div>
        </Card>
      </div>
    </div>
  )
}

function AudienceRow({ label, count, tone }: { label: string; count: number; tone: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-base px-3 py-2.5">
      <span className="text-ink-soft">{label}</span>
      <span className={`font-mono font-medium ${tone}`}>{Math.max(count, 0)}</span>
    </div>
  )
}
