import Image from 'next/image';
import AddToCartButton from '@/ui/components/Button/AddToCartButton';

export default async function Cheesecakes() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Using dynamic data fetching
  const res = await fetch(`${baseUrl}/api/pies?category=cheesecakes`, {
    cache: 'no-store', // don't save any data in a cache; always dyanmic for each request from the server
  });

  const pies = await res.json();

  return (
    <>
      <section className="main-content">
        <h2>Shop for Cheesecakes</h2>
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
