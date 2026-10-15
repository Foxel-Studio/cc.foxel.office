export type OfficeKind = 'docx' | 'sheet' | 'pptx' | 'legacy';

export const OFFICE_FORMATS: readonly { ext: string; kind: OfficeKind }[] = [
  { ext: 'docx', kind: 'docx' },
  { ext: 'xlsx', kind: 'sheet' },
  { ext: 'xls', kind: 'sheet' },
  { ext: 'csv', kind: 'sheet' },
  { ext: 'pptx', kind: 'pptx' },
  { ext: 'doc', kind: 'legacy' },
  { ext: 'ppt', kind: 'legacy' },
];

const BY_EXT = new Map(OFFICE_FORMATS.map((item) => [item.ext, item.kind]));

export function extOf(name: string): string {
  const base = name.split(/[/\\]/).pop() || name;
  const index = base.lastIndexOf('.');
  if (index <= 0) return '';
  return base.slice(index + 1).toLowerCase();
}

export function officeKind(name: string): OfficeKind | null {
  return BY_EXT.get(extOf(name)) ?? null;
}
