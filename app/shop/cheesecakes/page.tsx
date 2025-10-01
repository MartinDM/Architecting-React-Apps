import { Suspense } from 'react';
import Image from 'next/image';
import AddToCartButton from '@/ui/components/Button/AddToCartButton';
import CheesecakesComponent from './cheesecakes';
import Loading from './Loading';

// Dynamic data fetching, no cache
export default function Cheesecakes() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <CheesecakesComponent />
      </Suspense>
    </>
  );
}
