import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Target } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { dashboardService, DashboardMetrics, TopProduct } from '@/services/dashboard.service';
import { formatCurrency } from '@/utils/currency';

export function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const [metricsData, productsData] = await Promise.all([
        dashboardService.getMetrics(startDate, endDate),
        dashboardService.getTopProducts(startDate, endDate),
      ]);

      setMetrics(metricsData);
      setTopProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600">Visão geral dos últimos 30 dias</p>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Vendas Hoje */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Vendas Hoje</p>
              <p className="mt-2 text-3xl font-semibold text-neutral-900">
                {metrics?.sales_today || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50">
              <ShoppingBag className="h-6 w-6 text-gold-600" />
            </div>
          </div>
        </Card>

        {/* Faturamento Hoje */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Faturamento Hoje</p>
              <p className="mt-2 text-3xl font-semibold text-neutral-900">
                {formatCurrency(metrics?.revenue_today || 0)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Total Vendas (30 dias) */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Vendas (30d)</p>
              <p className="mt-2 text-3xl font-semibold text-neutral-900">
                {metrics?.total_sales || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Ticket Médio */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Ticket Médio</p>
              <p className="mt-2 text-3xl font-semibold text-neutral-900">
                {formatCurrency(metrics?.average_ticket || 0)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Top Produtos */}
      <div className="mt-6">
        <Card>
          <div className="border-b border-neutral-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Produtos Mais Vendidos</h2>
            <p className="mt-1 text-sm text-neutral-600">Últimos 30 dias</p>
          </div>
          <div className="p-4 md:p-6">
            {topProducts.length === 0 ? (
              <p className="text-center text-sm text-neutral-500 py-8">
                Nenhuma venda registrada
              </p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">{product.product_name}</p>
                      <p className="text-sm text-neutral-600">
                        {product.total_quantity} unidades vendidas
                      </p>
                    </div>
                    <Badge variant="outline">
                      {formatCurrency(product.total_revenue)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
