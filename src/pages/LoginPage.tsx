import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { authService } from '@/lib/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.signIn(email, password);
      navigate('/');
    } catch (err) {
      setError('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4">
      <Card className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900">
            <span className="font-display text-2xl font-bold tracking-widest text-gold-400">
              E
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-wide text-neutral-900">
            EVVA
          </h1>
          <p className="mt-2 text-sm text-neutral-600">Painel Gerencial</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Senha
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              'Entrando...'
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Entrar
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-neutral-500">
          Acesso exclusivo para proprietária
        </p>
      </Card>
    </div>
  );
}
