'use client';
import useSWR from 'swr';
import React, { useState } from 'react';

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
  const [loading, setLoading] = useState(false);

  const { mutate } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`);

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application.json',
          },
          body: JSON.stringify({
            id,
            name,
            price,
            imageUrl,
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      await response.json();

      // Trigger SWR to refetch using mutate.
      // Prevents full page reload by updating the data on the client.
      // Updates the cart on the client side
      mutate();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-to-cart">
      <p>
        <button onClick={handleAddToCart} disabled={loading}>
          {loading ? 'Adding...' : '+ ADD TO CART'}
        </button>
      </p>
    </div>
  );
}
