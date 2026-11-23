import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ShoppingBag, Calendar, CreditCard, User } from 'lucide-react';
import { salesService, Sale, SaleDetail } from '@/services/sales.service';
import { formatCurrency } from '@/utils/currency';

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<SaleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesService.getSales();
      setSales(data);
    } catch (err) {
      console.error('Erro ao carregar vendas:', err);
      setError('Erro ao carregar histórico de vendas');
    } finally {
      setLoading(false);
    }
  };

  const loadSaleDetail = async (id: string) => {
    try {
      const detail = await salesService.getSaleById(id);
      setSelectedSale(detail);
    } catch (err) {
      console.error('Erro ao carregar detalhes da venda:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">Vendas</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Histórico de vendas da loja ({sales.length} vendas)
        </p>
      </div>

      {sales.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-neutral-300" />
            <p className="mt-4 text-neutral-600">Nenhuma venda registrada ainda</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lista de vendas */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] space-y-3 overflow-y-auto">
                {sales.map((sale) => (
                  <button
                    key={sale.id}
                    onClick={() => loadSaleDetail(sale.id)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors hover:bg-neutral-50 ${
                      selectedSale?.id === sale.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-900">
                            Venda #{sale.sale_number}
                          </span>
                          <Badge variant="success" className="text-xs">
                            {sale.payment_method}
                          </Badge>
                        </div>
                        {sale.customer_name && (
                          <p className="mt-1 text-sm text-neutral-600">
                            <User className="mb-0.5 inline h-3 w-3" /> {sale.customer_name}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-neutral-500">
                          <Calendar className="mb-0.5 inline h-3 w-3" /> {formatDate(sale.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">
                          {formatCurrency(sale.final_amount)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da venda */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Venda</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedSale ? (
                <div className="py-12 text-center text-neutral-500">
                  Selecione uma venda para ver os detalhes
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-3 rounded-lg bg-neutral-50 p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Número:</span>
                      <span className="font-semibold">#{selectedSale.sale_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Data:</span>
                      <span className="text-sm">{formatDate(selectedSale.created_at)}</span>
                    </div>
                    {selectedSale.customer_name && (
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Cliente:</span>
                        <span className="text-sm">{selectedSale.customer_name}</span>
                      </div>
                    )}
                    {selectedSale.customer_phone && (
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Telefone:</span>
                        <span className="text-sm">{selectedSale.customer_phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Pagamento:</span>
                      <div className="text-right">
                        <Badge variant="success">{selectedSale.payment_method}</Badge>
                        {selectedSale.installments > 1 && (
                          <span className="ml-2 text-xs text-neutral-600">
                            {selectedSale.installments}x
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium text-neutral-900">Itens</h3>
                    <div className="space-y-2">
                      {selectedSale.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between rounded border border-neutral-200 p-3"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900">{item.product_name}</p>
                            {item.variant_name && (
                              <p className="text-xs text-neutral-500">{item.variant_name}</p>
                            )}
                            <p className="mt-1 text-xs text-neutral-600">
                              {item.quantity}x {formatCurrency(item.unit_price)}
                            </p>
                          </div>
                          <div className="text-right font-semibold text-neutral-900">
                            {formatCurrency(item.total_amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Subtotal:</span>
                      <span>{formatCurrency(selectedSale.total_amount)}</span>
                    </div>
                    {selectedSale.discount_amount > 0 && (
                      <div className="flex justify-between text-sm text-danger-600">
                        <span>Desconto:</span>
                        <span>-{formatCurrency(selectedSale.discount_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-success-600">
                        {formatCurrency(selectedSale.final_amount)}
                      </span>
                    </div>
                  </div>

                  {selectedSale.notes && (
                    <div className="rounded bg-neutral-50 p-3">
                      <p className="text-xs font-medium text-neutral-700">Observações:</p>
                      <p className="mt-1 text-sm text-neutral-600">{selectedSale.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
