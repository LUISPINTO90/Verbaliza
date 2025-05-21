// src/app/(authenticated)/write/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import TextEditor from "@/components/editor/TextEditor";
import Navbar from "@/components/home/Navbar";

export default function WritePage() {
  const [isPublished, setIsPublished] = useState(false);

  const handleEditorUpdate = () => {
    // Podríamos implementar un guardado automático aquí
  };

  const handleSave = () => {
    toast.success("Artículo guardado exitosamente!");
  };

  const handlePublish = () => {
    setIsPublished(!isPublished);
    toast.success(
      isPublished ? "Artículo despublicado" : "Artículo publicado!"
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar fijo en la parte superior */}
      <div className="sticky top-0 z-50">
        <Navbar onSave={handleSave} onPublish={handlePublish} />
      </div>

      {/* Editor */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <TextEditor onUpdate={handleEditorUpdate} />
      </motion.main>
    </div>
  );
}
