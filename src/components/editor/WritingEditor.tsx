"use client";

import {
  EditorContent,
  HTMLContent,
  JSONContent,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { useEffect, useState } from "react";
import { EditorBubbleMenu } from "./menus/EditorBubbleMenu";
import { EditorFloatingMenu } from "./menus/EditorFloatingMenu";
import { CodeBlockSelect } from "./menus/CodeBlockSelect";
import { lowlight } from "./lib/lowlight";

// Document personalizado para iniciar con título y párrafo
const CustomDocument = Document.extend({
  content: "heading block*",
});

// Extensión personalizada para manejar Enter en headings
const HeadingEnterExtension = Extension.create({
  name: "headingEnter",

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection, doc } = editor.state;
        const { $head } = selection;

        // Si estamos en un h1
        if (
          $head.parent.type.name === "heading" &&
          $head.parent.attrs.level === 1
        ) {
          // Encontrar el nodo heading actual
          const headingNode = $head.parent;
          const headingPos = $head.before($head.depth);

          // Calcular la posición después del heading
          const afterHeading = headingPos + headingNode.nodeSize;

          // Verificar si ya existe un párrafo después del heading
          if (afterHeading < doc.content.size) {
            const nextNode = doc.nodeAt(afterHeading);
            if (nextNode && nextNode.type.name === "paragraph") {
              // Ya existe un párrafo, solo ir a él
              return editor.commands.setTextSelection(afterHeading + 1);
            }
          }

          // No existe párrafo, crear uno nuevo y ir a él
          editor
            .chain()
            .focus()
            .insertContentAt(afterHeading, "<p></p>")
            .setTextSelection(afterHeading + 1)
            .run();

          return true;
        }

        return false;
      },
    };
  },
});

interface WritingEditorProps {
  initialContent?: string;
  onUpdate?: (content: {
    text: string;
    json: JSONContent;
    html: HTMLContent;
  }) => void;
}

export default function WritingEditor({
  initialContent,
  onUpdate,
}: WritingEditorProps) {
  const [showLinkSelector, setShowLinkSelector] = useState(false);
  const [showBubbleMenu, setShowBubbleMenu] = useState(true);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showPlusButton, setShowPlusButton] = useState(false);

  const editor = useEditor({
    onUpdate({ editor }) {
      if (onUpdate) {
        onUpdate({
          text: editor.getText(),
          json: editor.getJSON(),
          html: editor.getHTML(),
        });
      }
    },
    onSelectionUpdate({ editor }) {
      const { selection } = editor.state;
      const { from, to } = selection;

      // Verificar si hay texto seleccionado
      const hasSelection = from !== to;

      // Verificar si el cursor está en elementos especiales
      const isInSpecialElement =
        editor.isActive("image") ||
        editor.isActive("horizontalRule") ||
        editor.isActive("codeBlock");

      // Mostrar BubbleMenu si hay selección y no está en elementos especiales
      if (hasSelection && !isInSpecialElement) {
        setShowBubbleMenu(true);
        setShowPlusButton(false);
        return;
      }

      // Para títulos, no mostrar ningún menú
      if (editor.isActive("heading", { level: 1 })) {
        setShowBubbleMenu(false);
        setShowPlusButton(false);
        return;
      }

      // Verificar si estamos en un párrafo vacío
      const currentNode = editor.state.doc.resolve(from).parent;
      const isParagraph = currentNode.type.name === "paragraph";
      const isEmpty = currentNode.content.size === 0;
      const isAtStart = selection.empty && selection.$head.parentOffset === 0;

      // Mostrar plus button en párrafos vacíos
      setShowPlusButton(
        isParagraph && isEmpty && isAtStart && !isInSpecialElement
      );
      setShowBubbleMenu(
        hasSelection &&
          !isInSpecialElement &&
          !editor.isActive("heading", { level: 1 })
      );
    },
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      HeadingEnterExtension,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Blockquote,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg",
        },
      }),
      // Configuración mejorada del Placeholder
      Placeholder.configure({
        placeholder: ({ node, editor }) => {
          if (node.type.name === "heading" && node.attrs.level === 1) {
            return "Title";
          }
          if (node.type.name === "paragraph") {
            // Contar párrafos para saber si es el primero
            const doc = editor.state.doc;
            let foundHeading = false;
            let paragraphCount = 0;

            doc.descendants((child) => {
              if (child.type.name === "heading" && child.attrs.level === 1) {
                foundHeading = true;
              }
              if (foundHeading && child.type.name === "paragraph") {
                paragraphCount++;
                if (child === node) {
                  return false; // Detener la búsqueda
                }
              }
              return true;
            });

            // Solo mostrar placeholder en el primer párrafo después del título
            return paragraphCount === 1 ? "Tell your story..." : "";
          }
          return "";
        },
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "is-empty",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
      TextAlign.configure({
        types: ["image", "paragraph", "heading"],
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockSelect);
        },
      }).configure({
        lowlight,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "max-w-none focus:outline-none " +
          // Márgenes más pequeños para mobile
          "px-4 sm:px-8 md:px-16 lg:mx-auto lg:px-0 lg:max-w-4xl",
      },
      // Manejar otros eventos de teclado
      handleKeyDown: () => {
        return false; // Permitir que las extensiones manejen los eventos
      },
    },
    // Contenido inicial con título y párrafo vacíos
    content: initialContent || `<h1></h1><p></p>`,
  });

  useEffect(() => {
    if (editor) {
      // Focus en el título al cargar
      editor.commands.focus("start");

      // Agregar clase al body cuando el editor tiene focus
      const handleFocus = () => {
        document.body.classList.add("editor-focused");
      };

      const handleBlur = () => {
        document.body.classList.remove("editor-focused");
      };

      editor.on("focus", handleFocus);
      editor.on("blur", handleBlur);

      // Manejar Ctrl+A para seleccionar solo el contenido del editor
      const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "a") {
          if (editor.isFocused) {
            event.preventDefault();
            editor.commands.selectAll();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        editor.off("focus", handleFocus);
        editor.off("blur", handleBlur);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.classList.remove("editor-focused");
      };
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="relative">
      {/* Estilos CSS completamente personalizados */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Reset y base styles */
          .ProseMirror {
            outline: none;
            color: #374151;
          }
          
          /* Título: 42px para desktop */
          .ProseMirror h1 {
            font-size: 42px !important;
            font-weight: 700 !important;
            line-height: 1.2 !important;
            margin-bottom: 32px !important;
            margin-top: 0 !important;
            color: #1f2937 !important;
            border: none !important;
            padding: 0 !important;
          }
          
          /* Párrafos: 21px para desktop */
          .ProseMirror p {
            font-size: 21px !important;
            line-height: 1.5 !important;
            margin-bottom: 24px !important;
            margin-top: 0 !important;
            color: #374151 !important;
            padding: 0 !important;
          }
          
          /* Placeholder para títulos - desktop */
          .ProseMirror h1.is-empty::before {
            content: attr(data-placeholder) !important;
            float: left;
            color: #D1D5DB !important;
            pointer-events: none;
            height: 0;
            font-size: 42px !important;
            font-weight: 700 !important;
            line-height: 1.2 !important;
          }
          
          /* Placeholder para párrafos - desktop */
          .ProseMirror p.is-empty::before {
            content: attr(data-placeholder) !important;
            float: left;
            color: #9CA3AF !important;
            pointer-events: none;
            height: 0;
            font-size: 21px !important;
            line-height: 1.5 !important;
          }
          
          /* MOBILE STYLES - 768px y menor */
          @media (max-width: 768px) {
            /* Título móvil: 34px */
            .ProseMirror h1 {
              font-size: 34px !important;
              margin-bottom: 24px !important;
            }
            
            /* Párrafos móvil: 18px */
            .ProseMirror p {
              font-size: 18px !important;
              margin-bottom: 18px !important;
            }
            
            /* Placeholder título móvil: 34px */
            .ProseMirror h1.is-empty::before {
              font-size: 34px !important;
            }
            
            /* Placeholder párrafos móvil: 18px */
            .ProseMirror p.is-empty::before {
              font-size: 18px !important;
            }
            
            /* Ajustar otros elementos para móvil */
            .ProseMirror h2 {
              font-size: 28px !important;
              margin-top: 32px !important;
              margin-bottom: 16px !important;
            }
            
            .ProseMirror h3 {
              font-size: 22px !important;
              margin-top: 24px !important;
              margin-bottom: 12px !important;
            }
            
            .ProseMirror ul, .ProseMirror ol {
              font-size: 18px !important;
              padding-left: 20px;
            }
            
            .ProseMirror blockquote {
              padding-left: 16px;
              margin: 16px 0;
            }
          }
          
          /* Otros headings */
          .ProseMirror h2 {
            font-size: 36px !important;
            font-weight: 700 !important;
            line-height: 1.3 !important;
            margin-top: 48px !important;
            margin-bottom: 24px !important;
          }
          
          .ProseMirror h3 {
            font-size: 28px !important;
            font-weight: 600 !important;
            line-height: 1.3 !important;
            margin-top: 32px !important;
            margin-bottom: 16px !important;
          }
          
          /* Otros elementos */
          .ProseMirror img {
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 100%;
            height: auto;
          }
          
          .ProseMirror blockquote {
            border-left: 4px solid #d1d5db;
            padding-left: 24px;
            font-style: italic;
            color: #6b7280;
            margin: 24px 0;
          }
          
          .ProseMirror code {
            background-color: #f3f4f6;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          }
          
          .ProseMirror pre {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            overflow-x: auto;
          }
          
          .ProseMirror hr {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 32px 0;
          }
          
          .ProseMirror ul, .ProseMirror ol {
            font-size: 21px;
            line-height: 1.5;
            margin: 16px 0;
            padding-left: 24px;
          }
          
          .ProseMirror li {
            margin-bottom: 8px;
          }
          
          /* Prevenir selección fuera del editor */
          body.editor-focused * {
            user-select: none;
          }
          
          body.editor-focused .ProseMirror,
          body.editor-focused .ProseMirror * {
            user-select: text;
          }
        `,
        }}
      />

      <EditorBubbleMenu
        editor={editor}
        showBubbleMenu={showBubbleMenu}
        showLinkSelector={showLinkSelector}
        setShowLinkSelector={setShowLinkSelector}
      />
      <EditorFloatingMenu
        editor={editor}
        showPlusButton={showPlusButton}
        showFloatingMenu={showFloatingMenu}
        setShowFloatingMenu={setShowFloatingMenu}
      />
      <EditorContent editor={editor} />
    </div>
  );
}
