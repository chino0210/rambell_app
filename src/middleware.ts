import NextAuth from "next-auth";
import authConfig from "./app/actions/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // 1. Si es una ruta de la API de Auth, NO HACER NADA
  if (nextUrl.pathname.startsWith("/api/auth")) return NextResponse.next();

  // 2. Definir rutas (Usa los nombres exactos de tus carpetas)
  const isAuthRoute = ["/login", "/register", "/registro"].includes(
    nextUrl.pathname,
  );
  const isPublicRoute =
    ["/", "/publico"].includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith("/escrito") ||
    nextUrl.pathname.startsWith("/escritos/"); // Rutas de escritos son públicas

  // 3. SI YA ESTÁ LOGUEADO y quiere ir a Login/Register -> Mandarlo a /cuenta
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/cuenta", nextUrl));
    }
    return NextResponse.next();
  }

  // 4. SI NO ESTÁ LOGUEADO y la ruta NO ES PÚBLICA -> Mandarlo a /login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Matcheamos todo excepto archivos estáticos
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
