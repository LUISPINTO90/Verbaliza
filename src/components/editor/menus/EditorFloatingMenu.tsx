"use client";

import { Editor } from "@tiptap/core";
import { FloatingMenu } from "@tiptap/react";
import { motion } from "framer-motion";
import {
  Plus,
  Image as ImageIcon,
  List,
  ListOrdered,
  Minus,
} from "lucide-react";
import { useRef, ReactElement } from "react";

import { useOutsideClick } from "@/hooks/use-outside-click";

interface FloatingMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: ReactElement;
  label: string;
}

interface EditorFloatingMenuProps {
  editor: Editor;
  showPlusButton: boolean;
  showFloatingMenu: boolean;
  setShowFloatingMenu: (show: boolean) => void;
}

// Función para convertir archivo a base64
const convertFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });

export function EditorFloatingMenu({
  editor,
  showPlusButton,
  showFloatingMenu,
  setShowFloatingMenu,
}: EditorFloatingMenuProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Hook personalizado para outside click usando el ref del botón
  const menuRef = useOutsideClick(() => {
    setShowFloatingMenu(false);
  });

  const items: FloatingMenuItem[] = [
    {
      name: "image",
      label: "Image",
      isActive: () => editor.isActive("image"),
      command: () => {
        hiddenFileInput.current?.click();
      },
      icon: <ImageIcon className="size-4" />,
    },
    {
      name: "bulletList",
      label: "Bullet List",
      isActive: () => editor.isActive("bulletList"),
      command: () => editor.chain().focus().toggleBulletList().run(),
      icon: <List className="size-4" />,
    },
    {
      name: "orderedList",
      label: "Numbered List",
      isActive: () => editor.isActive("orderedList"),
      command: () => editor.chain().focus().toggleOrderedList().run(),
      icon: <ListOrdered className="size-4" />,
    },
    {
      name: "horizontalRule",
      label: "Divider",
      isActive: () => editor.isActive("horizontalRule"),
      command: () => editor.chain().focus().setHorizontalRule().run(),
      icon: <Minus className="size-4" />,
    },
  ];

  const shouldShow = (editor: Editor) => {
    const { selection } = editor.state;

    if (
      !selection.empty ||
      selection.$head.parent.content.size > 0 ||
      selection.$head.depth !== 1
    ) {
      return false;
    }

    return true;
  };

  const addImage = async (e: React.FormEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const base64 = await convertFileToBase64(file);
    if (base64) {
      editor?.chain().focus().setImage({ src: base64 }).run();
    }
  };

  return (
    <FloatingMenu
      className={`${showPlusButton ? "flex" : "hidden"} relative`}
      editor={editor}
      shouldShow={() => shouldShow(editor)}
      tippyOptions={{
        duration: 100,
      }}
    >
      <div ref={menuRef}>
        <button
          ref={buttonRef}
          className={`w-8 h-8 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-all ${
            showFloatingMenu ? "rotate-45" : ""
          }`}
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
        >
          <Plus className="size-4 text-gray-600" />
        </button>

        <input
          ref={hiddenFileInput}
          hidden
          accept="image/png, image/jpeg, image/jpg"
          type="file"
          onChange={addImage}
        />

        {showFloatingMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-10 top-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px]"
          >
            {items.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                onClick={() => {
                  item.command();
                  setShowFloatingMenu(false);
                }}
              >
                <span className="mr-3 text-blue-600">{item.icon}</span>
                <span className="text-sm text-gray-700">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </FloatingMenu>
  );
}
