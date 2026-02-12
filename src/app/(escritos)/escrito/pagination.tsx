"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Opcional: instalar lucide-react

interface PaginationProps {
  totalPaginas: number;
  paginaActual: number;
}

export default function Pagination({
  totalPaginas,
  paginaActual,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [goToPage, setGoToPage] = useState("");

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageInt = parseInt(goToPage);
    if (pageInt > 0 && pageInt <= totalPaginas) {
      router.push(createPageURL(pageInt));
      setGoToPage("");
    }
  };

  // Lógica para no mostrar 50 botones si hay muchas páginas
  const renderPaginas = () => {
    const paginas = [];
    const maxVisible = 5;

    if (totalPaginas <= maxVisible) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    } else {
      paginas.push(1);
      if (paginaActual > 3) paginas.push("...");

      const inicio = Math.max(2, paginaActual - 1);
      const fin = Math.min(totalPaginas - 1, paginaActual + 1);

      for (let i = inicio; i <= fin; i++) {
        if (!paginas.includes(i)) paginas.push(i);
      }

      if (paginaActual < totalPaginas - 2) paginas.push("...");
      if (!paginas.includes(totalPaginas)) paginas.push(totalPaginas);
    }
    return paginas;
  };

  if (totalPaginas < 1) return null;

  return (
    <nav
      aria-label="Navegación de páginas"
      className="flex flex-col sm:flex-row items-center justify-center gap-6 py-10"
    >
      <ul className="flex items-center -space-x-px shadow-sm rounded-md overflow-hidden">
        {/* Anterior */}
        <li>
          <Link
            href={paginaActual > 1 ? createPageURL(paginaActual - 1) : "#"}
            className={`flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 transition-colors ${
              paginaActual === 1 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Anterior</span>
          </Link>
        </li>

        {/* Números */}
        {renderPaginas().map((p, idx) => (
          <li key={idx}>
            {p === "..." ? (
              <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300">
                ...
              </span>
            ) : (
              <Link
                href={createPageURL(p)}
                className={`flex items-center justify-center w-10 h-10 leading-tight border transition-all ${
                  p === paginaActual
                    ? "z-10 text-white bg-blue-600 border-blue-600 font-bold"
                    : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {p}
              </Link>
            )}
          </li>
        ))}

        {/* Siguiente */}
        <li>
          <Link
            href={
              paginaActual < totalPaginas
                ? createPageURL(paginaActual + 1)
                : "#"
            }
            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 transition-colors ${
              paginaActual === totalPaginas
                ? "pointer-events-none opacity-40"
                : ""
            }`}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </li>
      </ul>

      {/* Ir a página específica */}
      <form onSubmit={handleJumpPage} className="flex items-center gap-3">
        <label htmlFor="jump" className="text-sm font-medium text-gray-600">
          Saltar a
        </label>
        <div className="relative">
          <input
            type="number"
            id="jump"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            className="w-16 p-2 text-sm text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow focus:shadow-md"
            placeholder="Nº"
          />
        </div>
        <button
          type="submit"
          className="text-sm px-3 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
        >
          Ir
        </button>
      </form>
    </nav>
  );
}
