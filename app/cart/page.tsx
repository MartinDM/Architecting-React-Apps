'use client';
import Image from 'next/image';
import { CartItem } from '../../types/types';
import useSWR from 'swr';
import QuantitySelector from '../../ui/components/QuantitySelector/QuantitySelector';

export default function Cart() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  // Destruct from useSWR
  const {
    data: cartItems,
    error,
    mutate,
  } = useSWR<CartItem[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`,
    fetcher,
    { revalidateOnFocus: true } // auto re-fetch when window is focussed
  );

  if (error) return <div>Error</div>;
  if (!cartItems) return <div>Loading cart items</div>;

  return (
    <section className="main-content">
      <h2>
        Shopping Cart
        <hr />
      </h2>
      <div className="cart-wrapper">
        <div className="cart-items-wrapper">
          {cartItems?.length === 0 ? (
            <p>Basket is empty</p>
          ) : (
            cartItems.map((item: CartItem) => {
              return (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image-wrapper">
                    <Image
                      width={100}
                      height={100}
                      alt={item.name}
                      src={item.imageUrl}
                    />
                  </div>
                  <div className="cart-item-image-wrapper">
                    <p className="cart-itemn-ame"></p>
                    <div className="quantity-selector-wrapper">
                      <QuantitySelector
                        imageUrl={item.imageUrl}
                        name={item.name}
                        price={item.price}
                        id={item.id}
                        quantity={item.quantity}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
