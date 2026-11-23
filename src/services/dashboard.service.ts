import { supabase, getStoreId } from '@/lib/supabase';

export interface DashboardMetrics {
  total_sales: number;
  total_revenue: number;
  average_ticket: number;
  sales_today: number;
  revenue_today: number;
}

export interface TopProduct {
  product_name: string;
  total_quantity: number;
  total_revenue: number;
}

export interface PaymentDistribution {
  payment_method: string;
  total_amount: number;
  count: number;
}

export const dashboardService = {
  async getMetrics(startDate: string, endDate: string): Promise<DashboardMetrics> {
    const storeId = getStoreId();

    const { data, error } = await supabase
      .from('sales')
      .select('total_amount, created_at')
      .eq('store_id', storeId)
      .eq('status', 'completed')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw error;

    const total_sales = data.length;
    const total_revenue = data.reduce((sum, sale) => sum + sale.total_amount, 0);
    const average_ticket = total_sales > 0 ? total_revenue / total_sales : 0;

    // Vendas de hoje
    const today = new Date().toISOString().split('T')[0];
    const sales_today = data.filter((s) => s.created_at.startsWith(today)).length;
    const revenue_today = data
      .filter((s) => s.created_at.startsWith(today))
      .reduce((sum, sale) => sum + sale.total_amount, 0);

    return {
      total_sales,
      total_revenue,
      average_ticket,
      sales_today,
      revenue_today,
    };
  },

  async getTopProducts(startDate: string, endDate: string, limit = 5): Promise<TopProduct[]> {
    const storeId = getStoreId();

    const { data, error } = await supabase
      .from('sale_items')
      .select(`
        product_name,
        quantity,
        price,
        sales!inner(store_id, status, created_at)
      `)
      .eq('sales.store_id', storeId)
      .eq('sales.status', 'completed')
      .gte('sales.created_at', startDate)
      .lte('sales.created_at', endDate);

    if (error) throw error;

    // Agregar por produto
    const productMap = new Map<string, { quantity: number; revenue: number }>();

    data.forEach((item: any) => {
      const existing = productMap.get(item.product_name) || { quantity: 0, revenue: 0 };
      productMap.set(item.product_name, {
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + item.quantity * item.price,
      });
    });

    // Converter para array e ordenar
    const topProducts = Array.from(productMap.entries())
      .map(([product_name, stats]) => ({
        product_name,
        total_quantity: stats.quantity,
        total_revenue: stats.revenue,
      }))
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, limit);

    return topProducts;
  },

  async getPaymentDistribution(
    startDate: string,
    endDate: string
  ): Promise<PaymentDistribution[]> {
    const storeId = getStoreId();

    const { data, error } = await supabase
      .from('sales')
      .select('payment_method, total_amount')
      .eq('store_id', storeId)
      .eq('status', 'completed')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw error;

    // Agregar por forma de pagamento
    const paymentMap = new Map<string, { amount: number; count: number }>();

    data.forEach((sale) => {
      const existing = paymentMap.get(sale.payment_method) || { amount: 0, count: 0 };
      paymentMap.set(sale.payment_method, {
        amount: existing.amount + sale.total_amount,
        count: existing.count + 1,
      });
    });

    return Array.from(paymentMap.entries())
      .map(([payment_method, stats]) => ({
        payment_method,
        total_amount: stats.amount,
        count: stats.count,
      }))
      .sort((a, b) => b.total_amount - a.total_amount);
  },
};
