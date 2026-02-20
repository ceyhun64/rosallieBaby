# Rosallie Baby

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.0-green)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)](https://www.mysql.com/)

Rosallie Baby, yeni doğan bebekler için premium hastane çıkış kıyafetleri, oyuncaklar ve bebek ürünleri satan modern bir e-ticaret platformudur. Organik malzemeler, güvenli tasarım ve hızlı teslimat ile ailelerin en mutlu anlarını kutluyoruz.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: Kayıt, giriş, profil yönetimi ve rol tabanlı yetkilendirme (Kullanıcı/Admin)
- **Ürün Yönetimi**: Kategorilere göre ürün listeleme, detay görüntüleme, stok takibi
- **Sepet ve Favoriler**: Kullanıcıların ürünleri sepete eklemesi ve favorilere alması
- **Sipariş İşlemleri**: Güvenli ödeme entegrasyonu (Iyzico), sipariş takibi ve geçmiş
- **Blog Sistemi**: Makaleler, kategoriler ve SEO optimizasyonu
- **Admin Paneli**: Ürün, sipariş, kullanıcı ve blog yönetimi
- **SEO ve Analitik**: Google Analytics, Meta Pixel, yapılandırılmış veri
- **Responsive Tasarım**: Mobil uyumlu, modern UI/UX (Radix UI + Tailwind CSS)
- **Çoklu Dil Desteği**: İngilizce ve Türkçe içerikler
- **Güvenlik**: NextAuth ile oturum yönetimi, şifre hashleme (bcrypt)

## 🛠 Teknoloji Yığını

### Frontend

- **Next.js 15**: React tabanlı full-stack framework
- **React 19**: Kullanıcı arayüzü bileşenleri
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Erişilebilir UI bileşenleri
- **Lucide React**: İkon seti
- **Motion**: Animasyonlar
- **React Hook Form + Zod**: Form validasyonu

### Backend

- **Next.js API Routes**: Server-side API endpoint'leri
- **Prisma 6**: ORM ve veritabanı yönetimi
- **MySQL**: Veritabanı
- **NextAuth 4**: Kimlik doğrulama
- **Iron Session**: Oturum yönetimi
- **Nodemailer**: E-posta gönderimi
- **Cloudinary**: Resim yükleme ve yönetimi

### Diğer Araçlar

- **Chart.js / Recharts**: Veri görselleştirme
- **Iyzico**: Ödeme entegrasyonu
- **Date-fns**: Tarih işlemleri
- **Sonner**: Bildirimler

## 📋 Gereksinimler

- Node.js 18+
- MySQL 8.0+
- npm veya yarn

## 🚀 Kurulum ve Çalıştırma

1. **Depoyu klonlayın:**

   ```bash
   git clone https://github.com/your-username/rosallie-baby.git
   cd rosallie-baby
   ```

2. **Bağımlılıkları yükleyin:**

   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın:**
   `.env.local` dosyasını oluşturun ve aşağıdaki değişkenleri ekleyin:

   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/rosallie_baby"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   IYZICO_API_KEY="your-iyzico-key"
   IYZICO_SECRET_KEY="your-iyzico-secret"
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
   META_PIXEL_ID="your-meta-pixel-id"
   ```

4. **Veritabanını hazırlayın:**

   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

5. **Geliştirme sunucusunu başlatın:**

   ```bash
   npm run dev
   ```

   Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📁 Proje Yapısı

```
rosallie-baby/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoint'leri
│   │   ├── auth/                 # Kimlik doğrulama
│   │   ├── products/             # Ürün yönetimi
│   │   ├── cart/                 # Sepet işlemleri
│   │   ├── order/                # Sipariş yönetimi
│   │   └── ...
│   ├── admin/                    # Admin paneli sayfaları
│   ├── blog/                     # Blog sayfaları
│   ├── cart/                     # Sepet sayfası
│   ├── checkout/                 # Ödeme sayfası
│   └── ...
├── components/                   # React bileşenleri
│   ├── ui/                       # Yeniden kullanılabilir UI bileşenleri
│   ├── home/                     # Ana sayfa bileşenleri
│   ├── admin/                    # Admin paneli bileşenleri
│   └── ...
├── contexts/                     # React context'ler
├── hooks/                        # Özel React hook'ları
├── lib/                          # Yardımcı kütüphaneler
│   ├── prisma.js                 # Prisma client
│   ├── session.js                # Oturum yönetimi
│   └── ...
├── prisma/                       # Veritabanı şeması ve migrasyonlar
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── public/                       # Statik dosyalar
├── utils/                        # Yardımcı fonksiyonlar
└── ...
```

## 🔌 API Endpoint'leri

### Kimlik Doğrulama

- `POST /api/auth/[...nextauth]` - NextAuth endpoint'i

### Ürünler

- `GET /api/products` - Tüm ürünleri listele
- `POST /api/products` - Yeni ürün ekle (Admin)
- `GET /api/products/[id]` - Ürün detayını getir
- `PUT /api/products/[id]` - Ürün güncelle (Admin)
- `DELETE /api/products/[id]` - Ürün sil (Admin)

### Sepet

- `GET /api/cart` - Kullanıcının sepetini getir
- `POST /api/cart` - Sepete ürün ekle
- `PUT /api/cart/[id]` - Sepet öğesini güncelle
- `DELETE /api/cart/[id]` - Sepetten ürün çıkar

### Siparişler

- `GET /api/order` - Kullanıcının siparişlerini listele
- `POST /api/order` - Yeni sipariş oluştur
- `GET /api/order/[id]` - Sipariş detayını getir

### Diğer

- `GET /api/blog` - Blog yazıları
- `POST /api/subscribe` - E-posta aboneliği
- `POST /api/upload` - Resim yükleme

## 🧪 Test

Proje şu anda manuel testlere odaklanmaktadır. Gelecek sürümlerde otomatik testler eklenecektir.

## 🚢 Dağıtım

1. **Build oluşturun:**

   ```bash
   npm run build
   ```

2. **Üretim sunucusunu başlatın:**
   ```bash
   npm start
   ```

### Vercel Dağıtımı

Proje Vercel için optimize edilmiştir. `vercel.json` konfigürasyonu ile kolayca dağıtabilirsiniz.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- Website: [https://rosalliebaby.com](https://rosalliebaby.com)
- Email: support@rosalliebaby.com
- Instagram: [@rosalliebaby](https://www.instagram.com/rosalliebaby)
- Facebook: [Rosallie Baby](https://www.facebook.com/rosalliebaby)

---

Rosallie Baby - Bebeğinizin en mutlu günü için ❤️
