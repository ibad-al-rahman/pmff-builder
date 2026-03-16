import { OPERATIONS } from '../types';
import type { Condition, Operation } from '../types';

interface ConditionRowProps {
  condition: Condition;
  onChange: (updated: Condition) => void;
  onDelete: () => void;
}

export function ConditionRow({ condition, onChange, onDelete }: ConditionRowProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input
        type="text"
        value={condition.contextField}
        onChange={(e) => onChange({ ...condition, contextField: e.target.value })}
        placeholder="contextField"
        className="flex-1 min-w-28 text-sm border border-gray-300 rounded px-2 py-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400"
      />
      <select
        value={condition.operation}
        onChange={(e) => onChange({ ...condition, operation: e.target.value as Operation })}
        className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
      >
        {OPERATIONS.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={condition.value}
        onChange={(e) => onChange({ ...condition, value: e.target.value })}
        placeholder="value"
        className="flex-1 min-w-28 text-sm border border-gray-300 rounded px-2 py-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400"
      />
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500 transition-colors px-1"
        title="Remove condition"
      >
        ✕
      </button>
    </div>
  );
}
