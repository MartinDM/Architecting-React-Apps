'use client';
import React from 'react';
import type { CartItem } from '../../../types';
import { useQueryClient, useMutation } from '@tanstack/react-query';

type AddToCartButtonProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export default function AddToCartButton({
  id,
  name,
  price,
  imageUrl,
}: AddToCartButtonProps) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          price,
          imageUrl,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `Server error: ${response.status}`);
      }
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cartItems'] });
      const previousCart = queryClient.getQueryData(['cartItems']);

      // Optimistically update the cache
      queryClient.setQueryData(['cartItems'], (oldCart: any) => {
        if (!oldCart || oldCart.length === 0) {
          return [{ id, name, price, imageUrl, quantity: 1 }];
        }

        const existingItemIndex = oldCart.findIndex(
          (item: CartItem) => item.id === id
        );

        if (existingItemIndex > -1) {
          const updatedCart = [...oldCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + 1,
          };
          return updatedCart;
        } else {
          const newCart = [
            ...oldCart,
            { id, name, price, imageUrl, quantity: 1 },
          ];
          return newCart;
        }
      });
      // Return context for rollback
      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cartItems'], context.previousCart);
      }
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cartItems'], updatedCart);
    },
  });

  return (
    <div className="add-to-cart">
      <p>
        <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? 'Adding...' : '+ ADD TO CART'}
        </button>
        {mutation.isError && (
          <span style={{ color: 'red' }}>
            Failed to add item! {mutation.error?.message}
          </span>
        )}
      </p>
    </div>
  );
}
