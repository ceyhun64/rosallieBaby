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
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gradient-to-br bg-gray-50 p-2 md:p-12">
      <div className="max-w-8xl mx-auto">
        {/* Elegant Header */}
        <header className="mb-12 p-4 md:p-0">
          <div className="flex items-baseline gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900">
              Our Collection
            </h1>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500 tracking-wider uppercase">
              Curated Selection
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span className="text-sm text-slate-600 font-light">
              {products.length} Exclusive Items
            </span>
          </div>
        </header>

        {/* Premium Content Area */}
        <section className="bg-white/70 md:p-4 ">
          <ProductToolbar products={products} />
        </section>

        {/* Decorative Element */}
        <div className="mt-8 flex justify-center">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>
      </div>
    </main>
  );
}
