export type Operation =
  | 'STR_EQ'
  | 'STR_CONTAINS'
  | 'SEMVER_GTE'
  | 'SEMVER_LTE'
  | 'SEMVER_EQ'
  | 'NUM_GT'
  | 'NUM_LT'
  | 'NUM_EQ';

export const OPERATIONS: Operation[] = [
  'STR_EQ',
  'STR_CONTAINS',
  'SEMVER_GTE',
  'SEMVER_LTE',
  'SEMVER_EQ',
  'NUM_GT',
  'NUM_LT',
  'NUM_EQ',
];

export interface Condition {
  contextField: string;
  operation: Operation;
  value: string;
}

export interface LogicalGroup {
  $and?: Rule[];
  $or?: Rule[];
}

export type Rule = Condition | LogicalGroup;

export function isCondition(rule: Rule): rule is Condition {
  return 'contextField' in rule;
}

export function isLogicalGroup(rule: Rule): rule is LogicalGroup {
  return '$and' in rule || '$or' in rule;
}

export interface FeatureFlag {
  enabled: boolean;
  description: string;
  targeting: LogicalGroup | null;
}

export type FlagsState = Record<string, FeatureFlag>;

export interface FlagsJson {
  featureFlags: FlagsState;
}
