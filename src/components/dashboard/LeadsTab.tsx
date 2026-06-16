import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Lead, LeadStage } from '@/lib/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from './PageHeader'

const stageMeta: Record<LeadStage, { label: string; tone: 'neutral' | 'violet' | 'signal' }> = {
  viewed: { label: 'Vio', tone: 'neutral' },
  engaged: { label: 'Habló', tone: 'violet' },
  paid: { label: 'Pagó', tone: 'signal' },
}

export function LeadsTab() {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get<Lead[]>('/api/leads'),
  })

  return (
    <div>
      <PageHeader title="Leads" subtitle="Cada persona que tu widget tocó, y dónde quedó." />

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-ink-faint">
              <th className="px-5 py-3 font-medium">Contacto</th>
              <th className="px-5 py-3 font-medium">Sección</th>
              <th className="px-5 py-3 font-medium">Último mensaje</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 text-right font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-border/50 last:border-0 hover:bg-surface-2/40">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-ink">{lead.name || 'Anónimo'}</div>
                  {lead.email && <div className="text-xs text-ink-faint">{lead.email}</div>}
                </td>
                <td className="px-5 py-3.5 text-ink-soft">{lead.section || '—'}</td>
                <td className="max-w-xs truncate px-5 py-3.5 text-ink-soft">
                  {lead.lastMessage || '—'}
                </td>
                <td className="px-5 py-3.5">
                  <Badge tone={stageMeta[lead.stage].tone}>{stageMeta[lead.stage].label}</Badge>
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-ink">
                  {lead.value ? `$${(lead.value / 100).toFixed(0)}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && leads.length === 0 && (
          <div className="py-16 text-center text-sm text-ink-faint">
            Aún no hay leads. Instala el widget y empieza a capturar.
          </div>
        )}
      </Card>
    </div>
  )
}
