'use client';

import { CartItem } from '@/types/types';
import React, { useState } from 'react';
import useSWR from 'swr';

export default function QuantitySelector({ id, price, quantity }: CartItem) {
  const [currentQuantity, setQuantity] = useState(quantity);
  const [loading, setLoading] = useState(false);

  const { mutate } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setLoading(true);
    setQuantity(newQuantity);

    try {
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
      await response.json();

      // Trigger SWR to refetch using mutate.
      // Prevents full page reload by updating the data on the client.
      // Updates the cart on the client side
      mutate();
    } catch (e) {
      console.log(e);
      // Revert quantity on error
      setQuantity(quantity);
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
        <span>{loading ? '...' : currentQuantity}</span>
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
