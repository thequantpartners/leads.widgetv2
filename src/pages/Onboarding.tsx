import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Card, CardBody } from '@/components/ui/Card'
import { useWidget, useSaveWidget } from '@/lib/useWidget'

const steps = ['Tu negocio', 'Cobro', 'Listo']

export function Onboarding() {
  const navigate = useNavigate()
  const { data } = useWidget()
  const save = useSaveWidget()
  const [step, setStep] = useState(0)
  const [businessName, setBusinessName] = useState('')
  const [niche, setNiche] = useState('')
  const [paymentLink, setPaymentLink] = useState('')

  async function finish() {
    await save.mutateAsync({ businessName, niche, paymentLink, active: true })
    navigate('/app')
  }

  return (
    <div className="min-h-screen bg-base">
      <header className="border-b border-border">
        <div className="mx-auto max-w-2xl px-5 py-5">
          <Logo />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-12">
        {/* stepper */}
        <div className="mb-10 flex items-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                  i < step
                    ? 'bg-signal text-signal-ink'
                    : i === step
                      ? 'border-2 border-signal text-signal'
                      : 'border border-border text-ink-faint'
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm ${i <= step ? 'text-ink' : 'text-ink-faint'}`}>{label}</span>
              {i < steps.length - 1 && <div className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>

        <Card>
          <CardBody className="p-7">
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-ink">¿De qué es tu negocio?</h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    La IA usa esto para sonar como tú y consultar bien.
                  </p>
                </div>
                <div>
                  <Label>Nombre del negocio</Label>
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Consulting" autoFocus />
                </div>
                <div>
                  <Label>Nicho</Label>
                  <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="consultoría, ecommerce, salud…" />
                </div>
                <Button onClick={() => setStep(1)} disabled={!businessName} className="w-full">
                  Continuar <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-ink">¿Dónde cobras?</h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    El widget mostrará este link cuando la IA detecte intención de compra.
                  </p>
                </div>
                <div>
                  <Label>Link de pago (Stripe / Lemon Squeezy)</Label>
                  <Input value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="https://buy.stripe.com/..." autoFocus />
                  <p className="mt-2 text-xs text-ink-faint">Puedes agregarlo después.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(0)}>Atrás</Button>
                  <Button onClick={() => setStep(2)} className="flex-1">
                    Continuar <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-signal-dim">
                  <Check className="h-7 w-7 text-signal" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink">Tu widget está listo</h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    {data ? `ID: ${data.id}` : 'Generando…'} — solo falta pegarlo en tu web.
                  </p>
                </div>
                <Button onClick={finish} disabled={save.isPending} className="w-full">
                  {save.isPending ? 'Activando…' : 'Ir al panel'} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
