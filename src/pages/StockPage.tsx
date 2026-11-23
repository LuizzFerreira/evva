import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Package, AlertTriangle, Search } from 'lucide-react';
import { stockService, StockItem } from '@/services/stock.service';
import { formatCurrency } from '@/utils/currency';

export function StockPage() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [filteredStock, setFilteredStock] = useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  useEffect(() => {
    loadStock();
  }, []);

  useEffect(() => {
    filterStock();
  }, [searchTerm, showOnlyLowStock, stock]);

  const loadStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockService.getStock();
      setStock(data);
    } catch (err) {
      console.error('Erro ao carregar estoque:', err);
      setError('Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  const filterStock = () => {
    let filtered = stock;

    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.product_name.toLowerCase().includes(term) ||
          item.sku.toLowerCase().includes(term) ||
          item.variant_name?.toLowerCase().includes(term)
      );
    }

    // Filtro de estoque baixo
    if (showOnlyLowStock) {
      filtered = filtered.filter((item) => item.stock_quantity <= item.min_stock);
    }

    setFilteredStock(filtered);
  };

  const getLowStockCount = () => {
    return stock.filter((item) => item.stock_quantity <= item.min_stock).length;
  };

  const getTotalValue = () => {
    return filteredStock.reduce(
      (sum, item) => sum + item.stock_quantity * item.base_price,
      0
    );
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">Estoque</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Consulta de produtos e estoque ({filteredStock.length} itens)
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total de Itens</p>
                <p className="mt-1 text-2xl font-semibold">{stock.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Estoque Baixo</p>
                <p className="mt-1 text-2xl font-semibold text-warning-600">
                  {getLowStockCount()}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-neutral-600">Valor em Estoque</p>
              <p className="mt-1 text-2xl font-semibold text-success-600">
                {formatCurrency(getTotalValue())}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por produto ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <label className="flex items-center gap-2 whitespace-nowrap">
          <input
            type="checkbox"
            checked={showOnlyLowStock}
            onChange={(e) => setShowOnlyLowStock(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-neutral-700">Apenas estoque baixo</span>
        </label>
      </div>

      {/* Tabela de estoque */}
      <Card>
        <CardContent className="p-0">
          {filteredStock.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-neutral-300" />
              <p className="mt-4 text-neutral-600">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-neutral-200 bg-neutral-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-neutral-700">
                      Produto
                    </th>
                    <th className="p-3 text-left text-sm font-medium text-neutral-700">SKU</th>
                    <th className="p-3 text-center text-sm font-medium text-neutral-700">
                      Estoque
                    </th>
                    <th className="p-3 text-center text-sm font-medium text-neutral-700">
                      Mínimo
                    </th>
                    <th className="p-3 text-right text-sm font-medium text-neutral-700">
                      Preço Unit.
                    </th>
                    <th className="p-3 text-right text-sm font-medium text-neutral-700">
                      Valor Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredStock.map((item) => {
                    const isLowStock = item.stock_quantity <= item.min_stock;
                    const totalValue = item.stock_quantity * item.base_price;

                    return (
                      <tr
                        key={item.id}
                        className={isLowStock ? 'bg-warning-50' : 'hover:bg-neutral-50'}
                      >
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-neutral-900">{item.product_name}</p>
                            {item.variant_name && (
                              <p className="text-xs text-neutral-500">{item.variant_name}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <code className="rounded bg-neutral-100 px-2 py-1 text-xs font-mono">
                            {item.sku}
                          </code>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`font-semibold ${
                              isLowStock ? 'text-warning-700' : 'text-neutral-900'
                            }`}
                          >
                            {item.stock_quantity}
                          </span>
                        </td>
                        <td className="p-3 text-center text-neutral-600">
                          {item.min_stock}
                        </td>
                        <td className="p-3 text-right text-neutral-900">
                          {formatCurrency(item.base_price)}
                        </td>
                        <td className="p-3 text-right font-semibold text-neutral-900">
                          {formatCurrency(totalValue)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
