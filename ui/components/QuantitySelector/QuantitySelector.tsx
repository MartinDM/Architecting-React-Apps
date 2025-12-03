'use client';

import type { CartItem } from '@/types';
import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export default function QuantitySelector({
  id,
  price,
  quantity,
  name,
  imageUrl,
}: CartItem) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`;

  const {
    data: cartItems,
    isPending,
    isError,
  } = useQuery<CartItem[]>({
    queryKey: ['cartItems'],
    queryFn: () => fetch(url).then((res) => res.json()),
  });

  const queryClient = useQueryClient();

  const currentItem = cartItems?.find((item) => item.id === id);
  const currentQuantity = currentItem?.quantity ?? quantity;

  const mutation = useMutation({
    // Add a fake delay so the optimistic update is visible.
    // MutationFn is the real call
    mutationFn: async (newQuantity: number) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          quantity: newQuantity,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to update cart');
      }
      return res.json();
    },
    onMutate: async (newQuantity: number) => {
      await queryClient.cancelQueries({ queryKey: ['cartItems'] });
      const previousCart = queryClient.getQueryData(['cartItems']);
      // Optimistically update the cache
      queryClient.setQueryData(['cartItems'], (oldCart: any) => {
        const existingItemIndex = oldCart.findIndex(
          (item: CartItem) => item.id === id
        );

        if (existingItemIndex > -1) {
          const updatedCart = [...oldCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: newQuantity,
          };
          return updatedCart;
        } else {
          const newCart = [
            ...oldCart,
            { id, name, price, imageUrl, quantity: newQuantity },
          ];
          return newCart;
        }
      });
      // Return context for rollback
      return { previousCart };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cartItems'], context.previousCart);
      }
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cartItems'], updatedCart);
    },
  });

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    mutation.mutate(newQuantity);
  };

  return (
    <div className="quantity-selector-wrapper">
      <div className="quantity-selector">
        <button
          onClick={() => {
            handleQuantityChange(currentQuantity - 1);
          }}
          disabled={mutation.isPending || currentQuantity <= 1}
        >
          -
        </button>
        <span>{currentQuantity}</span>
        <button
          onClick={() => {
            handleQuantityChange(currentQuantity + 1);
          }}
          disabled={mutation.isPending}
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
