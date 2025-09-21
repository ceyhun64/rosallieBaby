import ProductToolbar from "./productToolBar";
import { Label } from "@/components/ui/label";
import Breadcrumb from "@/components/layout/breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";

// Server-side fetch fonksiyonu
async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/category/hospital_outfit_set`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch error:", text);
    throw new Error(`Fetch failed with status ${res.status}`);
  }

  const data = await res.json();
  return data.products;
}

// SSR component
export default async function HospitalOutfitSet() {
  const products = await getProducts(); // server-side fetch

  // useIsMobile hook sadece client-side çalışır, bu yüzden conditional render ile kullanabiliriz
  let isMobile = false;
  if (typeof window !== "undefined") {
    isMobile = useIsMobile();
  }

  return (
    <div className="p-4 md:p-8">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Başlık + ürün sayısı */}
      <div className="flex items-center gap-2 mb-4">
        <Label
          className={`text-3xl font-semibold ${
            isMobile ? "text-xl" : "text-3xl"
          }`}
        >
          Hospital Outfit Set
        </Label>
        <span className="text-gray-600 text-lg">
          ({products.length} products)
        </span>
      </div>

      {/* Ürün listesi */}
      <ProductToolbar products={products} />
    </div>
  );
}
