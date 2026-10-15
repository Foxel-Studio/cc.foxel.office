import * as XLSX from 'xlsx';
import { decodeCsv } from '../load';
import { t } from '../i18n';

const MAX_ROWS = 1000;
const MAX_COLS = 40;

export function renderSheet(container: HTMLElement, data: ArrayBuffer, ext: string): void {
  const workbook = ext === 'csv'
    ? XLSX.read(decodeCsv(data), { type: 'string' })
    : XLSX.read(new Uint8Array(data), { type: 'array' });
  const names = workbook.SheetNames;
  if (names.length === 0) {
    container.textContent = t('empty');
    return;
  }

  const tabs = document.createElement('div');
  tabs.className = 'foxel-sheet-tabs';
  const tableHost = document.createElement('div');
  tableHost.className = 'foxel-sheet-host';
  container.replaceChildren(tabs, tableHost);

  const show = (name: string) => {
    for (const button of tabs.querySelectorAll('button')) {
      button.classList.toggle('is-active', button.dataset.sheet === name);
    }
    tableHost.replaceChildren(renderTable(workbook.Sheets[name]));
  };

  if (names.length === 1) tabs.hidden = true;
  for (const name of names) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'foxel-sheet-tab';
    button.dataset.sheet = name;
    button.textContent = name;
    button.addEventListener('click', () => show(name));
    tabs.appendChild(button);
  }
  show(names[0]);
}

function renderTable(sheet: XLSX.WorkSheet | undefined): DocumentFragment {
  const fragment = document.createDocumentFragment();
  if (!sheet) {
    fragment.append(note(t('empty')));
    return fragment;
  }
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: '' });
  if (rows.length === 0) {
    fragment.append(note(t('empty')));
    return fragment;
  }
  const truncated = rows.length > MAX_ROWS || rows.some((row) => Array.isArray(row) && row.length > MAX_COLS);
  const table = document.createElement('table');
  table.className = 'foxel-sheet';
  rows.slice(0, MAX_ROWS).forEach((row, index) => {
    const cells = Array.isArray(row) ? row.slice(0, MAX_COLS) : [];
    const tr = document.createElement('tr');
    for (const value of cells) {
      const cell = document.createElement(index === 0 ? 'th' : 'td');
      cell.textContent = value == null ? '' : String(value);
      tr.appendChild(cell);
    }
    table.appendChild(tr);
  });
  if (truncated) fragment.append(note(t('truncated', { rows: MAX_ROWS, cols: MAX_COLS })));
  fragment.append(table);
  return fragment;
}

function note(text: string): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'foxel-sheet-note';
  el.textContent = text;
  return el;
}
