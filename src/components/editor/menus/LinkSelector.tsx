import { Editor } from "@tiptap/core";
import { Check, X, Trash } from "lucide-react";
import { Dispatch, SetStateAction, FormEvent, useRef } from "react";
import { toast } from "sonner";

import { useOutsideClick } from "@/hooks/use-outside-click";

interface LinkSelectorProps {
  editor: Editor;
  showLinkSelector: boolean;
  setShowLinkSelector: Dispatch<SetStateAction<boolean>>;
}

// Función para validar URL
const isValidUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

const getUrlFromString = (str: string) => {
  if (isValidUrl(str)) {
    return str;
  } else {
    throw new Error("Invalid URL");
  }
};

export function LinkSelector({
  editor,
  showLinkSelector,
  setShowLinkSelector,
}: LinkSelectorProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useOutsideClick(() => {
    setShowLinkSelector(false);
  });

  const handleUrlSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const input = e.currentTarget[0] as HTMLInputElement;
    let url;

    try {
      url = getUrlFromString(input.value);
    } catch {
      toast.error("Invalid URL");
      return;
    }

    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
    setShowLinkSelector(false);
  };

  return (
    <div className="flex min-w-[300px] items-center">
      {showLinkSelector && (
        <div ref={containerRef}>
          <form
            ref={formRef}
            onSubmit={handleUrlSubmit}
            className="flex w-full bg-gray-900 rounded-lg p-2"
          >
            <input
              autoFocus
              type="text"
              placeholder="Paste or type a link..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-400"
              defaultValue={editor.getAttributes("link").href || ""}
            />
            {editor.getAttributes("link").href ? (
              <button
                type="button"
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setShowLinkSelector(false);
                }}
              >
                <Trash className="size-4" />
              </button>
            ) : (
              <div className="flex">
                <button
                  type="submit"
                  className="p-1 text-green-400 hover:text-green-300 transition-colors"
                >
                  <Check className="size-4" />
                </button>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                  onClick={() => setShowLinkSelector(false)}
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
