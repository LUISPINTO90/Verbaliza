import "next-auth";

declare module "next-auth" {
  /**
   * Extiende el tipo User predeterminado para incluir propiedades adicionales
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    password?: string | null;
  }

  /**
   * Extiende el tipo Session predeterminado para incluir propiedades adicionales
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
