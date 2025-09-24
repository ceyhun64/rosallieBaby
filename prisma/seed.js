import { PrismaClient } from "../lib/generated/prisma/index.js"; // custom path
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: "Ali",
      surname: "Yılmaz",
      email: "ali@example.com",
      password: "123456", // raw şifre
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

  // Şifreleri hashle
  const hashedUsers = await Promise.all(
    users.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10),
    }))
  );

  await prisma.user.createMany({
    data: hashedUsers,
    skipDuplicates: true,
  });

  console.log("Kullanıcı seed tamamlandı!");
  // 1. ürün
  await prisma.product.create({
    data: {
      name: "Astronaut Muslin Hospital Outfit",
      mainImage: "/allProducts/product1main.webp",
      description:
        "Soft muslin outfit for newborns. Includes hat, gloves, bib, toy, jumpsuit, and pillowcase.",
      oldPrice: 2999,
      price: 2399,
      discount: 20,
      category: "hospital_outfit_set",
      subImages: {
        create: [
          { url: "/allProducts/product1sub1.webp" },
          { url: "/allProducts/product1sub2.webp" },
          { url: "/allProducts/product1sub3.webp" },
        ],
      },
    },
  });

  // 2. ürün
  await prisma.product.create({
    data: {
      name: "Cute Baby Toy Set",
      mainImage: "/allProducts/product2main.webp",
      description: "Soft and colorful toy set for newborns.",
      oldPrice: 1499,
      price: 1199,
      discount: 20,
      category: "toy",
      subImages: {
        create: [
          { url: "/allProducts/product2sub1.webp" },
          { url: "/allProducts/product2sub2.webp" },
        ],
      },
    },
  });

  // 3. ürün
  await prisma.product.create({
    data: {
      name: "Comfy Baby Pillow",
      mainImage: "/allProducts/product3main.webp",
      description: "Soft pillow for newborn comfort and safety.",
      oldPrice: 899,
      price: 699,
      discount: 22,
      category: "hospital_outfit_special_set", // pillow yerine
      subImages: {
        create: [
          { url: "/allProducts/product3sub1.webp" },
          { url: "/allProducts/product3sub2.webp" },
        ],
      },
    },
  });

  // 4. ürün
  await prisma.product.create({
    data: {
      name: "Hospital Essentials Set",
      mainImage: "/allProducts/product4main.webp",
      description: "Complete essentials set for newborn care in hospital.",
      oldPrice: 3999,
      price: 3499,
      discount: 13,
      category: "hospital_outfit_set",
      subImages: {
        create: [
          { url: "/allProducts/product4sub1.webp" },
          { url: "/allProducts/product4sub2.webp" },
        ],
      },
    },
  });

  // 5. ürün
  await prisma.product.create({
    data: {
      name: "Colorful Rattle Toy",
      mainImage: "/allProducts/product5main.webp",
      description: "Fun and safe rattle toy for newborns.",
      oldPrice: 499,
      price: 399,
      discount: 20,
      category: "toy",
      subImages: {
        create: [{ url: "/allProducts/product5sub1.webp" }],
      },
    },
  });

  // 6. ürün
  await prisma.product.create({
    data: {
      name: "Soft Baby Blanket Pillow",
      mainImage: "/allProducts/product6main.webp",
      description: "Cozy blanket pillow for newborn naps.",
      oldPrice: 1299,
      price: 999,
      discount: 23,
      category: "hospital_outfit_special_set", // pillow yerine
      subImages: {
        create: [
          { url: "/allProducts/product6sub1.webp" },
          { url: "/allProducts/product6sub2.webp" },
        ],
      },
    },
  });
  // 7. ürün
  await prisma.product.create({
    data: {
      name: "Newborn Sleep Sack",
      mainImage: "/allProducts/product7main.webp",
      description: "Soft sleep sack to keep your baby cozy.",
      oldPrice: 1999,
      price: 1599,
      discount: 20,
      category: "hospital_outfit_set",
      subImages: {
        create: [{ url: "/allProducts/product7sub1.webp" }],
      },
    },
  });

  // 8. ürün
  await prisma.product.create({
    data: {
      name: "Baby Teether Set",
      mainImage: "/allProducts/product8main.webp",
      description: "Safe and colorful teethers for babies.",
      oldPrice: 599,
      price: 449,
      discount: 25,
      category: "toy",
      subImages: {
        create: [
          { url: "/allProducts/product8sub1.webp" },
          { url: "/allProducts/product8sub2.webp" },
        ],
      },
    },
  });

  // 9. ürün
  await prisma.product.create({
    data: {
      name: "Plush Animal Pillow",
      mainImage: "/allProducts/product9main.webp",
      description: "Cute plush animal pillow for newborn comfort.",
      oldPrice: 1099,
      price: 849,
      discount: 23,
      category: "hospital_outfit_special_set", // pillow yerine
      subImages: {
        create: [{ url: "/allProducts/product9sub1.webp" }],
      },
    },
  });
  // 10. ürün
  await prisma.product.create({
    data: {
      name: "Hospital Baby Care Set",
      mainImage: "/allProducts/product10main.webp",
      description: "Essential set for hospital baby care.",
      oldPrice: 4999,
      price: 4299,
      discount: 14,
      category: "hospital_outfit_set",
      subImages: {
        create: [
          { url: "/allProducts/product10sub1.webp" },
          { url: "/allProducts/product10sub2.webp" },
        ],
      },
    },
  });
  // 11. ürün
  await prisma.product.create({
    data: {
      name: "Deluxe Muslin Hospital Special Outfit",
      mainImage: "/allProducts/product11main.webp",
      description:
        "Premium muslin hospital outfit set for newborns, including hat, blanket, and toy.",
      oldPrice: 5999,
      price: 4999,
      discount: 17,
      category: "hospital_outfit_special_set",
      subImages: {
        create: [
          { url: "/allProducts/product11sub1.webp" },
          { url: "/allProducts/product11sub2.webp" },
          { url: "/allProducts/product11sub3.webp" },
        ],
      },
    },
  });

  // 12. ürün
  await prisma.product.create({
    data: {
      name: "Luxury Baby Hospital Essentials Set",
      mainImage: "/allProducts/product12main.webp",
      description: "Complete luxury essentials set for hospital newborn care.",
      oldPrice: 6999,
      price: 5899,
      discount: 16,
      category: "hospital_outfit_special_set",
      subImages: {
        create: [
          { url: "/allProducts/product12sub1.webp" },
          { url: "/allProducts/product12sub2.webp" },
        ],
      },
    },
  });

  // 13. ürün
  await prisma.product.create({
    data: {
      name: "Premium Newborn Hospital Outfit Special",
      mainImage: "/allProducts/product13main.webp",
      description:
        "Special newborn outfit set with muslin fabric, hat, mittens, and toy.",
      oldPrice: 4499,
      price: 3799,
      discount: 15,
      category: "hospital_outfit_special_set",
      subImages: {
        create: [
          { url: "/allProducts/product13sub1.webp" },
          { url: "/allProducts/product13sub2.webp" },
        ],
      },
    },
  });

  console.log("10 seed ürünü başarıyla eklendi!");
}
const addresses = [
  {
    userId: 1, // Ali Yılmaz
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
    userId: 1, // Ali Yılmaz
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
    userId: 2, // Ayşe Demir
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
    userId: 3, // Mehmet Kaya
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

// Adresleri tek tek ekle
for (const addr of addresses) {
  await prisma.address.create({
    data: addr,
  });
}

console.log("Sahte adresler başarıyla eklendi!");

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
