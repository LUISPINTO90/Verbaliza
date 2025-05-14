"use client";

import {
  EditorContent,
  HTMLContent,
  JSONContent,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
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

// Document personalizado para iniciar con título
const CustomDocument = Document.extend({
  content: "heading block*",
});

interface WritingEditorProps {
  placeholder?: string;
  initialContent?: string;
  onUpdate?: (content: {
    text: string;
    json: JSONContent;
    html: HTMLContent;
  }) => void;
}

export default function WritingEditor({
  placeholder = "Tell your story...",
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
      // Ocultar menus para ciertos elementos
      if (
        editor.isActive("heading", { level: 1 }) ||
        editor.isActive("image") ||
        editor.isActive("horizontalRule") ||
        editor.isActive("codeBlock")
      ) {
        setShowBubbleMenu(false);
        setShowPlusButton(false);
        return;
      }

      setShowBubbleMenu(true);
      setShowPlusButton(true);
    },
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
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
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Title";
          }
          return placeholder;
        },
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
          "prose prose-lg dark:prose-invert mx-auto max-w-none focus:outline-none " +
          "prose-headings:font-serif prose-h1:text-5xl prose-h1:font-bold prose-h1:mb-8 " +
          "prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 " +
          "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 " +
          "prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 " +
          "prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto " +
          "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-6 prose-blockquote:italic " +
          "prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded-md " +
          "prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 " +
          "prose-hr:border-gray-300 prose-hr:my-8",
      },
    },
    content:
      initialContent ||
      `
      <h1></h1>
      <p></p>
    `,
  });

  useEffect(() => {
    if (editor) {
      // Focus en el título al cargar
      editor.commands.focus("start");
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="relative">
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
