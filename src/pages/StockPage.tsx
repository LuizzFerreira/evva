import { Card } from '@/components/ui/Card';
import { Package } from 'lucide-react';

export function StockPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">Estoque</h1>
        <p className="mt-1 text-sm text-neutral-600">Consulta de produtos e estoque</p>
      </div>

      <Card className="p-12">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-neutral-300" />
          <p className="mt-4 text-neutral-600">Consulta de estoque em desenvolvimento</p>
        </div>
      </Card>
    </div>
  );
}
