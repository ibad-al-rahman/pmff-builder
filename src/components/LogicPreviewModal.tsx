import { useEffect } from 'react';

interface LogicPreviewModalProps {
  flagKey: string;
  code: string;
  onClose: () => void;
}

export function LogicPreviewModal({ flagKey, code, onClose }: LogicPreviewModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl mx-4 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-mono text-sm">{'{}'}</span>
            <h2 className="text-sm font-semibold text-gray-200">
              Logic Preview — <span className="font-mono text-indigo-400">{flagKey}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-200 transition-colors text-lg leading-none"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Code */}
        <pre className="overflow-auto p-5 text-sm font-mono leading-relaxed text-green-300 whitespace-pre max-h-[70vh]">
          {code}
        </pre>

        {/* Footer note */}
        <div className="px-5 py-2.5 border-t border-gray-800 text-xs text-gray-600">
          Semver comparisons require a <span className="font-mono text-gray-500">semver</span> library at runtime.
        </div>
      </div>
    </div>
  );
}
