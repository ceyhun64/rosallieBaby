import { PrismaClient } from "../lib/generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Kullanıcı verileri
  const usersData = [
    {
      name: "Ali",
      surname: "Yılmaz",
      email: "ali@example.com",
      password: "123456",
    },
    {
      name: "Ayşe",
      surname: "Demir",
      email: "ayse@example.com",
      password: "654321",
    },
    {
      name: "Mehmet",
      surname: "Kaya",
      email: "mehmet@example.com",
      password: "password",
    },
  ];

  // Kullanıcıları hashlenmiş şifre ile oluştur
  const users = [];
  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.create({
      data: { ...u, password: hashedPassword },
    });
    users.push(user);
  }

  console.log("Kullanıcı seed tamamlandı!");

  // Ürün verileri
  const productsData = [
    {
      name: "Astronaut Muslin Hospital Outfit",
      mainImage: "/allProducts/product1main.webp",
      description:
        "Soft muslin outfit for newborns. Includes hat, gloves, bib, toy, jumpsuit, and pillowcase.",
      oldPrice: 2999,
      price: 2399,
      discount: 20,
      category: "hospital_outfit_set",
      subImages: [
        "/allProducts/product1sub1.webp",
        "/allProducts/product1sub2.webp",
        "/allProducts/product1sub3.webp",
      ],
    },
    {
      name: "Cute Baby Toy Set",
      mainImage: "/allProducts/product2main.webp",
      description: "Soft and colorful toy set for newborns.",
      oldPrice: 1499,
      price: 1199,
      discount: 20,
      category: "toy",
      subImages: [
        "/allProducts/product2sub1.webp",
        "/allProducts/product2sub2.webp",
      ],
    },
    {
      name: "Comfy Baby Pillow",
      mainImage: "/allProducts/product3main.webp",
      description: "Soft pillow for newborn comfort and safety.",
      oldPrice: 899,
      price: 699,
      discount: 22,
      category: "hospital_outfit_special_set",
      subImages: [
        "/allProducts/product3sub1.webp",
        "/allProducts/product3sub2.webp",
      ],
    },
    {
      name: "Hospital Essentials Set",
      mainImage: "/allProducts/product4main.webp",
      description: "Complete essentials set for newborn care in hospital.",
      oldPrice: 3999,
      price: 3499,
      discount: 13,
      category: "hospital_outfit_set",
      subImages: [
        "/allProducts/product4sub1.webp",
        "/allProducts/product4sub2.webp",
      ],
    },
    {
      name: "Colorful Rattle Toy",
      mainImage: "/allProducts/product5main.webp",
      description: "Fun and safe rattle toy for newborns.",
      oldPrice: 499,
      price: 399,
      discount: 20,
      category: "toy",
      subImages: ["/allProducts/product5sub1.webp"],
    },
    {
      name: "Soft Baby Blanket Pillow",
      mainImage: "/allProducts/product6main.webp",
      description: "Cozy blanket pillow for newborn naps.",
      oldPrice: 1299,
      price: 999,
      discount: 23,
      category: "hospital_outfit_special_set",
      subImages: [
        "/allProducts/product6sub1.webp",
        "/allProducts/product6sub2.webp",
      ],
    },
    {
      name: "Newborn Sleep Sack",
      mainImage: "/allProducts/product7main.webp",
      description: "Soft sleep sack to keep your baby cozy.",
      oldPrice: 1999,
      price: 1599,
      discount: 20,
      category: "hospital_outfit_set",
      subImages: ["/allProducts/product7sub1.webp"],
    },
    {
      name: "Baby Teether Set",
      mainImage: "/allProducts/product8main.webp",
      description: "Safe and colorful teethers for babies.",
      oldPrice: 599,
      price: 449,
      discount: 25,
      category: "toy",
      subImages: [
        "/allProducts/product8sub1.webp",
        "/allProducts/product8sub2.webp",
      ],
    },
    {
      name: "Plush Animal Pillow",
      mainImage: "/allProducts/product9main.webp",
      description: "Cute plush animal pillow for newborn comfort.",
      oldPrice: 1099,
      price: 849,
      discount: 23,
      category: "hospital_outfit_special_set",
      subImages: ["/allProducts/product9sub1.webp"],
    },
    {
      name: "Hospital Baby Care Set",
      mainImage: "/allProducts/product10main.webp",
      description: "Essential set for hospital baby care.",
      oldPrice: 4999,
      price: 4299,
      discount: 14,
      category: "hospital_outfit_set",
      subImages: [
        "/allProducts/product10sub1.webp",
        "/allProducts/product10sub2.webp",
      ],
    },
    {
      name: "Deluxe Muslin Hospital Special Outfit",
      mainImage: "/allProducts/product11main.webp",
      description:
        "Premium muslin hospital outfit set for newborns, including hat, blanket, and toy.",
      oldPrice: 5999,
      price: 4999,
      discount: 17,
      category: "hospital_outfit_special_set",
      subImages: [
        "/allProducts/product11sub1.webp",
        "/allProducts/product11sub2.webp",
        "/allProducts/product11sub3.webp",
      ],
    },
    {
      name: "Luxury Baby Hospital Essentials Set",
      mainImage: "/allProducts/product12main.webp",
      description: "Complete luxury essentials set for hospital newborn care.",
      oldPrice: 6999,
      price: 5899,
      discount: 16,
      category: "hospital_outfit_special_set",
      subImages: [
        "/allProducts/product12sub1.webp",
        "/allProducts/product12sub2.webp",
      ],
    },
    {
      name: "Premium Newborn Hospital Outfit Special",
      mainImage: "/allProducts/product13main.webp",
      description:
        "Special newborn outfit set with muslin fabric, hat, mittens, and toy.",
      oldPrice: 4499,
      price: 3799,
      discount: 15,
      category: "hospital_outfit_special_set",
      subImages: [
        "/allProducts/product13sub1.webp",
        "/allProducts/product13sub2.webp",
      ],
    },
  ];

  for (const p of productsData) {
    await prisma.product.create({
      data: {
        ...p,
        subImages: { create: p.subImages.map((url) => ({ url })) },
      },
    });
  }

  console.log("Ürün seed tamamlandı!");

  // Adres verileri
  const addressesData = [
    {
      userId: users[0].id,
      title: "Home",
      firstName: "Ali",
      lastName: "Yılmaz",
      address: "123 Main Street, Kadıköy",
      district: "Kadıköy",
      city: "Istanbul",
      zip: "34710",
      phone: "5551234567",
      country: "Turkey",
    },
    {
      userId: users[0].id,
      title: "Work",
      firstName: "Ali",
      lastName: "Yılmaz",
      address: "456 Office Street, Beşiktaş",
      district: "Beşiktaş",
      city: "Istanbul",
      zip: "34330",
      phone: "5559876543",
      country: "Turkey",
    },
    {
      userId: users[1].id,
      title: "Home",
      firstName: "Ayşe",
      lastName: "Demir",
      address: "789 Apartment Ave, Çankaya",
      district: "Çankaya",
      city: "Ankara",
      zip: "06510",
      phone: "5551112233",
      country: "Turkey",
    },
    {
      userId: users[2].id,
      title: "Home",
      firstName: "Mehmet",
      lastName: "Kaya",
      address: "101 New Street, Konak",
      district: "Konak",
      city: "Izmir",
      zip: "35000",
      phone: "5552223344",
      country: "Turkey",
    },
  ];

  for (const addr of addressesData) {
    await prisma.address.create({ data: addr });
  }

  console.log("Adres seed tamamlandı!");

  await prisma.settings.create({
    data: {
      logo: "/logo/logo.webp",
      heroBg: "/heroes/heroes1.webp",
      heroMobileBg: "/heroes/heroes2.webp",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
