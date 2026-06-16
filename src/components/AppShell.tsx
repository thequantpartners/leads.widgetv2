import { type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, Users, Settings, Code2, Shield, LogOut } from 'lucide-react'
import { Logo } from './Logo'
import { useAuth } from '@/lib/auth'
import { Badge } from './ui/Badge'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/app', label: 'Métricas', icon: LayoutGrid, end: true },
  { to: '/app?tab=leads', label: 'Leads', icon: Users },
  { to: '/app?tab=widget', label: 'Widget', icon: Settings },
  { to: '/app?tab=install', label: 'Instalar', icon: Code2 },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { profile, isSuperAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-base">
      {/* sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface/40 p-4 md:flex">
        <div className="px-2 py-3">
          <Logo />
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-elevated text-ink'
                    : 'text-ink-soft hover:bg-surface-2 hover:text-ink'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
          {isSuperAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-violet-dim text-violet'
                    : 'text-violet/80 hover:bg-violet-dim hover:text-violet'
                )
              }
            >
              <Shield className="h-4 w-4" />
              Superadmin
            </NavLink>
          )}
        </nav>

        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-3 px-2 py-2">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="" className="h-8 w-8 rounded-full" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-elevated" />
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-ink">{profile?.name}</div>
              <Badge tone={profile?.plan === 'free' ? 'neutral' : 'signal'} className="mt-0.5">
                {profile?.plan?.toUpperCase()}
              </Badge>
            </div>
          </div>
          <button
            onClick={async () => {
              await signOut()
              navigate('/')
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </aside>

      <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  )
}
