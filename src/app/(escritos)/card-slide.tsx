"use client";
import CardModel from "./card";

interface CardSlideProps {
  escritos: any[];
  statusFilter?: string;
  categoriaFilter?: string;
  searchQuery?: string;
  autorFilter?: string;
  code_names?: { code_name: string; categoria: string }[] | null;
  categorias?: string[];
}

// Función para normalizar texto removiendo acentos
const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export default function CardSlide({
  escritos,
  statusFilter = "TODOS",
  categoriaFilter = "TODAS",
  searchQuery = "",
  autorFilter = "",
  code_names,
}: CardSlideProps) {
  const escritosFiltrados = escritos?.filter((item) => {
    // Filtro de Status
    const cumpleStatus =
      statusFilter === "TODOS" || item.status === statusFilter;

    // Filtro de Categoría (Buscando dentro del array de tags de Prisma)
    const cumpleCategoria =
      categoriaFilter === "TODAS" ||
      item.tags?.some((tag: any) => tag.name === categoriaFilter) ||
      item.categoria?.name === categoriaFilter;

    // Filtro de code_names (si se proporciona, filtra por tags con esos code_names)
    const cumpleCodeNames =
      !code_names || code_names.length === 0 ||
      item.tags?.some((tag: any) => code_names.some((cn: any) => cn.code_name === tag.code_name));

    // Filtro de Búsqueda por Título (ignorando acentos)
    const normalizedSearchQuery = normalizeText(searchQuery);
    const cumpleQuery =
      searchQuery === "" ||
      normalizeText(item.titulo_escrito || '').includes(normalizedSearchQuery) ||
      normalizeText(item.resumen || '').includes(normalizedSearchQuery);

    // Filtro de Autor (ignorando acentos)
    const normalizedAutorFilter = normalizeText(autorFilter);
    const cumpleAutor =
      autorFilter === "" ||
      normalizeText(item.autor?.name || '').includes(normalizedAutorFilter);

    return cumpleStatus && cumpleCategoria && cumpleCodeNames && cumpleQuery && cumpleAutor;
  });

  return (
    <div className="w-full">
      <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
        {escritosFiltrados?.map((item) => (
          <div key={item.id}>
            <CardModel escrito={item} />
          </div>
        ))}
      </div>

      {escritosFiltrados?.length === 0 && (
        <div className="text-center py-20 w-full bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-400 text-lg">
            No se encontraron resultados para los filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
}
