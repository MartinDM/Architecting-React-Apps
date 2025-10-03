'use client';
import Link from 'next/link';
import Image from 'next/image';
import { CartItem } from '@/types/types';
import React, { useState } from 'react';
import useSWR from 'swr';
import cartIcon from '../../../public/images/cart-icon.png';

export default function CartIndicator() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  // Get cart data from SWR cache - this is shared across all components
  const { data: cartItems } = useSWR<CartItem[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );

  const cartQtyTotal =
    cartItems?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  // See SWR in action!
  console.log(
    '🛒 CartIndicator - Total items:',
    cartQtyTotal,
    'Cart data:',
    cartItems
  );

  return (
    <>
      <Link href="/cart">
        {cartQtyTotal}
        <Image src={cartIcon} alt="shopping cart icon" />
      </Link>
    </>
  );
}
