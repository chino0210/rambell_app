// components/escritos/EscritosFeed.tsx
import CardSlide from "./card-slide";
import Pagination from "./escrito/pagination";

interface EscritosFeedProps {
  escritos: any[]; // Sustituye con tu tipo de Prisma
  totalPaginas: number;
  paginaActual: number;
}

export default function EscritosFeed({
  escritos,
  totalPaginas,
  paginaActual,
}: EscritosFeedProps) {
  return (
    <section>
      {/* Contenedor de las Cards */}
      <div className="min-h-100">
        {escritos.length > 0 ? (
          <CardSlide
            escritos={escritos}
            statusFilter="TODOS"
            categoriaFilter="TODAS"
            searchQuery=""
            autorFilter=""
          />
        ) : (
          <div className="text-center py-20 bg-neutral-secondary-medium rounded-lg border border-dashed border-default-medium">
            <p className="text-body italic">
              No se encontraron escritos con estos filtros.
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      <div className="mt-12 flex justify-center border-t border-default-light pt-8">
        <Pagination totalPaginas={totalPaginas} paginaActual={paginaActual} />
      </div>
    </section>
  );
}
