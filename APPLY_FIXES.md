# 🔧 APPLY FIXES - Kopyala Yapıştır Rehberi

Bu dosyada her düzeltme için **ÖNCE** ve **SONRA** kodları var.
Dosyayı aç, bul-değiştir (Ctrl+H) yap.

---

## FIX 1: app/api/order/route.js

### Bul ve Değiştir #1
```
ÖNCE:
**MODA PERDE** üzerinden vermiş olduğunuz

SONRA:
**Rosallie Baby** üzerinden vermiş olduğunuz
```

### Bul ve Değiştir #2
```
ÖNCE:
**MODA PERDE Ekibi**

SONRA:
**Rosallie Baby Ekibi**
```

### Bul ve Değiştir #3
```
ÖNCE:
["modaperdeofficial@gmail.com"]

SONRA:
["info@rosalliebaby.com"]
```

---

## FIX 2: app/sitemap.js

### Satır 49-53 - Bul:
```javascript
const categories = [
  "hospital_outfit_special_set",
  "hospital_outfit_set",
  "toy",
];
```

### Değiştir:
```javascript
const categories = [
  "hospital_outfit_special_set",
  "hospital_outfit_set",
  "toy",
  "blanket",
];
```

---

## FIX 3: components/layout/footer.jsx

### Bul #1 (Facebook - satır ~188):
```jsx
href="#"
aria-label="Facebook"
```

### Değiştir:
```jsx
href="https://www.facebook.com/rosalliebaby"
aria-label="Facebook"
```

### Bul #2 (TikTok - satır ~210):
```jsx
href="#"
aria-label="TikTok"
```

### Değiştir:
```jsx
href="https://www.tiktok.com/@rosalliebaby"
aria-label="TikTok"
```

### Bul #3 (Pinterest - satır ~222):
```jsx
href="#"
aria-label="Pinterest"
```

### Değiştir:
```jsx
href="https://www.pinterest.com/rosalliebaby"
aria-label="Pinterest"
```

---

## FIX 4: next.config.js

### Tüm dosyayı şununla değiştir:
```javascript
/** @type {import('next').NextConfig} */
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

export default nextConfig;
```

---

## FIX 5: components/products/productDetail.jsx

### Bul (satır ~334):
```jsx
<span className="text-gray-500 text-[13px]">4.9 (127 reviews)</span>
```

### Değiştir:
```jsx
<span className="text-gray-500 text-[13px]">
  {product.reviews?.length > 0 
    ? `${(product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length).toFixed(1)} (${product.reviews.length} reviews)`
    : "Be the first to review"}
</span>
```

---

## ✅ TAMAMLANDI

Tüm değişiklikleri yaptıktan sonra:

```bash
npm run build
npm run start
```

Test et:
1. Sipariş ver → Mail kontrolü (Rosallie Baby yazmalı)
2. /sitemap.xml → blanket kategorisi olmalı
3. Footer → Sosyal medya linkleri çalışmalı
