import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ShieldCheck, ArrowUp, ArrowDown, Ban, CircleCheck } from 'lucide-react'
import { AppShell } from '@/components/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { api } from '@/lib/api'
import type { Plan, Profile } from '@/lib/types'

const planOrder: Plan[] = ['free', 'pro', 'plus']

export function SuperAdmin() {
  const qc = useQueryClient()
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<Profile[]>('/api/admin/users'),
  })

  const mutate = useMutation({
    mutationFn: ({ uid, patch }: { uid: string; patch: Partial<Profile> }) =>
      api.patch(`/api/admin/users/${uid}`, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const changePlan = (u: Profile, dir: 1 | -1) => {
    const idx = planOrder.indexOf(u.plan)
    const next = planOrder[Math.min(planOrder.length - 1, Math.max(0, idx + dir))]
    if (next !== u.plan) mutate.mutate({ uid: u.uid, patch: { plan: next } })
  }

  const toggleBlock = (u: Profile) =>
    mutate.mutate({ uid: u.uid, patch: { status: u.status === 'blocked' ? 'active' : 'blocked' } })

  return (
    <AppShell>
      <PageHeader
        title="Superadmin"
        subtitle="Gestiona planes y accesos de todos los usuarios."
        action={
          <Badge tone="violet">
            <ShieldCheck className="h-3.5 w-3.5" />
            Acceso protegido
          </Badge>
        }
      />

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-ink-faint">
              <th className="px-5 py-3 font-medium">Usuario</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isAdmin = u.role === 'superadmin'
              return (
                <tr key={u.uid} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 font-medium text-ink">
                      {u.name}
                      {isAdmin && <Badge tone="violet">Superadmin</Badge>}
                    </div>
                    <div className="text-xs text-ink-faint">{u.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={u.plan === 'free' ? 'neutral' : 'signal'}>{u.plan.toUpperCase()}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={u.status === 'blocked' ? 'danger' : 'positive'}>
                      {u.status === 'blocked' ? 'Bloqueado' : 'Activo'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isAdmin || u.plan === 'plus'}
                        onClick={() => changePlan(u, 1)}
                        title="Subir plan"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isAdmin || u.plan === 'free'}
                        onClick={() => changePlan(u, -1)}
                        title="Bajar plan"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isAdmin}
                        onClick={() => toggleBlock(u)}
                        title={u.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                        className={u.status === 'blocked' ? 'text-positive' : 'text-danger'}
                      >
                        {u.status === 'blocked' ? <CircleCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="py-16 text-center text-sm text-ink-faint">Sin usuarios todavía.</div>
        )}
      </Card>
    </AppShell>
  )
}
