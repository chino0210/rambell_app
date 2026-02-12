"use client";

import Link from "next/link";
import { deleteEscritoAction } from "../escrito-actions";
import { Pencil, Trash2, User, Hash, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // Asumiendo que usas Shadcn UI
import { useRouter, useSearchParams } from "next/navigation";

export default function ListaEscritos({
  iniciales,
  currentPage,
  totalPages,
  totalItems
}: {
  iniciales: any[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (iniciales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl text-muted-foreground">
        <AlertCircle className="h-10 w-10 mb-2 opacity-20" />
        <p>No hay escritos disponibles.</p>
      </div>
    );
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Info de paginación */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Mostrando {iniciales.length} de {totalItems} escritos
        </p>
        <p>
          Página {currentPage} de {totalPages}
        </p>
      </div>

      {/* Lista de escritos */}
      <div className="grid gap-4">
        {iniciales.map((escrito) => (
          <div
            key={escrito.id}
            className="group flex items-center justify-between p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="space-y-2">
              <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                {escrito.titulo_escrito}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {/* CORRECCIÓN: usamos escrito.autor.name */}
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{escrito.autor?.name || "Autor desconocido"}</span>
                </div>

                <div className="flex gap-2">
                  {escrito.tags?.map((t: any) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-[11px] font-medium text-secondary-foreground"
                    >
                      <Hash className="h-3 w-3 mr-0.5 opacity-50" />
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* BOTÓN EDITAR */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-9 px-3 border-input hover:bg-accent hover:text-accent-foreground"
              >
                <Link href={`admin/escrito/${escrito.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>

              {/* BOTÓN ELIMINAR */}
              <Button
                variant="destructive"
                size="sm"
                className="h-9 px-3 bg-red-50/10 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-colors"
                onClick={async () => {
                  if (
                    confirm(
                      `¿Estás seguro de eliminar "${escrito.titulo_escrito}"?`,
                    )
                  ) {
                    await deleteEscritoAction(escrito.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-10 h-10 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
