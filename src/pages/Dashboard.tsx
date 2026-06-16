import { useSearchParams } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { MetricsTab } from '@/components/dashboard/MetricsTab'
import { LeadsTab } from '@/components/dashboard/LeadsTab'
import { WidgetTab } from '@/components/dashboard/WidgetTab'
import { InstallTab } from '@/components/dashboard/InstallTab'

export function Dashboard() {
  const [params] = useSearchParams()
  const tab = params.get('tab') ?? 'metrics'

  return (
    <AppShell>
      {tab === 'metrics' && <MetricsTab />}
      {tab === 'leads' && <LeadsTab />}
      {tab === 'widget' && <WidgetTab />}
      {tab === 'install' && <InstallTab />}
    </AppShell>
  )
}
