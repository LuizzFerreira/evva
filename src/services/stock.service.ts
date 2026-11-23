import { supabase } from '@/lib/supabase';

export interface StockItem {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  variant_name: string | null;
  stock_quantity: number;
  min_stock: number;
  base_price: number;
}

export const stockService = {
  async getStock(): Promise<StockItem[]> {
    const { data: variants, error } = await supabase
      .from('product_variants')
      .select(`
        id,
        product_id,
        sku,
        variant_name,
        stock_quantity,
        min_stock,
        products!inner(name, base_price)
      `)
      .eq('is_active', true)
      .order('stock_quantity', { ascending: true });

    if (error) throw error;

    return variants.map((v: any) => ({
      id: v.id,
      product_id: v.product_id,
      product_name: v.products.name,
      sku: v.sku,
      variant_name: v.variant_name,
      stock_quantity: v.stock_quantity,
      min_stock: v.min_stock,
      base_price: v.products.base_price,
    }));
  },

  async getLowStock(): Promise<StockItem[]> {
    const { data: variants, error } = await supabase
      .from('product_variants')
      .select(`
        id,
        product_id,
        sku,
        variant_name,
        stock_quantity,
        min_stock,
        products!inner(name, base_price)
      `)
      .eq('is_active', true)
      .order('stock_quantity', { ascending: true });

    if (error) throw error;

    const items = variants.map((v: any) => ({
      id: v.id,
      product_id: v.product_id,
      product_name: v.products.name,
      sku: v.sku,
      variant_name: v.variant_name,
      stock_quantity: v.stock_quantity,
      min_stock: v.min_stock,
      base_price: v.products.base_price,
    }));

    // Filtrar apenas itens com estoque baixo
    return items.filter((item) => item.stock_quantity <= item.min_stock);
  },
};
