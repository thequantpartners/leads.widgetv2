import { useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { useWidget } from '@/lib/useWidget'
import { Card, CardBody, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { PageHeader } from './PageHeader'

const BASE = import.meta.env.VITE_API_BASE || 'https://app.leadwidget.ai'

export function InstallTab() {
  const { data, isLoading } = useWidget()
  const [copied, setCopied] = useState<string | null>(null)

  if (isLoading || !data)
    return (
      <div className="grid h-64 place-items-center">
        <Spinner />
      </div>
    )

  const snippet = `<script src="${BASE}/w/${data.id}.js" async></script>`
  const bookmarklet = `javascript:(function(){var s=document.createElement('script');s.src='${BASE}/w/${data.id}.js';document.head.appendChild(s)})()`

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Instalar"
        subtitle="Una línea de código. Funciona en cualquier web."
        action={<Badge tone={data.active ? 'positive' : 'warning'}>{data.active ? 'Activo' : 'Inactivo'}</Badge>}
      />

      <Card>
        <CardBody className="space-y-4">
          <CardTitle>Pega esto antes de &lt;/body&gt;</CardTitle>
          <div className="relative">
            <pre className="overflow-x-auto rounded-xl border border-border bg-base p-4 pr-14 font-mono text-sm text-signal">
              {snippet}
            </pre>
            <button
              onClick={() => copy(snippet, 'snippet')}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-ink-soft hover:text-ink"
            >
              {copied === 'snippet' ? <Check className="h-4 w-4 text-signal" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <Button onClick={() => copy(snippet, 'snippet')} className="w-full sm:w-auto">
            {copied === 'snippet' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'snippet' ? 'Copiado' : 'Copiar código'}
          </Button>
        </CardBody>
      </Card>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Card>
          <CardBody className="space-y-3">
            <CardTitle>Guías por plataforma</CardTitle>
            {[
              ['WordPress', 'Pega el código en el footer (Apariencia → Editor de temas).'],
              ['Shopify', 'Settings → Checkout → Order status page scripts.'],
              ['Wix / Squarespace', 'Settings → Custom Code → añade al &lt;body&gt;.'],
              ['Google Tag Manager', 'Nueva etiqueta → HTML personalizado → pega el snippet.'],
            ].map(([name, body]) => (
              <div key={name} className="rounded-lg border border-border bg-base px-3 py-2.5">
                <div className="text-sm font-medium text-ink">{name}</div>
                <div className="text-xs text-ink-faint" dangerouslySetInnerHTML={{ __html: body }} />
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3">
            <CardTitle>Probar sin instalar</CardTitle>
            <p className="text-sm text-ink-soft">
              Arrastra este botón a tu barra de favoritos y haz clic en cualquier web para ver tu
              widget en acción.
            </p>
            <a
              href={bookmarklet}
              onClick={(e) => e.preventDefault()}
              className="inline-flex cursor-grab items-center gap-2 rounded-lg border border-signal/40 bg-signal-dim px-4 py-2.5 text-sm font-medium text-signal"
            >
              <ExternalLink className="h-4 w-4" />
              Probar Signal
            </a>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
