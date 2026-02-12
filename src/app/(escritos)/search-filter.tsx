"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SearchFiltersProps {
  autores: string[];
  categorias: string[];
}

export default function SearchFilters({
  autores,
  categorias,
}: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search); // Usar window para asegurar valores frescos

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Usamos replace en lugar de push para que no llene el historial de "atrás" con cada letra
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full flex flex-wrap gap-4 bg-white p-4 shadow-sm rounded-xl border">
      {/* Búsqueda por Texto */}
      <div className="flex-1 min-w-[200px]">
        <label className="text-xs font-bold uppercase text-gray-500 ml-1">
          Título
        </label>
        <input
          type="text"
          placeholder="Ej: Amparo ambiental..."
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => handleSearch("query", e.target.value)}
        />
      </div>

      {/* Select de Autores Dinámico */}
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

      {/* Select de Categorías Dinámico */}
      <div className="w-full md:w-48">
        <label className="text-xs font-bold uppercase text-gray-500 ml-1">
          Categoría
        </label>
        <select
          className="w-full border p-2 rounded-lg outline-none cursor-pointer"
          onChange={(e) => handleSearch("category", e.target.value)}
          defaultValue={searchParams.get("category")?.toString() || "TODAS"}
        >
          <option value="TODAS">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
