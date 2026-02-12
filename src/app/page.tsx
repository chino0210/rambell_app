import prisma from "@/lib/prisma";
import SearchFilters from "./(escritos)/search-filter";
import EscritosFeed from "./(escritos)/escritoFeed";
import TopViewsSlide from "./(escritos)/top-views-slide";
import LogoutButton from "./(usuarios)/cuenta/logout-button";
import NewNavBar from "@/components/elements/newNavBar";

export default async function EscritosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // --- LÓGICA DE DATOS (Se queda aquí por ser Server Component) ---
  const porPagina = 24;
  const paginaActual = Number(params.page) || 1;
  const skip = (paginaActual - 1) * porPagina;

  const query = params.query ? String(params.query) : "";
  const categoriaFilter = (params.category as string) || "TODAS";
  const autorFilter = (params.autor as string) || "";
  const statusFilter = (params.status as string) || "TODOS";

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

  return (
    <main className="container mx-auto max-w-full">
      <header className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Título Principal */}
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
              RAMBELL
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#24FFD4] to-[#00eeff98]">
                PAGE
              </span>
            </h1>

            {/* Descripción */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Pagina implementada para encontrar cualquier articulo y escrito
              para su estudio.
            </p>
          </div>
        </div>
      </header>
      <div>
        <div className="px-12">
          <h2 className="font-bold text-4xl py-8">
            Bienvenido al repositorio RAMBELL
          </h2>
          {/* Sección de Más Vistos */}
          <TopViewsSlide />

          <div>
            <h2 className="font-bold text-4xl py-8">
              Todos los escritos disponibles:
            </h2>
            <aside className="mb-12 px-40">
              <SearchFilters
                autores={autoresUnicos}
                categorias={categoriasUnicas}
              />
            </aside>
            {/* Sección de Contenido (Feed + Paginación) */}
            <EscritosFeed
              escritos={escritos}
              totalPaginas={totalPaginas}
              paginaActual={paginaActual}
            />
          </div>
          {/* Sección de Filtros */}
        </div>
      </div>
    </main>
  );
}
