import { RuleGroupEditor } from './RuleGroupEditor';
import type { FeatureFlag, LogicalGroup } from '../types';

interface FlagEditorProps {
  flagKey: string;
  flag: FeatureFlag;
  onKeyChange: (newKey: string) => void;
  onKeyBlur?: () => void;
  onChange: (updated: FeatureFlag) => void;
}

export function FlagEditor({ flagKey, flag, onKeyChange, onKeyBlur, onChange }: FlagEditorProps) {
  function handleTargetingToggle() {
    if (flag.targeting === null) {
      onChange({ ...flag, targeting: { $and: [] } });
    } else {
      onChange({ ...flag, targeting: null });
    }
  }

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto p-5">
      <h2 className="text-base font-semibold text-gray-800">Edit Flag</h2>

      {/* Flag Key */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Flag Key</label>
        <input
          type="text"
          value={flagKey}
          onChange={(e) => onKeyChange(e.target.value)}
          onBlur={onKeyBlur}
          className="text-sm border border-gray-300 rounded px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400"
          placeholder="e.g. new_onboarding_flow"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</label>
        <textarea
          value={flag.description}
          onChange={(e) => onChange({ ...flag, description: e.target.value })}
          rows={2}
          className="text-sm border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400"
          placeholder="What does this flag do?"
        />
      </div>

      {/* Enabled toggle */}
      <div className="flex items-center gap-3">
        <button
          role="switch"
          aria-checked={flag.enabled}
          onClick={() => onChange({ ...flag, enabled: !flag.enabled })}
          className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${
            flag.enabled ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              flag.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm text-gray-700">{flag.enabled ? 'Enabled' : 'Disabled'}</span>
      </div>

      {/* Targeting */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Targeting Rules</label>
          <button
            onClick={handleTargetingToggle}
            className="text-xs text-indigo-600 hover:underline"
          >
            {flag.targeting === null ? '+ Enable targeting' : '✕ Remove targeting'}
          </button>
        </div>

        {flag.targeting === null ? (
          <p className="text-sm text-gray-400 italic">No targeting — flag applies to everyone.</p>
        ) : (
          <RuleGroupEditor
            group={flag.targeting as LogicalGroup}
            onChange={(updated) => onChange({ ...flag, targeting: updated })}
          />
        )}
      </div>
    </div>
  );
}
