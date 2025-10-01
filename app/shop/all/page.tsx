import Image from 'next/image';
import AddToCartButton from '@/ui/components/Button/AddToCartButton';

// React Server Component - Force dynamic to avoid build-time fetch
export const dynamic = 'force-dynamic';

export default async function All() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  /* 
  -- Static SSR unless marked as dynamic with... -- 
  // ISR - Incremental Static ReGeneration
  export const revalidate = 3600;
  const data = await fetch('/api/data', {
    next: { revalidate: 0 }  // Forces SSR
    });
    
    - or -
    
    const data = await fetch('/api/data', {
      cache: 'no-cache'
      });
      */

  // Static data fetching method

  const res = await fetch(`${baseUrl}/api/pies?category=all`);
  const pies = await res.json();

  return (
    <>
      <section className="main-content">
        <h2>Shop for all cakes</h2>
        <div className="gallery-wrapper">
          {pies.map((pie: any) => (
            <div key={pie.id} className="pie-item">
              <Image
                src={pie.imageUrl}
                alt={pie.name}
                width={500}
                height={300}
              />
              <AddToCartButton
                id={pie.id}
                name={pie.name}
                price={pie.price}
                imageUrl={pie.imageUrl}
              />
              <div className="pie-info">
                <h4>{pie.name}</h4>
                <p>${pie.price.toFixed(2)}</p>
                {pie.lastUpdated && (
                  <small style={{ color: 'gray', fontSize: '12px' }}>
                    Last updated: {pie.lastUpdated}
                  </small>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
