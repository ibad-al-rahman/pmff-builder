import type { FlagsJson } from './types';

export function serializeFlags(flags: FlagsJson): string {
  return JSON.stringify(flags, null, 2);
}

export function downloadJson(data: FlagsJson, filename = 'flag.json') {
  const json = serializeFlags(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateFlagKey(existingKeys: string[]): string {
  let n = existingKeys.length + 1;
  let key = `new_flag_${n}`;
  while (existingKeys.includes(key)) {
    n++;
    key = `new_flag_${n}`;
  }
  return key;
}

export function parseImport(jsonText: string): FlagsJson {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('Invalid JSON file.');
  }
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('featureFlags' in parsed) ||
    typeof (parsed as Record<string, unknown>).featureFlags !== 'object'
  ) {
    throw new Error('File must contain a top-level "featureFlags" object.');
  }
  const result = parsed as FlagsJson;
  // Ensure every imported flag has a type field (backwards compat)
  for (const key of Object.keys(result.featureFlags)) {
    const flag = result.featureFlags[key] as unknown as Record<string, unknown>;
    if (!flag.type) flag.type = 'release';
  }
  return result;
}
