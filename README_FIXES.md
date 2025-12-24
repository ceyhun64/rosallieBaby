# 🛠️ RosallieBaby - Düzeltme Rehberi

**Oluşturulma Tarihi**: 23 Aralık 2025  
**Site**: rosalliebaby.com

Bu dosya, sitede tespit edilen eksiklikleri ve nasıl düzeltileceğini açıklar.

---

## 🔴 KRİTİK DÜZELTMELER

### 1. Order API'de "MODA PERDE" Metinleri

**Dosya**: `app/api/order/route.js`

Mail içeriklerinde yanlış marka adı kullanılmış. Aşağıdaki satırları bul ve değiştir:

| Satır | Eski | Yeni |
|-------|------|------|
| 229 | `**MODA PERDE** üzerinden vermiş olduğunuz` | `**Rosallie Baby** üzerinden vermiş olduğunuz` |
| 263 | `**MODA PERDE Ekibi**` | `**Rosallie Baby Ekibi**` |
| 270 | `["modaperdeofficial@gmail.com"]` | `["YOUR_ADMIN_EMAIL@gmail.com"]` |
| 426 | `**MODA PERDE Ekibi**` | `**Rosallie Baby Ekibi**` |
| 454 | `["modaperdeofficial@gmail.com"]` | `["YOUR_ADMIN_EMAIL@gmail.com"]` |

---

### 2. Sitemap'e Blanket Kategorisi Ekle

**Dosya**: `app/sitemap.js`

**Satır 49-53** - Mevcut:
```javascript
const categories = [
  "hospital_outfit_special_set",
  "hospital_outfit_set",
  "toy",
];
```

**Değiştir**:
```javascript
const categories = [
  "hospital_outfit_special_set",
  "hospital_outfit_set",
  "toy",
  "blanket",
];
```

---

## 🟡 ORTA ÖNCELİK DÜZELTMELER

### 3. Footer Sosyal Medya Linkleri

**Dosya**: `components/layout/footer.jsx`

**Satır 188-231** - `href="#"` olan linkleri gerçek URL'ler ile değiştir:

```jsx
// Facebook (satır ~188)
href="https://www.facebook.com/rosalliebaby"

// TikTok (satır ~210)
href="https://www.tiktok.com/@rosalliebaby"

// Pinterest (satır ~222)
href="https://www.pinterest.com/rosalliebaby"
```

---

### 4. OG Image Kontrolü

**Dosya**: `public/og-image.jpg`

- 1200x630 piksel boyutunda olmalı
- Yoksa oluşturup `public/` klasörüne ekle

---

### 5. next.config.js Güncelle (Deprecation)

**Dosya**: `next.config.js`

**Mevcut**:
```javascript
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
};
```

**Değiştir**:
```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};
```

---

### 6. Blog Sitemap Dinamik Yap (Opsiyonel)

**Dosya**: `app/sitemap.js`

**Satır 70-90** - Statik blog yazılarını dinamik hale getir:

```javascript
// Mevcut statik blog yazıları yerine:
let blogPosts = [];
try {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
  blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
} catch (error) {
  console.error("Error fetching blog posts for sitemap:", error);
}
```

---

## 🟢 DÜŞÜK ÖNCELİK İYİLEŞTİRMELER

### 7. ProductDetail Rating Dinamik Yap

**Dosya**: `components/products/productDetail.jsx`

**Satır 334** - Statik rating yerine dinamik hesapla:

**Mevcut**:
```jsx
<span className="text-gray-500 text-[13px]">4.9 (127 reviews)</span>
```

**Değiştir**:
```jsx
<span className="text-gray-500 text-[13px]">
  {product.reviews?.length > 0 
    ? `${(product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length).toFixed(1)} (${product.reviews.length} reviews)`
    : "No reviews yet"}
</span>
```

---

## ✅ KONTROL LİSTESİ

Düzeltmeleri yaptıktan sonra işaretle:

- [ ] Order API - MODA PERDE → Rosallie Baby
- [ ] Order API - Admin mail adresi güncellendi
- [ ] Sitemap - blanket kategorisi eklendi
- [ ] Footer - Sosyal medya linkleri güncellendi
- [ ] OG Image - 1200x630 kontrol/eklendi
- [ ] next.config.js - remotePatterns güncellendi
- [ ] Blog sitemap - dinamik yapıldı (opsiyonel)
- [ ] ProductDetail - rating dinamik yapıldı (opsiyonel)

---

## 🚀 DEPLOYMENT SONRASI

1. `npm run build` ile build al
2. Sitemap kontrolü: `https://rosalliebaby.com/sitemap.xml`
3. Test siparişi ver ve mail kontrolü yap
4. Google Search Console'da sitemap güncelle

---

**Hazırlayan**: AI Assistant  
**Tarih**: 23 Aralık 2025
