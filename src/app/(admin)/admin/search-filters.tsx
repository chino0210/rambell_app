"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface AdminSearchFiltersProps {
  autores: string[];
  tags: string[];
}

export default function AdminSearchFilters({
  autores,
  tags,
}: AdminSearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset page to 1 when filters change
    if (key !== 'page') {
      params.set('page', '1');
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full flex flex-wrap gap-4 bg-white p-4 shadow-sm rounded-xl border">
      {/* Búsqueda por Texto */}
      <div className="flex-1 min-w-50">
        <label className="text-xs font-bold uppercase text-gray-500 ml-1">
          Título del escrito
        </label>
        <input
          type="text"
          placeholder="Buscar por título..."
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => handleSearch("query", e.target.value)}
        />
      </div>

      {/* Select de Autores */}
      <div className="w-full md:w-48">
        <label className="text-xs font-bold uppercase text-gray-500 ml-1">
          Autor
        </label>
        <select
          className="w-full border p-2 rounded-lg outline-none cursor-pointer"
          onChange={(e) => handleSearch("autor", e.target.value)}
          defaultValue={searchParams.get("autor")?.toString() || ""}
        >
          <option value="">Todos los autores</option>
          {autores.map((autor) => (
            <option key={autor} value={autor}>
              {autor}
            </option>
          ))}
        </select>
      </div>

      {/* Select de Estado */}
      <div className="w-full md:w-48">
        <label className="text-xs font-bold uppercase text-gray-500 ml-1">
          Estado
        </label>
        <select
          className="w-full border p-2 rounded-lg outline-none cursor-pointer"
          onChange={(e) => handleSearch("status", e.target.value)}
          defaultValue={searchParams.get("status")?.toString() || "TODOS"}
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PUBLICADO">Publicado</option>
          <option value="BORRADOR">Borrador</option>
        </select>
      </div>
    </div>
  );
}
