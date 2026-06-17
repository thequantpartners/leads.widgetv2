import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth'
import { WidgetMock } from '@/components/WidgetMock'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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
