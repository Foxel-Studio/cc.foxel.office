const zh = {
  loading: '正在打开…',
  legacy: '浏览器无法预览 .doc 和 .ppt。请另存为 .docx 或 .pptx 后再打开。',
  tooLarge: '文件超过 {size} MB，无法在浏览器里预览。',
  empty: '这个表格是空的。',
  truncated: '只显示前 {rows} 行、{cols} 列。',
  noUrl: '没有可预览的地址。',
} as const;

const en: Record<keyof typeof zh, string> = {
  loading: 'Opening…',
  legacy: 'Browsers cannot preview .doc or .ppt files. Save them as .docx or .pptx first.',
  tooLarge: 'Files larger than {size} MB cannot be previewed in the browser.',
  empty: 'This spreadsheet is empty.',
  truncated: 'Showing the first {rows} rows and {cols} columns.',
  noUrl: 'No preview URL.',
};

export type MessageKey = keyof typeof zh;

function lang(): 'zh' | 'en' {
  return document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'zh';
}

export function t(key: MessageKey, params?: Record<string, string | number>): string {
  const template = (lang() === 'en' ? en : zh)[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
}
