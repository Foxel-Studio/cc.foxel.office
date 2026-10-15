import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { OFFICE_FORMATS, officeKind } from './formats';
import { decodeCsv } from './load';

test('manifest extensions stay aligned and the plugin is file-only', () => {
  const manifest = JSON.parse(readFileSync(new URL('../manifest.json', import.meta.url), 'utf8')) as {
    key: string;
    name: string;
    frontend: { supportedExts: string[]; openApp: boolean };
  };
  assert.equal(manifest.key, 'cc.foxel.office');
  assert.equal(manifest.name, 'Office');
  assert.deepEqual(manifest.frontend.supportedExts, OFFICE_FORMATS.map((item) => item.ext));
  assert.equal(manifest.frontend.openApp, false);
});

test('classifies office files', () => {
  assert.equal(officeKind('/a/Report.DOCX'), 'docx');
  assert.equal(officeKind('book.xlsx'), 'sheet');
  assert.equal(officeKind('old.doc'), 'legacy');
  assert.equal(officeKind('slides.pptx'), 'pptx');
  assert.equal(officeKind('notes.txt'), null);
});

test('decodes gbk csv when the bytes are not utf-8', () => {
  const gbk = Uint8Array.from([0xd6, 0xd0, 0xce, 0xc4]);
  assert.equal(decodeCsv(gbk.buffer), '中文');
  const utf8 = new TextEncoder().encode('名字');
  assert.equal(decodeCsv(utf8.buffer), '名字');
});
