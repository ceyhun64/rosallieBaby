import { PrismaClient } from "../lib/generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminName = process.env.ADMIN_NAME;
  const adminSurname = process.env.ADMIN_SURNAME;

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

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: adminName,
        surname: adminSurname,
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN", // Enum role
      },
    });
    console.log("Admin kullanıcı oluşturuldu:", adminEmail);
  } else {
    console.log("Admin kullanıcı zaten mevcut:", adminEmail);
  }

  console.log("Kullanıcı seed tamamlandı!");

  // Ürün verileri
  const productsData = [
    // Önceki toy ürünleri
    {
      name: "Astronaut Muslin Hospital Outfit",
      mainImage: "/allProducts/toy1main.webp",
      description:
        "Soft muslin outfit for newborns. Includes hat, gloves, bib, toy, jumpsuit, and pillowcase.",
      oldPrice: 2999,
      price: 2399,
      discount: 20,
      category: "toy",
      subImages: [
        "/allProducts/toy1sub1.webp",
        "/allProducts/toy1sub2.webp",
        "/allProducts/toy1sub3.webp",
      ],
    },
    {
      name: "Cute Baby Toy Set",
      mainImage: "/allProducts/toy2main.webp",
      description: "Soft and colorful toy set for newborns.",
      oldPrice: 1499,
      price: 1199,
      discount: 20,
      category: "toy",
      subImages: ["/allProducts/toy2sub1.webp", "/allProducts/toy2sub2.webp"],
    },
    {
      name: "Colorful Rattle Toy",
      mainImage: "/allProducts/toy3main.webp",
      description: "Fun and safe rattle toy for newborns.",
      oldPrice: 499,
      price: 399,
      discount: 20,
      category: "toy",
      subImages: ["/allProducts/toy3sub1.webp"],
    },
    {
      name: "Baby Teether Set",
      mainImage: "/allProducts/toy4main.webp",
      description: "Safe and colorful teethers for babies.",
      oldPrice: 599,
      price: 449,
      discount: 25,
      category: "toy",
      subImages: ["/allProducts/toy4sub1.webp", "/allProducts/toy4sub2.webp"],
    },
    {
      name: "Soft Plush Toy Set",
      mainImage: "/allProducts/toy5main.webp",
      description: "Soft and cuddly plush toys for newborns.",
      oldPrice: 1299,
      price: 999,
      discount: 23,
      category: "toy",
      subImages: ["/allProducts/toy5sub1.webp", "/allProducts/toy5sub2.webp"],
    },

    // Yeni hospital_outfit_set ürünleri
    {
      name: "Newborn Hospital Essentials Set",
      mainImage: "/allProducts/hospital1main.webp",
      description: "Complete essentials set for hospital newborn care.",
      oldPrice: 3999,
      price: 3499,
      discount: 13,
      category: "hospital_outfit_set",
      subImages: [
        "/allProducts/hospital1sub1.webp",
        "/allProducts/hospital1sub2.webp",
        "/allProducts/hospital1sub3.webp",
      ],
    },
    {
      name: "Luxury Hospital Baby Care Set",
      mainImage: "/allProducts/hospital2main.webp",
      description: "Luxury newborn care set for hospital stay.",
      oldPrice: 5999,
      price: 4999,
      discount: 17,
      category: "hospital_outfit_set",
      subImages: [
        "/allProducts/hospital2sub1.webp",
        "/allProducts/hospital2sub2.webp",
      ],
    },
    {
      name: "Hospital Muslin Outfit Set",
      mainImage: "/allProducts/hospital3main.webp",
      description: "Muslin outfit including hat, mittens, and blanket.",
      oldPrice: 4499,
      price: 3799,
      discount: 15,
      category: "hospital_outfit_set",
      subImages: [
        "/allProducts/hospital3sub1.webp",
        "/allProducts/hospital3sub2.webp",
      ],
    },
    {
      name: "Complete Hospital Newborn Set",
      mainImage: "/allProducts/hospital4main.webp",
      description: "Everything needed for newborn care in hospital.",
      oldPrice: 6999,
      price: 5899,
      discount: 16,
      category: "hospital_outfit_set",
      subImages: [
        "/allProducts/hospital4sub1.webp",
        "/allProducts/hospital4sub2.webp",
        "/allProducts/hospital4sub3.webp",
      ],
    },
    {
      name: "Hospital Baby Comfort Set",
      mainImage: "/allProducts/hospital5main.webp",
      description: "Soft and cozy set for hospital newborn comfort.",
      oldPrice: 4999,
      price: 4299,
      discount: 14,
      category: "hospital_outfit_set",
      subImages: [
        "/allProducts/hospital5sub1.webp",
        "/allProducts/hospital5sub2.webp",
      ],
    },
    {
      name: "Newborn Hospital Essentials Set",
      mainImage: "/allProducts/hospital1main.webp",
      description: "Complete essentials set for hospital newborn care.",
      oldPrice: 3999,
      price: 3499,
      discount: 13,
      category: "hospital_outfit_special_set",
      subImages: [
        "/allProducts/hospital1sub1.webp",
        "/allProducts/hospital1sub2.webp",
        "/allProducts/hospital1sub3.webp",
      ],
    },
    {
      name: "Luxury Hospital Baby Care Set",
      mainImage: "/allProducts/hospital2main.webp",
      description: "Luxury newborn care set for hospital stay.",
      oldPrice: 5999,
      price: 4999,
      discount: 17,
      category: "hospital_outfit_special_set",
      subImages: [
        "/allProducts/hospital2sub1.webp",
        "/allProducts/hospital2sub2.webp",
      ],
    },
    {
      name: "Hospital Muslin Outfit Set",
      mainImage: "/allProducts/hospital3main.webp",
      description: "Muslin outfit including hat, mittens, and blanket.",
      oldPrice: 4499,
      price: 3799,
      discount: 15,
      category: "hospital_outfit_special_set",
      subImages: [
        "/allProducts/hospital3sub1.webp",
        "/allProducts/hospital3sub2.webp",
      ],
    },
    {
      name: "Complete Hospital Newborn Set",
      mainImage: "/allProducts/hospital4main.webp",
      description: "Everything needed for newborn care in hospital.",
      oldPrice: 6999,
      price: 5899,
      discount: 16,
      category: "hospital_outfit_special_set",
      subImages: [
        "/allProducts/hospital4sub1.webp",
        "/allProducts/hospital4sub2.webp",
        "/allProducts/hospital4sub3.webp",
      ],
    },
    {
      name: "Hospital Baby Comfort Set",
      mainImage: "/allProducts/hospital5main.webp",
      description: "Soft and cozy set for hospital newborn comfort.",
      oldPrice: 4999,
      price: 4299,
      discount: 14,
      category: "hospital_outfit_special_set",
      subImages: [
        "/allProducts/hospital5sub1.webp",
        "/allProducts/hospital5sub2.webp",
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
      heroBg: "/heroes/heroes2.jpg",
      heroMobileBg: "/heroes/heroes1.jpg",
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
