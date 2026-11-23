import { supabase, getStoreId } from '@/lib/supabase';

export interface Sale {
  id: string;
  sale_number: number;
  customer_name: string | null;
  total_amount: number;
  final_amount: number;
  payment_method: string;
  created_at: string;
}

export interface SaleDetail extends Sale {
  customer_document: string | null;
  customer_phone: string | null;
  discount_amount: number;
  installments: number;
  status: string;
  notes: string | null;
  sold_by: string | null;
  items: SaleItem[];
}

export interface SaleItem {
  id: string;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_amount: number;
}

export const salesService = {
  async getSales(startDate?: string, endDate?: string): Promise<Sale[]> {
    const storeId = getStoreId();

    let query = supabase
      .from('sales')
      .select('id, sale_number, customer_name, total_amount, final_amount, payment_method, created_at')
      .eq('store_id', storeId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async getSaleById(id: string): Promise<SaleDetail | null> {
    const storeId = getStoreId();

    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .eq('store_id', storeId)
      .single();

    if (saleError) throw saleError;
    if (!sale) return null;

    const { data: items, error: itemsError } = await supabase
      .from('sale_items')
      .select('id, product_name, variant_name, quantity, unit_price, total_amount')
      .eq('sale_id', id);

    if (itemsError) throw itemsError;

    return {
      ...sale,
      items: items || [],
    };
  },
};
