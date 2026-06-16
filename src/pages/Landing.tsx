import { Link } from 'react-router-dom'
import { ArrowRight, Eye, MessageSquare, CreditCard, Target } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { WidgetMock } from '@/components/WidgetMock'

export function Landing() {
  return (
    <div className="min-h-screen bg-base text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-base/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-ink-soft md:flex">
            <a href="#how" className="transition-colors hover:text-ink">Cómo funciona</a>
            <a href="#loop" className="transition-colors hover:text-ink">Google Ads Loop</a>
            <a href="#pricing" className="transition-colors hover:text-ink">Precios</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Empezar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-grid relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <Badge tone="signal" className="mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              Behavior AI Agent
            </Badge>
            <h1 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              El widget que <span className="text-signal">vende</span> mientras tu visitante navega.
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-soft">
              No espera a que pregunten. Detecta qué sección miran, cuánto tiempo, y lanza el
              mensaje exacto para cerrar — con el cobro adentro del chat.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/login">
                <Button size="lg">
                  Crear mi widget <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how">
                <Button variant="outline" size="lg">Ver cómo funciona</Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-ink-faint">
              Instálalo con una línea de código. Sin tarjeta para empezar.
            </p>
          </div>

          <div className="relative">
            <WidgetMock />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="max-w-lg text-3xl font-bold tracking-tight">
            Proactivo, no reactivo. Esa es toda la diferencia.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Eye, title: 'Lee el comportamiento', body: 'Detecta qué sección ve el visitante y cuánto tiempo lleva ahí.' },
              { icon: MessageSquare, title: 'Lanza el mensaje', body: 'La IA dispara una burbuja consultiva contextual al momento justo.' },
              { icon: CreditCard, title: 'Cobra en el chat', body: 'Califica, y si hay interés, muestra el link de pago de Stripe ahí mismo.' },
              { icon: Target, title: 'Enriquece tus Ads', body: 'Envía conversiones y audiencias a Google Ads para traer leads que sí compran.' },
            ].map((s, i) => (
              <div key={i} className="group relative rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-signal-dim text-signal">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mb-1 font-mono text-xs text-ink-faint">0{i + 1}</div>
                <h3 className="mb-2 font-semibold">{s.title}</h3>
                <p className="text-sm text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Ads Loop */}
      <section id="loop" className="border-t border-border/60 bg-surface/40 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge tone="violet" className="mb-5">Feedback loop</Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Cada visitante alimenta tu Google Ads.
            </h2>
            <p className="mt-5 text-ink-soft">
              Signal clasifica a cada persona y devuelve esa señal a tu campaña. Google aprende a
              quién traer — y deja de quemar presupuesto en quien nunca iba a comprar.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                ['Pagó', 'Conversión + audiencia de clientes (lookalike).', 'positive'],
                ['Interactuó, no pagó', 'Audiencia de remarketing tibio.', 'warning'],
                ['Solo vio', 'Señal fría — se excluye o se reorienta.', 'neutral'],
              ].map(([label, body, tone]) => (
                <li key={label} className="flex items-start gap-3 rounded-xl border border-border bg-base p-4">
                  <Badge tone={tone as 'positive'}>{label}</Badge>
                  <span className="text-sm text-ink-soft">{body}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-base p-8">
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-ink-soft">
{`visitor.behavior  ──▶  Signal AI
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
    [ paid ]       [ engaged ]      [ viewed ]
        │               │               │
        ▼               ▼               ▼
   conversion +    remarketing      cold /
   lookalike        audience        exclude
        └───────────────┴───────────────┘
                        ▼
                  Google Ads`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Tu web ya tiene tráfico. <span className="text-signal">Hazlo cerrar solo.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-ink-soft">
            Configura tu widget en 3 minutos y pégalo en cualquier página con una línea.
          </p>
          <Link to="/login" className="mt-8 inline-block">
            <Button size="lg">
              Empezar gratis <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 text-sm text-ink-faint">
          <Logo />
          <span>© {new Date().getFullYear()} The Quant Partners</span>
        </div>
      </footer>
    </div>
  )
}
