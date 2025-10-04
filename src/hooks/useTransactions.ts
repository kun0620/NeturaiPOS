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

  const createTransaction = async (
    items: { product_id: string; quantity: number; unit_price: number }[],
    paymentMethod: 'cash' | 'card',
    userId?: string
  ) => {
    setLoading(true);
    try {
      const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
      const taxAmount = subtotal * 0.1;
      const totalAmount = subtotal + taxAmount;

      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          tax_amount: taxAmount,
          payment_method: paymentMethod,
          status: 'completed',
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
        // Potentially roll back the transaction if this were a real transaction block
        return { error: itemsError };
      }

      // Update product stock
      for (const item of items) {
        const { error: stockError } = await supabase
          .rpc('decrement_product_stock', { p_product_id: item.product_id, p_quantity: item.quantity });
        if (stockError) {
          console.error('Failed to decrement stock:', stockError);
          // Handle stock update failure, potentially refund or alert
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

  return { transactions, loading, error, fetchTransactions, createTransaction };
}
