import { ConditionRow } from './ConditionRow';
import { isCondition } from '../types';
import type { Condition, LogicalGroup, Rule } from '../types';

type GroupOperator = '$and' | '$or';

interface RuleGroupEditorProps {
  group: LogicalGroup;
  onChange: (updated: LogicalGroup) => void;
  onDelete?: () => void;
  depth?: number;
}

const DEPTH_COLORS = [
  'border-indigo-300 bg-indigo-50',
  'border-purple-300 bg-purple-50',
  'border-teal-300 bg-teal-50',
  'border-orange-300 bg-orange-50',
];

function getOperator(group: LogicalGroup): GroupOperator {
  return '$and' in group ? '$and' : '$or';
}

function getRules(group: LogicalGroup): Rule[] {
  return group.$and ?? group.$or ?? [];
}

function makeGroup(operator: GroupOperator, rules: Rule[]): LogicalGroup {
  return { [operator]: rules } as LogicalGroup;
}

export function RuleGroupEditor({
  group,
  onChange,
  onDelete,
  depth = 0,
}: RuleGroupEditorProps) {
  const operator = getOperator(group);
  const rules = getRules(group);
  const depthColor = DEPTH_COLORS[depth % DEPTH_COLORS.length];

  function toggleOperator() {
    const next: GroupOperator = operator === '$and' ? '$or' : '$and';
    onChange(makeGroup(next, rules));
  }

  function updateRule(index: number, updated: Rule) {
    const next = rules.map((r, i) => (i === index ? updated : r));
    onChange(makeGroup(operator, next));
  }

  function deleteRule(index: number) {
    const next = rules.filter((_, i) => i !== index);
    onChange(makeGroup(operator, next));
  }

  function addCondition() {
    const newCondition: Condition = { contextField: '', operation: 'STR_EQ', value: '' };
    onChange(makeGroup(operator, [...rules, newCondition]));
  }

  function addGroup() {
    const newGroup: LogicalGroup = { $and: [] };
    onChange(makeGroup(operator, [...rules, newGroup]));
  }

  return (
    <div className={`rounded border ${depthColor} p-3 flex flex-col gap-3`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleOperator}
          className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-colors ${
            operator === '$and'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-purple-600 text-white border-purple-600'
          }`}
          title="Toggle AND/OR"
        >
          {operator === '$and' ? 'AND' : 'OR'}
        </button>
        <span className="text-xs text-gray-400">All conditions in this group must match (AND) / any must match (OR)</span>
        {onDelete && (
          <button
            onClick={onDelete}
            className="ml-auto text-gray-400 hover:text-red-500 transition-colors text-sm"
            title="Remove group"
          >
            ✕ group
          </button>
        )}
      </div>

      {/* Rules */}
      <div className="flex flex-col gap-2 pl-2">
        {rules.length === 0 && (
          <p className="text-xs text-gray-400 italic">No conditions yet. Add one below.</p>
        )}
        {rules.map((rule, index) => {
          if (isCondition(rule)) {
            return (
              <ConditionRow
                key={index}
                condition={rule}
                onChange={(updated) => updateRule(index, updated)}
                onDelete={() => deleteRule(index)}
              />
            );
          } else {
            return (
              <RuleGroupEditor
                key={index}
                group={rule as LogicalGroup}
                onChange={(updated) => updateRule(index, updated)}
                onDelete={() => deleteRule(index)}
                depth={depth + 1}
              />
            );
          }
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={addCondition}
          className="text-xs px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        >
          + Condition
        </button>
        <button
          onClick={addGroup}
          className="text-xs px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        >
          + Group
        </button>
      </div>
    </div>
  );
}
