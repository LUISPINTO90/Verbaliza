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

  return (
    <BubbleMenu
      className={`${
        showBubbleMenu ? "flex" : "hidden"
      } bg-gray-900 rounded-lg shadow-lg`}
      editor={editor}
      tippyOptions={{
        moveTransition: "transform 0.15s ease-out",
      }}
    >
      {showLinkSelector ? (
        <LinkSelector
          editor={editor}
          showLinkSelector={showLinkSelector}
          setShowLinkSelector={setShowLinkSelector}
        />
      ) : (
        <div className="flex items-center px-2 py-1">
          {items.map((item) => (
            <button
              key={item.name}
              className={`p-2 text-white hover:bg-gray-700 rounded transition-colors ${
                item.isActive() ? "bg-blue-600" : ""
              } ${item.disable?.() ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={item.disable?.()}
              onClick={item.command}
            >
              {item.icon}
            </button>
          ))}
        </div>
      )}
    </BubbleMenu>
  );
}
