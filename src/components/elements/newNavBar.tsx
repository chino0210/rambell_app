"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { especialidades } from "@/lib/especialidades";
import CardModelNavBar from "@/app/(escritos)/card-navBar";
import LogoRambell from "../../../public/logo_rambell.svg";

export default function NavBarEtiquetas() {
  const { data: session, status } = useSession();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [topEscritos, setTopEscritos] = useState<any[]>([]);
  const [mounted, setMounted] = React.useState(false);

  const cacheRef = useRef(
    new Map<string, { data: any[]; timestamp: number }>(),
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => setMounted(true), []);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const menuItems = especialidades.map((especialidad) => ({
    id: especialidad.slug,
    label: especialidad.categoria,
    subs: especialidad.code_names.map((cn) => cn.categoria),
  }));

  const getMenuPositionClass = (index: number) => {
    const col = index % 6;
    if (col === 0) return "left-0 origin-top-left";
    if (col === 5) return "right-0 origin-top-right";
    if (col === 1) return "-left-[50%] lg:-left-[100%] origin-top-left";
    if (col === 4)
      return "-right-[50%] lg:-right-[100%] left-auto origin-top-right";
    return "left-1/2 -translate-x-1/2 origin-top";
  };

  useEffect(() => {
    if (activeMenu) {
      const especialidad = especialidades.find((e) => e.slug === activeMenu);
      if (especialidad) {
        const cachedEntry = cacheRef.current.get(activeMenu);
        if (
          cachedEntry &&
          Date.now() - cachedEntry.timestamp < 30 * 60 * 1000
        ) {
          setTopEscritos(cachedEntry.data);
        } else {
          const codeNames = especialidad.code_names
            .map((cn) => cn.code_name)
            .join(",");
          fetch(`/api/top-views?code_names=${codeNames}`)
            .then((res) => res.json())
            .then((data) => {
              cacheRef.current.set(activeMenu, { data, timestamp: Date.now() });
              setTopEscritos(data);
            })
            .catch(() => setTopEscritos([]));
        }
      }
    }
  }, [activeMenu]);

  if (!mounted) return <header className="bg-slate-950 h-30 w-full" />;

  return (
    <nav
      onMouseLeave={handleMouseLeave}
      className="fixed top-0 left-0 w-full z-50 bg-slate-950 shadow-2xl px-40"
    >
      {/* FILA SUPERIOR: LOGO Y CUENTA */}
      <div className="mx-auto flex items-center justify-between px-6 py-3 border-b border-white/5">
        <Link href="/" className="transition-transform hover:scale-105">
          <Image
            src={LogoRambell}
            alt="Logo"
            width={38}
            height={38}
            className="brightness-0 invert opacity-90"
          />
        </Link>

        <div className="flex items-center">
          {status === "authenticated" ? (
            <Link
              href="/cuenta"
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10"
            >
              <UserCircle size={16} className="text-blue-400" />
              Cuenta
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>

      {/* FILA INFERIOR: MENÚS DE ESPECIALIDADES */}
      <div className="grid grid-cols-3 md:grid-cols-6 w-full mx-auto">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item.id)}
          >
            <button
              className={`w-full flex items-center font-black justify-center py-5 transition-colors duration-300 ${
                activeMenu === item.id
                  ? "bg-[#1E293B] text-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-widest text-center px-2">
                {item.label}
              </span>
              {activeMenu === item.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 z-10 animate-in fade-in slide-in-from-bottom-1" />
              )}
            </button>

            {/* SUBMENÚ (Mantenido igual) */}
            <div
              className={`absolute top-full bg-white shadow-[0_40px_80px_rgba(0,0,0,0.45)] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) z-60
                ${activeMenu === item.id ? "max-h-[800px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95 pointer-events-none"}
                w-[95vw] md:w-[800px] lg:w-[1000px] xl:w-[1100px]
                ${getMenuPositionClass(index)}
              `}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 w-full border-t border-slate-100 text-slate-900">
                {/* Lado Izquierdo: Links */}
                <div className="md:col-span-4 p-8 bg-slate-50/90 border-r border-slate-100 text-left">
                  <ul className="space-y-4">
                    {item.subs.map((sub, i) => (
                      <li key={i}>
                        <Link
                          href={`/${item.id}?category=${encodeURIComponent(sub)}`}
                          className="text-slate-600 hover:text-blue-700 text-base font-semibold flex items-center group/link transition-all"
                        >
                          <span className="h-0.5 w-0 bg-blue-600 group-hover/link:w-4 transition-all mr-0 group-hover/link:mr-2" />
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${item.id}`}
                    className="mt-10 flex items-center justify-center px-6 py-3 bg-[#0F172A] text-white rounded-lg hover:bg-blue-600 transition-all text-[10px] font-bold uppercase tracking-widest"
                  >
                    Ver todo
                  </Link>
                </div>

                {/* Lado Derecho: Contenido */}
                <div className="md:col-span-8 p-8 bg-white text-left">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-bold text-[#0F172A] uppercase tracking-[0.2em]">
                      Lecturas Sugeridas
                    </h3>
                    <div className="h-px flex-1 bg-slate-100 ml-4"></div>
                  </div>

                  {topEscritos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-8">
                      {topEscritos.slice(0, 2).map((escrito) => (
                        <div
                          key={escrito.id}
                          className="hover:translate-y-1 transition-transform"
                        >
                          <CardModelNavBar escrito={escrito} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/40 text-slate-400 text-[10px] uppercase font-bold tracking-widest animate-pulse">
                      Cargando...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
