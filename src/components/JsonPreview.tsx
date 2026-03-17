import { useState } from 'react';
import type { FlagsJson } from '../types';
import { downloadJson, serializeFlags } from '../utils';

interface JsonPreviewProps {
  data: FlagsJson;
}

export function JsonPreview({ data }: JsonPreviewProps) {
  const json = serializeFlags(data);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col h-full border-l border-gray-800 bg-gray-900 min-w-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Preview</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopy}
            className={`text-xs px-3 py-1.5 rounded transition-colors font-medium border ${
              copied
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
            }`}
          >
            {copied ? '✓ Copied!' : '⧉ Copy'}
          </button>
          <button
            onClick={() => downloadJson(data)}
            className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors font-medium"
          >
            ⬇ Download flag.json
          </button>
        </div>
      </div>
      <pre className="flex-1 overflow-auto p-4 text-xs text-green-300 font-mono leading-relaxed whitespace-pre">
        {json}
      </pre>
    </div>
  );
}
