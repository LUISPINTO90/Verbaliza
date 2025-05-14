"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { JSONContent } from "@tiptap/react";
import { toast } from "sonner";

import WritingEditor from "@/components/editor/WritingEditor";
import Navbar from "@/components/home/Navbar";

interface ContentUpdate {
  text: string;
  json: JSONContent;
  html: string;
}

export default function WritePage() {
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  const handleEditorUpdate = (content: ContentUpdate) => {
    // Contar palabras (excluyendo espacios y títulos)
    const words = content.text.split(/\s+/).filter((word) => word.length > 0);
    setWordCount(words.length);

    // Auto-save simulation
    setLastSaved(new Date());
  };

  const handleSave = () => {
    toast.success("Artículo guardado exitosamente!");
    setLastSaved(new Date());
  };

  const handlePublish = () => {
    setIsPublished(!isPublished);
    toast.success(
      isPublished ? "Artículo despublicado" : "Artículo publicado!"
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header con navbar personalizado */}
      <Navbar
        onSave={handleSave}
        onPublish={handlePublish}
        lastSaved={lastSaved}
      />

      {/* Editor Container */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="bg-white">
          <WritingEditor onUpdate={handleEditorUpdate} />
        </div>
      </motion.main>

      {/* Footer Stats */}
      <footer className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{wordCount} palabras</span>
          <span>•</span>
          <span>{Math.ceil(wordCount / 200)} min de lectura</span>
        </div>
      </footer>
    </div>
  );
}
