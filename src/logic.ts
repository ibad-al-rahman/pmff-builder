import type { Condition, FeatureFlag, LogicalGroup, Operation, Rule } from './types';
import { isCondition } from './types';

function operationToJs(op: Operation, field: string, value: string): string {
  const isNumericOp = op === 'NUM_GT' || op === 'NUM_LT' || op === 'NUM_EQ';
  const val = isNumericOp ? value : `"${value}"`;

  switch (op) {
    case 'STR_EQ':     return `${field} === "${value}"`;
    case 'STR_CONTAINS': return `${field}.includes("${value}")`;
    case 'SEMVER_GTE': return `semver.gte(${field}, "${value}")`;
    case 'SEMVER_LTE': return `semver.lte(${field}, "${value}")`;
    case 'SEMVER_EQ':  return `semver.eq(${field}, "${value}")`;
    case 'NUM_GT':     return `${field} > ${val}`;
    case 'NUM_LT':     return `${field} < ${val}`;
    case 'NUM_EQ':     return `${field} === ${val}`;
  }
}

function conditionToJs(cond: Condition): string {
  const field = cond.contextField || 'unknown';
  return operationToJs(cond.operation, field, cond.value);
}

function ruleToJs(rule: Rule, depth: number): string {
  if (isCondition(rule)) {
    return conditionToJs(rule);
  }
  return groupToJs(rule as LogicalGroup, depth);
}

function groupToJs(group: LogicalGroup, depth: number): string {
  const isAnd = '$and' in group;
  const rules = group.$and ?? group.$or ?? [];
  const op = isAnd ? ' &&\n' + '  '.repeat(depth + 1) : ' ||\n' + '  '.repeat(depth + 1);

  if (rules.length === 0) return 'true';

  const parts = rules.map((r) => {
    const js = ruleToJs(r, depth + 1);
    // Wrap nested groups in parens for clarity
    return isCondition(r) ? js : `(${js})`;
  });

  return parts.join(op);
}

export function flagToLogicJs(key: string, flag: FeatureFlag): string {
  const isKillSwitch = flag.type === 'kill_switch';
  const innerComment = isKillSwitch
    ? `// ${key}: kill switch is active — feature is DISABLED`
    : `// ${key}: feature is enabled`;

  if (flag.targeting === null) {
    if (!flag.enabled) {
      return `// ${key}: flag is ${isKillSwitch ? 'inactive — feature runs normally' : 'disabled'}`;
    }
    return [
      `// ${key}: no targeting — applies to everyone`,
      `{`,
      `  ${innerComment}`,
      `}`,
    ].join('\n');
  }

  const condition = groupToJs(flag.targeting, 0);
  const indent = '  ';

  return [
    `if (${condition.includes('\n') ? '\n' + indent + condition.replace(/\n/g, '\n' + indent) + '\n' : condition}) {`,
    `  ${innerComment}`,
    `}`,
  ].join('\n');
}
