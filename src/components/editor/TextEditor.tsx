// src/components/editor/TextEditor.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditorProps {
  onUpdate?: (content: { text: string }) => void;
}

export default function TextEditor({ onUpdate }: EditorProps) {
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  // Estilos personalizados para el placeholder de Tiptap
  useEffect(() => {
    // Agregar estilos CSS para el placeholder
    const style = document.createElement("style");
    style.innerHTML = `
      .is-editor-empty:first-child::before {
        content: 'Escribe tu historia...';
        float: left;
        color: rgba(163, 163, 163, 0.8); /* neutral-400 with 80% opacity */
        pointer-events: none;
        height: 0;
      }
      .ProseMirror p.is-editor-empty:first-child::before {
        content: 'Escribe tu historia...';
        float: left;
        color: rgba(163, 163, 163, 0.8); /* neutral-400 with 80% opacity */
        pointer-events: none;
        height: 0;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        heading: false, // Desactivar el heading de StarterKit para evitar duplicados
      }),
      Placeholder.configure({
        placeholder: "Escribe tu historia...",
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "is-node-empty",
      }),
      Heading.configure({
        levels: [1, 2],
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none py-2 text-lg md:text-xl text-neutral-700",
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate({ text: editor.getText() });
      }
    },
    immediatelyRender: false, // Para evitar errores de hidratación en SSR
  });

  const setLink = useCallback(() => {
    if (!editor || !linkUrl) return;

    // Verificar si el enlace tiene el protocolo, si no, agregarlo
    const url =
      linkUrl.startsWith("http://") || linkUrl.startsWith("https://")
        ? linkUrl
        : `https://${linkUrl}`;

    editor.chain().focus().setLink({ href: url }).run();

    // Limpiar y cerrar
    setLinkUrl("");
    setLinkDialogOpen(false);
  }, [editor, linkUrl]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative flex flex-col w-full space-y-6 px-4">
      {/* Etiqueta y campo de título */}
      <div className="flex flex-col space-y-4 mt-6">
        <label className="text-sm font-bold text-neutral-700">TÍTULO</label>
        <div
          className="border-l border-neutral-300 h-auto"
          style={{
            paddingLeft: "1rem",
            borderLeftWidth: "1px",
            height: "auto",
            minHeight: "auto",
          }}
        >
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Piensa un tema..."
            className="w-full resize-none overflow-hidden border-none bg-transparent text-3xl md:text-4xl font-semibold leading-tight outline-none focus:ring-0 text-neutral-700 placeholder:text-[#A3A3A3]"
            style={{
              minHeight: "2.5rem",
              height: "auto",
            }}
            onInput={(e) => {
              // Auto-adjust height
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;

              // Also adjust parent container height to match
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.style.height = `${e.currentTarget.scrollHeight}px`;
              }
            }}
          />
        </div>
      </div>

      {/* Etiqueta de CONTENIDO */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-bold text-neutral-700">CONTENIDO</label>

        {/* Contenedor del editor con borde izquierdo y barra de herramientas dentro */}
        <div
          className="border-l border-neutral-300 grow"
          style={{
            paddingLeft: "1rem",
            borderLeftWidth: "1px",
            minHeight: "auto",
          }}
        >
          {/* Barra de herramientas dentro del contenedor - sticky al hacer scroll */}
          <div className="sticky top-16 z-10 bg-white pb-2 pt-1">
            <div className="flex items-center overflow-x-auto py-1 scrollbar-hide w-full border border-gray-100 rounded-md px-2">
              {/* Botones de formato de texto */}
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  editor.isActive("bold") ? "bg-gray-100" : ""
                }`}
              >
                <Bold className="w-5 h-5" />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  editor.isActive("italic") ? "bg-gray-100" : ""
                }`}
              >
                <Italic className="w-5 h-5" />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  editor.isActive("underline") ? "bg-gray-100" : ""
                }`}
              >
                <UnderlineIcon className="w-5 h-5" />
              </button>

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              <button
                onClick={() => {
                  // Si H2 está activo, desactivarlo primero
                  if (editor.isActive("heading", { level: 2 })) {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                  }
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                }}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  editor.isActive("heading", { level: 1 }) ? "bg-gray-100" : ""
                }`}
              >
                <Heading1 className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  // Si H1 está activo, desactivarlo primero
                  if (editor.isActive("heading", { level: 1 })) {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                  }
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                }}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  editor.isActive("heading", { level: 2 }) ? "bg-gray-100" : ""
                }`}
              >
                <Heading2 className="w-5 h-5" />
              </button>

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  editor.isActive("blockquote") ? "bg-gray-100" : ""
                }`}
              >
                <Quote className="w-5 h-5" />
              </button>

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              {/* Dialog para insertar link */}
              <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogTrigger asChild>
                  <button
                    className={`p-1.5 rounded hover:bg-gray-100 ${
                      editor.isActive("link") ? "bg-gray-100" : ""
                    }`}
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Insertar enlace</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="link-url" className="text-right">
                        URL
                      </Label>
                      <Input
                        id="link-url"
                        placeholder="https://ejemplo.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={setLink} type="submit">
                      Insertar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
              >
                <Undo className="w-5 h-5" />
              </button>

              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
              >
                <Redo className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Editor */}
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
