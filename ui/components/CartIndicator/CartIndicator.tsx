'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { CartItem } from '@/types';
import React, { useState } from 'react';
import cartIcon from '../../../public/images/cart-icon.png';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '../../../lib/constants';

const url = endpoints.cart;

export default function CartIndicator() {
  const { data: cartItems } = useQuery<CartItem[]>({
    queryKey: ['cartItems'],
    queryFn: () => fetch(url).then((res) => res.json()),
  });

  const cartQtyTotal =
    cartItems?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <>
      <Link href="/cart">
        {cartQtyTotal}
        <Image src={cartIcon} alt="shopping cart icon" />
      </Link>
    </>
  );
}
