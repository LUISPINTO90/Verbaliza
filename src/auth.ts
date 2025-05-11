import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

// Crea una configuración que no utilice el adaptador cuando esté en el middleware
const isInMiddleware = typeof process.env.NEXT_RUNTIME === "string";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: isInMiddleware ? undefined : PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/", // Usamos la página principal como login
    error: "/", // Página de error (opcional)
  },
  debug: process.env.NODE_ENV === "development", // Habilitar logs en desarrollo
  callbacks: {
    async signIn({ user, account }) {
      // No ejecutar esta lógica en el middleware
      if (isInMiddleware) return true;

      // Si el usuario ya existe y está intentando iniciar sesión con Google
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { accounts: true },
        });

        // Si el usuario existe pero no tiene una cuenta Google vinculada
        if (
          existingUser &&
          !existingUser.accounts.some(
            (acc: { provider: string }) => acc.provider === "google"
          )
        ) {
          // Actualizar usuario con datos de Google
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: user.name,
              image: user.image,
            },
          });
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async authorized({ auth }) {
      // Simplificamos para el middleware
      return !!auth;
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validar que hay credenciales
        if (!credentials?.email || !credentials?.password) {
          console.log("Credentials missing");
          return null;
        }

        try {
          const email = credentials.email as string;
          const password = credentials.password as string;

          // Buscar usuario por email
          const user = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
          });

          // Si no existe usuario
          if (!user) {
            console.log("User not found");
            return null;
          }

          // Verificar si es una cuenta de Google
          const hasGoogleAccount = user.accounts.some(
            (acc: { provider: string }) => acc.provider === "google"
          );

          if (hasGoogleAccount && !user.password) {
            console.log("Google account without password");
            return null;
          }

          // Verificar que tiene contraseña
          if (!user.password) {
            console.log("No password");
            return null;
          }

          // Verificar contraseña
          const isValid = await compare(password, user.password);
          if (!isValid) {
            console.log("Invalid password");
            return null;
          }

          // Devolver el objeto de usuario
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (e) {
          console.error("Error in authorize:", e);
          return null;
        }
      },
    }),
  ],
});
