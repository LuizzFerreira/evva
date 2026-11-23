import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, BarChart2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Vendas', to: '/sales', icon: ShoppingBag },
  { label: 'Estoque', to: '/stock', icon: Package },
  { label: 'Relatórios', to: '/reports', icon: BarChart2 },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-neutral-200 bg-white md:hidden">
      <div className="grid grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-gold-600'
                    : 'text-neutral-600 hover:text-neutral-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-5 w-5', isActive && 'text-gold-600')} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
