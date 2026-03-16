import { useRef } from 'react';
import type { FeatureFlag, FlagsState } from '../types';

interface FlagSidebarProps {
  flags: FlagsState;
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onAdd: () => void;
  onDelete: (key: string) => void;
  onUpload: (file: File) => void;
}

export function FlagSidebar({ flags, selectedKey, onSelect, onAdd, onDelete, onUpload }: FlagSidebarProps) {
  const keys = Object.keys(flags);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="flex flex-col w-64 min-w-48 bg-gray-900 border-r border-gray-700 h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Flags</h2>
        <div className="flex items-center gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm px-2 py-1 border border-gray-600 rounded text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors"
            title="Upload flag.json"
          >
            ⬆
          </button>
          <button
            onClick={onAdd}
            className="text-sm px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors"
            title="Add flag"
          >
            + Add
          </button>
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {keys.length === 0 && (
          <li className="px-4 py-6 text-sm text-gray-600 text-center">No flags yet</li>
        )}
        {keys.map((key) => {
          const flag: FeatureFlag = flags[key];
          const isSelected = key === selectedKey;
          return (
            <li
              key={key}
              className={`group flex items-center justify-between px-4 py-2.5 cursor-pointer border-b border-gray-800 hover:bg-gray-800 transition-colors ${
                isSelected ? 'bg-gray-800 border-l-2 border-l-indigo-500' : ''
              }`}
              onClick={() => onSelect(key)}
            >
              <div className="flex items-center gap-2 min-w-0">
                {flag.type === 'kill_switch' ? (
                  <span
                    className={`text-xs flex-shrink-0 ${flag.enabled ? 'text-red-400' : 'text-gray-600'}`}
                    title="Kill switch"
                  >
                    ⚡
                  </span>
                ) : (
                  <span
                    className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                      flag.enabled ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  />
                )}
                <span className="text-sm text-gray-200 truncate font-mono">{key}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(key);
                }}
                className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                title="Delete flag"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
