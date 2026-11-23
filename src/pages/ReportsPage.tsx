import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { BarChart2, TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';
import { stockService } from '@/services/stock.service';
import { formatCurrency } from '@/utils/currency';

export function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadReport();
  }, [period]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const [metricsData, productsData, stockData] = await Promise.all([
        dashboardService.getMetrics(startDate, endDate),
        dashboardService.getTopProducts(startDate, endDate, 10),
        stockService.getLowStock(),
      ]);

      setMetrics(metricsData);
      setTopProducts(productsData);
      setLowStock(stockData);
    } catch (err) {
      console.error('Erro ao carregar relatório:', err);
      setError('Erro ao carregar relatório');
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = () => {
    if (period === '7d') return 'Últimos 7 dias';
    if (period === '30d') return 'Últimos 30 dias';
    return 'Últimos 90 dias';
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="rounded-lg border border-danger-200 bg-danger-50 p-4">
          <p className="text-danger-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">Relatórios</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Análises e relatórios detalhados - {getPeriodLabel()}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('7d')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === '7d'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            7 dias
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === '30d'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            30 dias
          </button>
          <button
            onClick={() => setPeriod('90d')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === '90d'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            90 dias
          </button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total de Vendas</p>
                <p className="mt-1 text-2xl font-semibold">{metrics?.total_sales || 0}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Faturamento Total</p>
                <p className="mt-1 text-2xl font-semibold text-success-600">
                  {formatCurrency(metrics?.total_revenue || 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-success-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Ticket Médio</p>
                <p className="mt-1 text-2xl font-semibold text-primary-600">
                  {formatCurrency(metrics?.average_ticket || 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Itens com Estoque Baixo</p>
                <p className="mt-1 text-2xl font-semibold text-warning-600">
                  {lowStock.length}
                </p>
              </div>
              <Package className="h-8 w-8 text-warning-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top 10 produtos mais vendidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Top 10 Produtos Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="py-8 text-center text-neutral-500">Nenhuma venda no período</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={product.product_name}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{product.product_name}</p>
                        <p className="text-xs text-neutral-500">
                          {product.total_quantity} unidades vendidas
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">{formatCurrency(product.total_revenue)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produtos com estoque baixo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos com Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="py-8 text-center text-success-600">
                ✓ Todos os produtos com estoque adequado
              </p>
            ) : (
              <div className="space-y-3">
                {lowStock.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-warning-200 bg-warning-50 p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">{item.product_name}</p>
                      {item.variant_name && (
                        <p className="text-xs text-neutral-500">{item.variant_name}</p>
                      )}
                      <p className="mt-1 text-xs text-neutral-600">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning">
                        {item.stock_quantity} / {item.min_stock}
                      </Badge>
                      <p className="mt-1 text-xs text-neutral-500">Estoque / Mínimo</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
