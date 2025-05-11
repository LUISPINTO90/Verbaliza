"use server";

import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterFormData } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// Comprobar si un email existe y con qué proveedor
export async function checkEmail(email: string) {
  try {
    // Verificar si el email existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (!existingUser) {
      return { exists: false };
    }

    // Verificar si tiene cuenta con Google
    const hasGoogleAccount = existingUser.accounts.some(
      (acc: { provider: string }) => acc.provider === "google"
    );

    if (hasGoogleAccount) {
      return { exists: true, provider: "google" };
    }

    return { exists: true, provider: "credentials" };
  } catch (error) {
    console.error("Error al comprobar email:", error);
    return { error: "Error al comprobar el email" };
  }
}

// Registrar un nuevo usuario
export async function registerUser(data: RegisterFormData) {
  try {
    // Verificar si el email existe
    const emailCheck = await checkEmail(data.email);

    if (emailCheck.exists) {
      if (emailCheck.provider === "google") {
        return { error: "google-exists" };
      }
      return { error: "email-exists" };
    }

    // Crear el usuario
    const hashedPassword = await hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    revalidatePath("/");

    // Solo devolver lo necesario, sin la contraseña
    return {
      success: true,
      userId: newUser.id,
      email: data.email,
    };
  } catch (error) {
    console.error("Error al registrar:", error);
    return { error: "unknown" };
  }
}

// Iniciar sesión con credenciales
export async function loginWithCredentials(credentials: {
  email: string;
  password: string;
}) {
  try {
    // Verificar si el email existe
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
      include: { accounts: true },
    });

    if (!user) {
      return { error: "invalid-credentials" };
    }

    // Verificar si tiene cuenta con Google
    const hasGoogleAccount = user.accounts.some(
      (acc: { provider: string }) => acc.provider === "google"
    );

    if (hasGoogleAccount && !user.password) {
      return { error: "google-account" };
    }

    // Verificar contraseña
    if (!user.password) {
      return { error: "invalid-credentials" };
    }

    const isPasswordValid = await compare(credentials.password, user.password);

    if (!isPasswordValid) {
      return { error: "invalid-credentials" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { error: "unknown" };
  }
}
