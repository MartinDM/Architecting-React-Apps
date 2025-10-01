import Image from 'next/image';
import AddToCartButton from '@/ui/components/Button/AddToCartButton';

export default async function Fruit() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(
    `${baseUrl}/api/pies?category=fruit`,
    { next: { revalidate: 60 } } // Revalidate every 60 seconds
  );

  // Separate revalidation for specific endpoints
  // This overrides with its own revalidation
  const data2 = await fetch(`${baseUrl}/api/pies?category=cheesecakes`, {
    next: { revalidate: 300 }, // 5 minutes
  });

  const pies = await res.json();

  return (
    <>
      <p>Page rendered at ${new Date().toLocaleTimeString()}</p>
      <section className="main-content">
        <h2>Shop for Fruit Pies</h2>
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
                <p>{pie.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
