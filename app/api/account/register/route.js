import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, surname, email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email zaten kayıtlı" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, surname, email, password: hashedPassword },
    });

    return new Response(
      JSON.stringify({
        message: "Kayıt başarılı",
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Kayıt başarısız" }), {
      status: 500,
    });
  }
}
