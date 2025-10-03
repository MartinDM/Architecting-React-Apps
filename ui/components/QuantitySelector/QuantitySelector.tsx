'use client';

import { CartItem } from '@/types/types';
import React, { useState } from 'react';
import useSWR from 'swr';

export default function QuantitySelector({
  id,
  price,
  quantity,
  name,
  imageUrl,
}: CartItem) {
  const [loading, setLoading] = useState(false);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  // Get cart data from SWR cache - this is shared across all components
  const { data: cartItems, mutate } = useSWR<CartItem[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );

  // Get the current quantity from the SWR cache, not from local state
  const currentItem = cartItems?.find((item) => item.id === id);
  const currentQuantity = currentItem?.quantity ?? quantity;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setLoading(true);

    try {
      // Optimistic update: immediately update SWR cache for instant UI feedback
      await mutate(
        async () => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id,
                quantity: newQuantity,
              }),
            }
          );

          if (!response.ok) {
            throw new Error('Failed to update cart item');
          }

          // Return the updated cart data from the server
          return response.json();
        },
        {
          // Optimistic data: update cache immediately before API call completes.
          // Once completed, the state is updated with actul result
          optimisticData: cartItems?.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          ),
          // Don't revalidate immediately, we'll get the server response
          revalidate: false,
        }
      );
    } catch (e) {
      console.log(e);
      // mutate will automatically revert the optimistic update on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quantity-selector-wrapper">
      <div className="quantity-selector">
        <button
          onClick={() => {
            handleQuantityChange(currentQuantity - 1);
          }}
          disabled={loading || currentQuantity <= 1}
        >
          -
        </button>
        <span>{currentQuantity}</span>
        <button
          onClick={() => {
            handleQuantityChange(currentQuantity + 1);
          }}
          disabled={loading}
        >
          +
        </button>
      </div>
      <div className="cart-item-price-wrapper">
        <p className="cart-item-price">
          Total: ${(price * currentQuantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
