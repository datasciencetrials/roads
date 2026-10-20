type GovernedRow = Record<string, unknown>;

export function normaliseSurfaceType(value: unknown): 'Paved' | 'Unpaved' | null {
  if (value == null || value === '') return null;
  const text = String(value).trim().toLowerCase();
  if (/unsealed|unpaved|gravel|earth|murram|soil/.test(text)) return 'Unpaved';
  if (/paved|bitum|asphalt|concrete|sealed|tarmac/.test(text)) return 'Paved';
  return null;
}

export function normaliseGovernedRow(row: GovernedRow): GovernedRow {
  const next = { ...row };
  for (const key of ['surface_type', 'surface_cat']) {
    if (key in next) next[key] = normaliseSurfaceType(next[key]);
  }
  return next;
}
