import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth'
import { WidgetMock } from '@/components/WidgetMock'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43.5c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 34.5 26.7 35.5 24 35.5c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9.6 39 16.2 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.4 36.3 43.5 30.7 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  )
}

export function Login() {
  const { user, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && user) navigate('/app', { replace: true })
  }, [user, loading, navigate])

  async function handleGoogle() {
    setBusy(true)
    setError('')
    try {
      await signInWithGoogle()
      navigate('/app', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* form side */}
      <div className="flex flex-col justify-center bg-base px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <Logo className="mb-10" />
          <h1 className="text-3xl font-bold tracking-tight">Entra a Signal</h1>
          <p className="mt-2 text-ink-soft">
            Un solo clic con Google. Sin contraseñas que recordar.
          </p>

          <Button
            onClick={handleGoogle}
            disabled={busy}
            variant="secondary"
            size="lg"
            className="mt-8 w-full"
          >
            <GoogleIcon />
            {busy ? 'Conectando…' : 'Continuar con Google'}
          </Button>

          {error && <p className="mt-4 text-sm text-danger">{error}</p>}

          <p className="mt-8 text-xs text-ink-faint">
            Al continuar aceptas los Términos y la Política de Privacidad.
          </p>
        </div>
      </div>

      {/* visual side */}
      <div className="bg-grid relative hidden items-center justify-center border-l border-border bg-surface/30 p-12 lg:flex">
        <div className="w-full max-w-sm">
          <WidgetMock />
          <p className="mt-8 text-center text-sm text-ink-soft">
            Tu widget detecta, consulta y cobra — solo.
          </p>
        </div>
      </div>
    </div>
  )
}
