import { useState } from 'react';
import { RuleGroupEditor } from './RuleGroupEditor';
import { LogicPreviewModal } from './LogicPreviewModal';
import { FLAG_TYPES } from '../types';
import type { FeatureFlag, FlagType, LogicalGroup } from '../types';
import { flagToLogicJs } from '../logic';

interface FlagEditorProps {
  flagKey: string;
  flag: FeatureFlag;
  onKeyChange: (newKey: string) => void;
  onKeyBlur?: () => void;
  onChange: (updated: FeatureFlag) => void;
}

export function FlagEditor({ flagKey, flag, onKeyChange, onKeyBlur, onChange }: FlagEditorProps) {
  const isKillSwitch = flag.type === 'kill_switch';
  const [showLogic, setShowLogic] = useState(false);

  function handleTargetingToggle() {
    if (flag.targeting === null) {
      onChange({ ...flag, targeting: { $and: [] } });
    } else {
      onChange({ ...flag, targeting: null });
    }
  }

  return (
    <>
      {showLogic && (
        <LogicPreviewModal
          flagKey={flagKey}
          code={flagToLogicJs(flagKey, flag)}
          onClose={() => setShowLogic(false)}
        />
      )}
    <div className="flex flex-col gap-5 h-full overflow-y-auto p-5 bg-gray-950">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-200">Edit Flag</h2>
        <button
          onClick={() => setShowLogic(true)}
          className="text-xs px-3 py-1.5 bg-gray-800 border border-gray-700 text-gray-400 rounded hover:bg-gray-700 hover:text-gray-200 transition-colors font-mono"
        >
          {'{ }'} Logic
        </button>
      </div>

      {/* Kill switch banner removed */}
      {/* Flag Type */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
        <div className="flex flex-wrap gap-2">
          {FLAG_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ ...flag, type: value as FlagType })}
              className={`text-sm px-3 py-1.5 rounded border transition-colors ${
                flag.type === value
                  ? value === 'kill_switch'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {value === 'kill_switch' ? '⚡ ' : '🚀 '}{label}
            </button>
          ))}
        </div>
      </div>

      {/* Flag Key */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Flag Key</label>
        <input
          type="text"
          value={flagKey}
          onChange={(e) => onKeyChange(e.target.value)}
          onBlur={onKeyBlur}
          className="text-sm bg-gray-800 border border-gray-700 text-gray-100 rounded px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-600"
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
          className="text-sm bg-gray-800 border border-gray-700 text-gray-100 rounded px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-600"
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
            flag.enabled
              ? isKillSwitch ? 'bg-red-500' : 'bg-green-500'
              : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              flag.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm text-gray-300">
          {flag.enabled
            ? isKillSwitch ? '⚡ Kill switch active — feature is OFF' : 'Enabled'
            : isKillSwitch ? 'Kill switch inactive — feature runs normally' : 'Disabled'}
        </span>
      </div>

      {/* Targeting */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Targeting Rules</label>
          <button
            onClick={handleTargetingToggle}
            className="text-xs text-indigo-400 hover:underline"
          >
            {flag.targeting === null ? '+ Enable targeting' : '✕ Remove targeting'}
          </button>
        </div>

        {flag.targeting === null ? (
          <p className="text-sm text-gray-600 italic">
            {isKillSwitch
              ? 'No targeting — kill switch applies to everyone.'
              : 'No targeting — flag applies to everyone.'}
          </p>
        ) : (
          <RuleGroupEditor
            group={flag.targeting as LogicalGroup}
            onChange={(updated) => onChange({ ...flag, targeting: updated })}
          />
        )}
      </div>
    </div>
    </>
  );
}
