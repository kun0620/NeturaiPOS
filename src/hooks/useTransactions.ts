import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction, TransactionItem } from '../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          transaction_items (
            *,
            products (name, sku)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (
    items: { product_id: string; quantity: number; unit_price: number }[],
    paymentMethod: 'cash' | 'card'
  ) => {
    try {
      const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const taxAmount = totalAmount * 0.1;
      const transactionNumber = `TXN-${Date.now()}`;

      // Create transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          transaction_number: transactionNumber,
          total_amount: totalAmount,
          tax_amount: taxAmount,
          payment_method: paymentMethod,
          status: 'completed',
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Create transaction items
      const transactionItems = items.map(item => ({
        transaction_id: transaction.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from('transaction_items')
        .insert(transactionItems);

      if (itemsError) throw itemsError;

      // Update product stock
      for (const item of items) {
        await supabase.rpc('decrement_stock', {
          product_id: item.product_id,
          quantity: item.quantity,
        });
      }

      await fetchTransactions();
      return { data: transaction, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    createTransaction,
    refetch: fetchTransactions,
  };
}