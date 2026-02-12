import React from "react";
import ListaEscritos from "./escrito/Lista/listaEscritos";
import AdminSearchFilters from "./search-filters";
import prisma from "@/lib/prisma";
import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string; autor?: string; status?: string }>;
}) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/escrito");
  }

  const { page, query, autor, status } = await searchParams;
  const currentPage = parseInt(page || "1");
  const itemsPerPage = 10;
  const skip = (currentPage - 1) * itemsPerPage;

  // Construir filtros de búsqueda
  const where: any = {};

  if (query) {
    where.titulo_escrito = {
      contains: query,
      mode: 'insensitive'
    };
  }

  if (autor) {
    where.autor = {
      name: {
        contains: autor,
        mode: 'insensitive'
      }
    };
  }

  if (status && status !== "TODOS") {
    where.status = status;
  }

  const [escritos, totalEscritos, autores, tags] = await Promise.all([
    prisma.escrito.findMany({
      where,
      include: { autor: true, tags: true },
      skip,
      take: itemsPerPage,
      orderBy: { createdAt: "desc" },
    }),
    prisma.escrito.count({ where }),
    prisma.autor.findMany({ select: { name: true } }),
    prisma.tag.findMany({ select: { name: true } }),
  ]);

  const totalPages = Math.ceil(totalEscritos / itemsPerPage);
  const autoresList = autores.map(a => a.name).filter(Boolean);
  const tagsList = tags.map(t => t.name);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header con degradado */}
      <header className="relative overflow-hidden bg-slate-950 py-16 sm:py-24">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
              RAMBELL{" "}
              <span className="uppercase text-transparent bg-clip-text bg-linear-to-r from-[#24FFD4] to-[#00eeff98]">
                ADMIN
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Panel de control: Edite, maneje y modifique cualquier aspecto de
              la plataforma.
            </p>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Administrar Escritos
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Gestione el contenido publicado y borradores.
            </p>
          </div>

          {/* BOTÓN NOTORIO */}
          <Button
            asChild
            size="lg"
            className="rounded-2xl bg-slate-950 px-8 py-6 text-md font-bold text-white shadow-xl shadow-indigo-200 hover:bg-slate-500 hover:scale-[1.02] transition-all active:scale-95"
          >
            <Link href="/admin/escrito/crear" className="flex items-center gap-2">
              Crear nuevo escrito
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-2xl bg-slate-950 px-8 py-6 text-md font-bold text-white shadow-xl shadow-indigo-200 hover:bg-slate-500 hover:scale-[1.02] transition-all active:scale-95"
          >
            <Link href="/admin/autores" className="flex items-center gap-2">
              Editar Autores
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-2xl bg-slate-950 px-8 py-6 text-md font-bold text-white shadow-xl shadow-indigo-200 hover:bg-slate-500 hover:scale-[1.02] transition-all active:scale-95"
          >
            <Link href="/admin/etiquetas" className="flex items-center gap-2">
              Editar Etiquetas
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Filtros de búsqueda */}
          <AdminSearchFilters autores={autoresList} tags={tagsList} />

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <ListaEscritos
              iniciales={escritos}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalEscritos}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
