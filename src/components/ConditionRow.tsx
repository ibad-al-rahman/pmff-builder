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
        className="flex-1 min-w-28 text-sm bg-gray-800 border border-gray-700 text-gray-100 rounded px-2 py-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-600"
      />
      <select
        value={condition.operation}
        onChange={(e) => onChange({ ...condition, operation: e.target.value as Operation })}
        className="text-sm bg-gray-800 border border-gray-700 text-gray-100 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
        className="flex-1 min-w-28 text-sm bg-gray-800 border border-gray-700 text-gray-100 rounded px-2 py-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-600"
      />
      <button
        onClick={onDelete}
        className="text-gray-600 hover:text-red-400 transition-colors px-1"
        title="Remove condition"
      >
        ✕
      </button>
    </div>
  );
}
