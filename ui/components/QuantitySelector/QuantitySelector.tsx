'use client';

import { CartItem } from '@/types/types';
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
  } = useQuery({
    queryKey: ['cartItems'],
    queryFn: () => fetch(url).then((res) => res.json()),
  });

  const queryClient = useQueryClient();

  const currentItem = cartItems?.find((item) => item.id === id);
  const currentQuantity = currentItem?.quantity ?? quantity;

  const mutation = useMutation({
    mutationFn: (newQuantity: number) =>
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          quantity: newQuantity,
        }),
      }).then((res) => res.json()),
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
