import { NodeViewContent, NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function CodeBlockSelect({
  node,
  updateAttributes,
  extension,
}: NodeViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const language = (node.attrs.language as string) || "plaintext";
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  // Obtener la lista de lenguajes disponibles
  const languages = ["plaintext"];
  if (extension.options?.lowlight?.listLanguages) {
    languages.push(...extension.options.lowlight.listLanguages());
  }

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    updateAttributes({ language: lang });
    setIsOpen(false);
  };

  return (
    <NodeViewWrapper className="code-block">
      <pre className="relative bg-gray-50 rounded-lg border border-gray-200 p-6 mt-6">
        <div className="absolute top-3 left-3">
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 h-7 px-3 bg-white/80 text-xs rounded border hover:bg-white transition-colors"
            >
              <span>{selectedLanguage}</span>
              <ChevronDown className="size-3" />
            </button>

            {isOpen && (
              <div className="absolute top-8 left-0 bg-white border rounded shadow-lg max-h-48 overflow-y-auto z-10 min-w-[120px]">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <NodeViewContent as="code" className="text-sm font-mono" />
      </pre>
    </NodeViewWrapper>
  );
}
