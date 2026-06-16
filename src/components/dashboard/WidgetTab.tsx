import { useEffect, useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { useWidget, useSaveWidget } from '@/lib/useWidget'
import type { BehaviorRule, WidgetConfig } from '@/lib/types'
import { Card, CardBody, CardTitle } from '@/components/ui/Card'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { PageHeader } from './PageHeader'

export function WidgetTab() {
  const { data, isLoading } = useWidget()
  const save = useSaveWidget()
  const [form, setForm] = useState<WidgetConfig | null>(null)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  if (isLoading || !form)
    return (
      <div className="grid h-64 place-items-center">
        <Spinner />
      </div>
    )

  const set = (patch: Partial<WidgetConfig>) => setForm({ ...form, ...patch })

  const setRule = (i: number, patch: Partial<BehaviorRule>) => {
    const rules = form.behaviorRules.map((r, idx) => (idx === i ? { ...r, ...patch } : r))
    set({ behaviorRules: rules })
  }
  const addRule = () =>
    set({
      behaviorRules: [
        ...form.behaviorRules,
        { section: 'pricing', thresholdSeconds: 15, message: '', enabled: true },
      ],
    })
  const removeRule = (i: number) =>
    set({ behaviorRules: form.behaviorRules.filter((_, idx) => idx !== i) })

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Configurar widget"
        subtitle="Define cómo se ve, cómo habla y cuándo dispara cada mensaje."
        action={
          <Button onClick={() => save.mutate(form)} disabled={save.isPending}>
            <Save className="h-4 w-4" />
            {save.isPending ? 'Guardando…' : 'Guardar'}
          </Button>
        }
      />

      <div className="space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <CardTitle>Identidad</CardTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Nombre del negocio</Label>
                <Input value={form.businessName} onChange={(e) => set({ businessName: e.target.value })} />
              </div>
              <div>
                <Label>Nicho</Label>
                <Input value={form.niche} onChange={(e) => set({ niche: e.target.value })} placeholder="ej. consultoría, ecommerce" />
              </div>
              <div>
                <Label>Nombre del agente IA</Label>
                <Input value={form.agentName} onChange={(e) => set({ agentName: e.target.value })} />
              </div>
              <div>
                <Label>Tono</Label>
                <Input value={form.tone} onChange={(e) => set({ tone: e.target.value })} placeholder="ej. cercano y directo" />
              </div>
              <div>
                <Label>Color de acento</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.accentColor}
                    onChange={(e) => set({ accentColor: e.target.value })}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-border bg-base"
                  />
                  <Input value={form.accentColor} onChange={(e) => set({ accentColor: e.target.value })} />
                </div>
              </div>
            </div>
            <div>
              <Label>Mensaje de bienvenida</Label>
              <Textarea value={form.welcomeMessage} onChange={(e) => set({ welcomeMessage: e.target.value })} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <CardTitle>Cobro (early conversion)</CardTitle>
            <div>
              <Label>Link de pago (Stripe / Lemon Squeezy)</Label>
              <Input
                value={form.paymentLink}
                onChange={(e) => set({ paymentLink: e.target.value })}
                placeholder="https://buy.stripe.com/..."
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <CardTitle>Google Ads</CardTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Conversion ID (AW-XXXXX)</Label>
                <Input value={form.googleAdsId ?? ''} onChange={(e) => set({ googleAdsId: e.target.value })} />
              </div>
              <div>
                <Label>Conversion Label</Label>
                <Input value={form.conversionLabel ?? ''} onChange={(e) => set({ conversionLabel: e.target.value })} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Reglas de comportamiento</CardTitle>
                <p className="mt-1 text-sm text-ink-soft">
                  Qué sección monitorear, cuánto esperar y qué decir.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={addRule}>
                <Plus className="h-4 w-4" />
                Regla
              </Button>
            </div>

            <div className="space-y-3">
              {form.behaviorRules.map((rule, i) => (
                <div key={i} className="rounded-xl border border-border bg-base p-4">
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                    <div>
                      <Label>Sección</Label>
                      <select
                        value={rule.section}
                        onChange={(e) => setRule(i, { section: e.target.value })}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-signal focus:outline-none"
                      >
                        {['pricing', 'features', 'testimonials', 'faq', 'contact', 'checkout', 'hero'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-28">
                      <Label>Segundos</Label>
                      <Input
                        type="number"
                        value={rule.thresholdSeconds}
                        onChange={(e) => setRule(i, { thresholdSeconds: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-end gap-2 pb-0.5">
                      <label className="flex h-11 items-center gap-2 text-sm text-ink-soft">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={(e) => setRule(i, { enabled: e.target.checked })}
                          className="h-4 w-4 accent-signal"
                        />
                        Activa
                      </label>
                      <button
                        onClick={() => removeRule(i)}
                        className="grid h-11 w-11 place-items-center rounded-lg border border-border text-ink-faint hover:border-danger/40 hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label>Mensaje proactivo</Label>
                    <Input
                      value={rule.message}
                      onChange={(e) => setRule(i, { message: e.target.value })}
                      placeholder="Déjalo vacío para que la IA lo genere según el contexto"
                    />
                  </div>
                </div>
              ))}
              {form.behaviorRules.length === 0 && (
                <p className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-ink-faint">
                  Sin reglas. Agrega una para que el widget reaccione al comportamiento.
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
