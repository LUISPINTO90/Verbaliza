import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acceso completo a rutas de autenticación, assets estáticos y archivos del sistema
  if (
    // Rutas de autenticación
    pathname.startsWith("/api/auth") ||
    // Archivos estáticos de Next.js
    pathname.startsWith("/_next") ||
    pathname.startsWith("/__next") ||
    // Assets del directorio public
    pathname.startsWith("/logo") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    // Otros archivos estáticos comunes
    (pathname.includes(".") && !pathname.includes("/api/")) ||
    // Página principal (permitir acceso sin autenticación)
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Verificar autenticación para rutas protegidas
  const session = await auth();

  if (!session) {
    // Redirigir a la página principal si no está autenticado
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|logo|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)",
  ],
};
