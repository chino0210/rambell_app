// components/escrito-sidebar.tsx
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BookmarkIcon, Hash } from "lucide-react"; // Añadí Hash para un toque extra
import { BotonGuardar } from "@/components/elements/favorito-button";

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface SidebarProps {
  fecha: string;
  guardados: number;
  tags: Tag[];
  idDocumento: string;
}

export function EscritoSidebar({
  fecha,
  guardados,
  tags,
  idDocumento,
  initialIsGuardado,
}: SidebarProps & { initialIsGuardado: boolean }) {
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <aside className="sticky top-24 space-y-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
      {/* Botón Guardar con más énfasis */}
      <div className="space-y-4">
        <BotonGuardar
          idDocumento={idDocumento}
          initialIsGuardado={initialIsGuardado}
        />
        <p className="text-[11px] text-center text-slate-400 px-2 leading-relaxed">
          Accede a tus documentos guardados desde tu perfil.
        </p>
      </div>

      <hr className="border-slate-100" />

      {/* Metadata */}
      <div className="space-y-5">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
          Información
        </h3>

        <div className="flex items-center gap-4 text-slate-700">
          <div className="p-2 bg-blue-50 rounded-xl">
            <CalendarIcon className="size-4 text-blue-600" />
          </div>
          <span className="text-sm font-semibold">{fechaFormateada}</span>
        </div>

        <div className="flex items-center gap-4 text-slate-700">
          <div className="p-2 bg-red-50 rounded-xl">
            <BookmarkIcon className="size-4 text-red-600" />
          </div>
          <span className="text-sm font-semibold">
            {guardados || 0} personas lo guardaron
          </span>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* SECCIÓN DE ETIQUETAS AGRANDADA */}
      <div className="bg-slate-50/80 -mx-2 p-5 rounded-[2rem] border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="size-3 text-slate-400" />
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Etiquetas
          </h3>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {tags?.map((tag) => (
            <Badge
              key={tag.id}
              style={{ backgroundColor: tag.color }}
              className="border-none text-white rounded-xl px-4 py-2 text-[12px] font-bold shadow-sm hover:scale-105 transition-transform cursor-default"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Anuncios */}
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
          Anuncios:
        </h3>
        <div className="h-40 bg-slate-100/50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
            Espacio publicitario
          </span>
        </div>
      </div>
    </aside>
  );
}
