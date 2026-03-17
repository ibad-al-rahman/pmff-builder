import { useState } from "react";
import { FlagSidebar } from "./components/FlagSidebar";
import { FlagEditor } from "./components/FlagEditor";
import { JsonPreview } from "./components/JsonPreview";
import type { FeatureFlag, FlagsState } from "./types";
import { generateFlagKey, parseImport } from "./utils";

type MobileView = "flags" | "editor" | "preview";

function createDefaultFlag(): FeatureFlag {
  return { type: 'release', enabled: true, description: "", targeting: null };
}

export const App = () => {
  const [flags, setFlags] = useState<FlagsState>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  // Track pending key rename separately so we can handle key conflicts gracefully
  const [editingKey, setEditingKey] = useState<string>("");
  const [mobileView, setMobileView] = useState<MobileView>("flags");

  function handleAdd() {
    const key = generateFlagKey(Object.keys(flags));
    setFlags((prev) => ({ ...prev, [key]: createDefaultFlag() }));
    setSelectedKey(key);
    setEditingKey(key);
    setMobileView("editor");
  }

  function handleDelete(key: string) {
    setFlags((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    if (selectedKey === key) {
      const remaining = Object.keys(flags).filter((k) => k !== key);
      const newSelected = remaining[0] ?? null;
      setSelectedKey(newSelected);
      setEditingKey(newSelected ?? "");
    }
  }

  function handleSelect(key: string) {
    // Commit any in-flight rename before switching
    if (selectedKey && editingKey && editingKey !== selectedKey) {
      commitKeyRename(selectedKey, editingKey);
    }
    setSelectedKey(key);
    setEditingKey(key);
    setMobileView("editor");
  }

  function commitKeyRename(oldKey: string, newKey: string) {
    if (!newKey.trim() || newKey === oldKey) return;
    setFlags((prev) => {
      if (newKey in prev && newKey !== oldKey) return prev; // conflict — skip
      const next: FlagsState = {};
      for (const k of Object.keys(prev)) {
        next[k === oldKey ? newKey : k] = prev[k];
      }
      return next;
    });
    setSelectedKey(newKey);
  }

  function handleKeyChange(newKey: string) {
    setEditingKey(newKey);
  }

  function handleKeyBlur() {
    if (selectedKey && editingKey !== selectedKey) {
      const trimmed = editingKey.trim();
      if (!trimmed) {
        setEditingKey(selectedKey);
        return;
      }
      if (trimmed in flags && trimmed !== selectedKey) {
        // Conflict: revert
        setEditingKey(selectedKey);
        return;
      }
      commitKeyRename(selectedKey, trimmed);
    }
  }

  function handleUpload(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = parseImport(e.target?.result as string);
        setFlags(imported.featureFlags as FlagsState);
        const firstKey = Object.keys(imported.featureFlags)[0] ?? null;
        setSelectedKey(firstKey);
        setEditingKey(firstKey ?? "");
      } catch (err) {
        alert((err as Error).message);
      }
    };
    reader.readAsText(file);
  }

  function handleFlagChange(updated: FeatureFlag) {
    if (!selectedKey) return;
    setFlags((prev) => ({ ...prev, [selectedKey]: updated }));
  }

  const flagsJson = { featureFlags: flags };

  const mobileNavItems: { key: MobileView; label: string; icon: string }[] = [
    { key: "flags", label: "Flags", icon: "⚑" },
    { key: "editor", label: "Editor", icon: "✎" },
    { key: "preview", label: "Preview", icon: "{}" },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-950 text-gray-100 font-sans">
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <div className={`${mobileView === "flags" ? "flex" : "hidden"} md:flex w-full md:w-auto`}>
          <FlagSidebar
            flags={flags}
            selectedKey={selectedKey}
            onSelect={handleSelect}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpload={handleUpload}
          />
        </div>

        {/* Editor */}
        <main className={`flex-1 overflow-hidden ${mobileView === "editor" ? "block" : "hidden"} md:block`}>
          {selectedKey && flags[selectedKey] ? (
            <FlagEditor
              flagKey={editingKey}
              flag={flags[selectedKey]}
              onKeyChange={handleKeyChange}
              onKeyBlur={handleKeyBlur}
              onChange={handleFlagChange}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Select a flag to edit, or click{" "}
              <strong className="mx-1">+ Add</strong> to create one.
            </div>
          )}
        </main>

        {/* JSON Preview */}
        <aside className={`w-full md:w-96 md:min-w-64 flex-col overflow-hidden ${mobileView === "preview" ? "flex" : "hidden"} md:flex`}>
          <JsonPreview data={flagsJson} />
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden flex border-t border-gray-700 bg-gray-900">
        {mobileNavItems.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setMobileView(key)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs transition-colors ${
              mobileView === key
                ? "text-indigo-400 border-t-2 border-indigo-400 -mt-px"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span className="text-base font-mono">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
