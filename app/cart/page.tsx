'use client';
import Image from 'next/image';
import { CartItem } from '../../types/types';
import QuantitySelector from '../../ui/components/QuantitySelector/QuantitySelector';
import { endpoints } from '../../lib/constants';
import { useQuery } from '@tanstack/react-query';

export default function Cart() {
  const url = endpoints.cart;

  const { data, isLoading, error, isError, isPending } = useQuery<CartItem[]>({
    queryKey: ['cartItems'],
    queryFn: () => fetch(url).then((res) => res.json()),
  });

  if (isError) return <div>Error {error}</div>;
  if (isLoading) return <div>Loading cart items</div>;

  return (
    <section className="main-content">
      <h2>
        Shopping Cart
        <hr />
      </h2>
      <div className="cart-wrapper">
        <div className="cart-items-wrapper">
          {data?.length === 0 ? (
            <p>Basket is empty</p>
          ) : (
            data?.map((item: CartItem) => {
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
