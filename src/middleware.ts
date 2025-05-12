import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // Permitir acceso a rutas de autenticación y recursos estáticos
  if (
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon") ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Verificar autenticación para otras rutas
  const session = await auth();

  if (!session) {
    // Redirigir a la página principal si no está autenticado
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Proteger todas las rutas excepto las especificadas en la función
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
