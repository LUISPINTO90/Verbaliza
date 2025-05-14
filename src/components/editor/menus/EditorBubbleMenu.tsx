"use client";

import { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Type,
  Quote,
  X,
} from "lucide-react";
import { Dispatch, SetStateAction, ReactElement } from "react";

import { LinkSelector } from "./LinkSelector";

interface BubbleMenuItem {
  name: string;
  disable?: () => boolean;
  isActive: () => boolean;
  command: () => void;
  icon: ReactElement;
}

interface EditorBubbleMenuProps {
  editor: Editor;
  showBubbleMenu: boolean;
  showLinkSelector: boolean;
  setShowLinkSelector: Dispatch<SetStateAction<boolean>>;
}

export function EditorBubbleMenu({
  editor,
  showBubbleMenu,
  showLinkSelector,
  setShowLinkSelector,
}: EditorBubbleMenuProps) {
  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      disable: () => editor.isActive("heading"),
      isActive: () => editor.isActive("bold"),
      command: () => editor.chain().focus().toggleBold().run(),
      icon: <Bold className="size-4" />,
    },
    {
      name: "italic",
      disable: () => editor.isActive("heading"),
      isActive: () => editor.isActive("italic"),
      command: () => editor.chain().focus().toggleItalic().run(),
      icon: <Italic className="size-4" />,
    },
    {
      name: "underline",
      disable: () => editor.isActive("heading"),
      isActive: () => editor.isActive("underline"),
      command: () => editor.chain().focus().toggleUnderline().run(),
      icon: <Underline className="size-4" />,
    },
    {
      name: "strike",
      disable: () => editor.isActive("heading"),
      isActive: () => editor.isActive("strike"),
      command: () => editor.chain().focus().toggleStrike().run(),
      icon: <Strikethrough className="size-4" />,
    },
    {
      name: "link",
      disable: () => editor.isActive("heading"),
      isActive: () => editor.isActive("link"),
      command: () => setShowLinkSelector(!showLinkSelector),
      icon: <Link className="size-4" />,
    },
    {
      name: "heading2",
      isActive: () => editor.isActive("heading", { level: 2 }),
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: <Type className="size-5" />,
    },
    {
      name: "heading3",
      isActive: () => editor.isActive("heading", { level: 3 }),
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: <Type className="size-4" />,
    },
    {
      name: "blockquote",
      isActive: () => editor.isActive("blockquote"),
      command: () => editor.chain().focus().toggleBlockquote().run(),
      icon: <Quote className="size-4" />,
    },
  ];

  const handleClearSelection = () => {
    editor.chain().focus().setTextSelection(editor.state.selection.to).run();
  };

  const shouldShow = () => {
    const { selection } = editor.state;
    const { from, to } = selection;

    // Solo mostrar si hay texto seleccionado
    return from !== to && showBubbleMenu;
  };

  return (
    <BubbleMenu
      className={`${shouldShow() ? "flex" : "hidden"} items-center`}
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{
        duration: 100,
        placement: "bottom",
        offset: [0, 8],
      }}
    >
      {showLinkSelector ? (
        <LinkSelector
          editor={editor}
          showLinkSelector={showLinkSelector}
          setShowLinkSelector={setShowLinkSelector}
        />
      ) : (
        <div className="flex items-center bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          {/* Botón X para cerrar */}
          <button
            className="p-2 text-white hover:bg-gray-700 rounded-l-lg transition-colors border-r border-gray-700"
            onClick={handleClearSelection}
          >
            <X className="size-4" />
          </button>

          {/* Botones de formato */}
          <div className="flex items-center px-1">
            {items.map((item, index) => (
              <button
                key={item.name}
                className={`p-2 text-white hover:bg-gray-700 rounded transition-colors ${
                  item.isActive() ? "bg-blue-600" : ""
                } ${item.disable?.() ? "opacity-50 cursor-not-allowed" : ""} ${
                  index === items.length - 1 ? "rounded-r-lg" : ""
                }`}
                disabled={item.disable?.()}
                onClick={item.command}
                title={item.name}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </BubbleMenu>
  );
}
