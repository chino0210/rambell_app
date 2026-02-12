import prisma from "@/lib/prisma";
import SearchFilters from "../search-filter";
import CardSlide from "../card-slide";
import TopViewsSlide from "../top-views-slide";
import { especialidades } from "@/lib/especialidades";
import Pagination from "../escrito/pagination";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const params_search = await searchParams;

  // --- LÓGICA DE DATOS (Se queda aquí por ser Server Component) ---
  const porPagina = 24;
  const paginaActual = Number(params_search.page) || 1;
  const skip = (paginaActual - 1) * porPagina;

  const query = params_search.query ? String(params_search.query) : "";
  let categoriaFilter = (params_search.category as string) || "TODAS";
  const autorFilter = (params_search.autor as string) || "";
  const statusFilter = (params_search.status as string) || "TODOS";

  // Logic for special slugs
  const especialidad = especialidades.find((e) => e.slug === slug);
  let code_names: { code_name: string; categoria: string }[] | null = null;
  if (especialidad) {
    code_names = especialidad.code_names;
    categoriaFilter = "TODAS"; // Database already filters by code_names
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};
  if (query) {
    where.OR = [
      { titulo_escrito: { contains: query, mode: "insensitive" } },
      { resumen: { contains: query, mode: "insensitive" } },
    ];
  }
  if (categoriaFilter !== "TODAS") {
    where.tags = { some: { name: categoriaFilter } };
  }
  // For special slugs, also filter by code_names in the database query
  if (code_names && code_names.length > 0) {
    where.tags = {
      some: { code_name: { in: code_names.map((cn) => cn.code_name) } },
    };
  }
  if (autorFilter) {
    where.autor = { name: autorFilter };
  }
  if (statusFilter !== "TODOS") {
    where.status = statusFilter;
  }

  const [totalEscritos, escritos, allAutores, allTags] = await Promise.all([
    prisma.escrito.count({ where }),
    prisma.escrito.findMany({
      where,
      take: porPagina,
      skip: skip,
      include: { tags: true, autor: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.autor.findMany(),
    prisma.tag.findMany(),
  ]);

  const totalPaginas = Math.ceil(totalEscritos / porPagina);
  const autoresUnicos = allAutores.map((a) => a.name);
  const categoriasUnicas = allTags.map((t) => t.name);

  // Filter categories for special slugs
  let categoriasFiltradas = categoriasUnicas;
  if (especialidad) {
    categoriasFiltradas = especialidad.code_names.map((cn) => cn.categoria);
  }

  return (
    <main className="container max-w-full mb-10">
      <header className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Título Principal */}
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl flex flex-wrap justify-center gap-x-4">
              <span>REPOSITORIO</span>
              <span className="uppercase text-transparent bg-clip-text bg-linear-to-r from-[#24FFD4] to-[#00eeff98]">
                {slug}
              </span>
            </h1>

            {/* Descripción */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Descrubra los diferentes tipos de escritos que tenemos en la rama
              de {slug}.
            </p>
          </div>
        </div>
      </header>
      <div className="px-12">
        {/* Sección de Más Vistos */}
        <TopViewsSlide code_names={code_names} />

        {/* Sección de Filtros */}
        <aside className="mb-12 px-40">
          <SearchFilters
            autores={autoresUnicos}
            categorias={categoriasFiltradas}
          />
        </aside>

        {/* Sección de Contenido */}
        <CardSlide
          escritos={escritos}
          statusFilter={statusFilter}
          categoriaFilter={categoriaFilter}
          searchQuery={query}
          autorFilter={autorFilter}
          code_names={code_names}
          categorias={categoriasFiltradas}
        />

        {/* Paginación */}
        <div className="mt-12 flex justify-center border-t border-default-light pt-8">
          <Pagination totalPaginas={totalPaginas} paginaActual={paginaActual} />
        </div>
      </div>
    </main>
  );
}
