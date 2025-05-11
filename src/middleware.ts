export { auth as middleware } from "./auth";

export const config = {
  matcher: [
    // Protege rutas y excluye rutas públicas
    "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
  ],
};
