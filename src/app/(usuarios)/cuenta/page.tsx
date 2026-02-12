export const runtime = "nodejs";

import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { User, Mail, Shield, BookOpen, Settings } from "lucide-react";
import LogoutButton from "./logout-button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Pagination from "../../(escritos)/escrito/pagination";
import SearchFilters from "../../(escritos)/search-filter";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // 1. Obtener sesión
  const session = await auth();

  // 2. Proteger la ruta: Si no hay sesión o no hay ID, fuera.
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 3. Convertir ID de forma segura
  const userId = parseInt(session.user.id);

  // 4. Validación extra para Prisma
  if (isNaN(userId)) {
    console.log("Invalid user ID:", session.user.id);
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-bold">
          Error de sesión: ID de usuario no válido.
        </p>
        <LogoutButton />
      </div>
    );
  }

  // Pagination and search logic
  const porPagina = 10;
  const paginaActual = Number(params.page) || 1;
  const skip = (paginaActual - 1) * porPagina;
  const query = params.query ? String(params.query) : "";
  const autorFilter = (params.autor as string) || "";
  const categoriaFilter = (params.category as string) || "TODAS";

  // 5. Ahora sí, la consulta es segura
  let misGuardados;
  let totalGuardados;
  let allAutores;
  let allTags;
  try {
    const where: Record<string, any> = { userId: userId };
    const escritoWhere: Record<string, any> = {};
    if (query) {
      escritoWhere.titulo_escrito = { contains: query, mode: "insensitive" };
    }
    if (autorFilter) {
      escritoWhere.autor = { name: autorFilter };
    }
    if (categoriaFilter !== "TODAS") {
      escritoWhere.tags = { some: { name: categoriaFilter } };
    }
    if (Object.keys(escritoWhere).length > 0) {
      where.escrito = escritoWhere;
    }

    const [totalCount, guardados, autores, tags] = await Promise.all([
      prisma.guardado.count({ where }),
      prisma.guardado.findMany({
        where,
        include: {
          escrito: {
            include: { autor: true, tags: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: porPagina,
        skip: skip,
      }),
      prisma.guardado.findMany({
        where: { userId },
        include: {
          escrito: {
            include: { autor: true },
          },
        },
      }),
      prisma.guardado.findMany({
        where: { userId },
        include: {
          escrito: {
            include: { tags: true },
          },
        },
      }),
    ]);

    totalGuardados = totalCount;
    misGuardados = guardados;
    allAutores = autores;
    allTags = tags;
  } catch (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-bold">
          Error al cargar guardados. Inténtalo de nuevo.
        </p>
        <LogoutButton />
      </div>
    );
  }

  const autoresUnicos = [...new Set(allAutores.map((g) => g.escrito.autor.name))];
  const categoriasUnicas = [...new Set(allTags.flatMap((g) => g.escrito.tags.map((t) => t.name)))];

  const totalPaginas = Math.ceil(totalGuardados / porPagina);

  const { user } = session;

  return (
    <div className="max-w-full py-20">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Hola, {user?.name || "Usuario"}
              </h1>
              <p className="text-slate-500 text-sm">
                Gestiona tus lecturas guardadas
              </p>
            </div>
          </div>
          <LogoutButton />
        </header>

        {/* Search and Listado de guardados */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-150">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <BookOpen size={20} className="text-blue-500" /> Articulos
            guardados:
          </h2>

          {/* Search Filters */}
          <aside className="mb-12">
            <SearchFilters
              autores={autoresUnicos}
              categorias={categoriasUnicas}
            />
          </aside>

          <div className="grid gap-3">
            {misGuardados.length === 0 ? (
              <p className="text-slate-400 text-center py-10">
                {query || autorFilter || categoriaFilter !== "TODAS"
                  ? "No se encontraron guardados con estos filtros."
                  : "No hay guardados aún."}
              </p>
            ) : (
              misGuardados.map((item) => (
                <Link
                  href={`/escrito/${item.escrito.id}`}
                  key={item.id}
                  className="p-4 border rounded-xl hover:bg-slate-50 flex justify-between items-center"
                >
                  <span>{item.escrito.titulo_escrito}</span>
                  <ChevronRight size={16} />
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPaginas > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                totalPaginas={totalPaginas}
                paginaActual={paginaActual}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
