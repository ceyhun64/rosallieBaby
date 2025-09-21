import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ user: null }), { status: 200 });
  }

  return new NextResponse(JSON.stringify({ user: session.user }), {
    status: 200,
  });
}
