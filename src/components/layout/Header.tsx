import { LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { authService } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleSync = () => {
    setSyncing(true);
    // Força reload dos dados
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-neutral-900">
            <span className="font-display text-sm font-semibold tracking-widest text-gold-400">
              E
            </span>
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-wide text-neutral-900">
              EVVA
            </h1>
            <p className="text-xs text-neutral-500">Painel Gerencial</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Badge variant="success" className="hidden md:inline-flex">
            Online
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Atualizar</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
