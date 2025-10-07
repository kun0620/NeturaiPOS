import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction, TransactionItem } from '../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        transaction_items (
          id,
          product_id,
          quantity,
          unit_price,
          total_price,
          products (
            name,
            sku
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setTransactions([]);
    } else {
      setTransactions(data as Transaction[]);
    }
    setLoading(false);
  };

  const fetchTransactionById = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        transaction_items (
          id,
          product_id,
          quantity,
          unit_price,
          total_price,
          products (
            name,
            sku
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return { data: null, error };
    }
    setLoading(false);
    return { data: data as Transaction, error: null };
  };

  const createTransaction = async (
    items: { product_id: string; quantity: number; unit_price: number }[],
    paymentMethod: 'cash' | 'card',
    totalAmount: number, // New parameter
    vatAmount: number, // New parameter
    discountAmount: number, // New parameter
    priceExcludingVAT: number, // New parameter
    userId?: string,
    salespersonName?: string // New parameter for salesperson name
  ) => {
    setLoading(true);
    try {
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          tax_amount: vatAmount, // Store VAT as tax_amount
          discount_amount: discountAmount, // New column for discount
          price_excluding_vat: priceExcludingVAT, // New column for price excluding VAT
          payment_method: paymentMethod,
          status: 'completed',
          salesperson_name: salespersonName, // Store salesperson name
        })
        .select()
        .single();

      if (transactionError) {
        setError(transactionError.message);
        return { error: transactionError };
      }

      const transactionItemsToInsert = items.map((item) => ({
        transaction_id: transactionData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('transaction_items')
        .insert(transactionItemsToInsert);

      if (itemsError) {
        setError(itemsError.message);
        return { error: itemsError };
      }

      // Update product stock
      for (const item of items) {
        const { error: stockError } = await supabase
          .rpc('decrement_product_stock', { p_product_id: item.product_id, p_quantity: item.quantity });
        if (stockError) {
          console.error('Failed to decrement stock:', stockError);
        }
      }

      fetchTransactions(); // Refresh transactions list
      return { data: transactionData };
    } catch (err: any) {
      setError(err.message);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  return { transactions, loading, error, fetchTransactions, fetchTransactionById, createTransaction };
}
