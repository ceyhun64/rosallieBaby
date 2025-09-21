import ProductToolbar from "./productToolBar";

// Server-side fetch
async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store",
  });
  console.log("res:", res);

  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch error:", text);
    throw new Error(`Fetch failed with status ${res.status}`);
  }

  const data = await res.json();
  return data.products;
}

export default async function AllProducts() {
  const products = await getProducts(); // server-side fetch

  return (
    <main className="p-4 md:p-8">
      <header className="flex items-center gap-2 mb-4">
        <h1 className="text-3xl font-semibold">All Products</h1>
        <span className="text-gray-600 text-lg">
          ({products.length} products)
        </span>
      </header>

      <section>
        <ProductToolbar products={products} />
      </section>
    </main>
  );
}
