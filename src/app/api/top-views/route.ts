import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const codeNamesParam = searchParams.get("code_names");

  if (!codeNamesParam) {
    return NextResponse.json({ error: "code_names required" }, { status: 400 });
  }

  const codeNames = codeNamesParam.split(",");

  const where: Record<string, any> = { status: "PUBLICADO" };
  if (codeNames.length > 0) {
    where.tags = { some: { code_name: { in: codeNames } } };
  }

  const topEscritos = await prisma.escrito.findMany({
    where,
    take: 3,
    include: { tags: true, autor: true },
    orderBy: { views: "desc" },
  });

  return NextResponse.json(topEscritos);
}
