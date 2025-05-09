"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Función para actualizar el estado
    const updateMatches = () => {
      setMatches(media.matches);
    };

    // Configurar estado inicial
    updateMatches();

    // Agregar listener para cambios de tamaño
    media.addEventListener("change", updateMatches);

    // Limpieza
    return () => {
      media.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}
