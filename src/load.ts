export const MAX_OFFICE_BYTES = 40 * 1024 * 1024;

export async function fetchOffice(url: string, signal: AbortSignal): Promise<ArrayBuffer> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const declared = Number(response.headers.get('content-length') || 0);
  if (declared > MAX_OFFICE_BYTES) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error('too-large');
  }
  const data = await response.arrayBuffer();
  if (data.byteLength > MAX_OFFICE_BYTES) throw new Error('too-large');
  return data;
}

/** CSV from Excel on Chinese Windows is often GBK when it is not valid UTF-8. */
export function decodeCsv(data: ArrayBuffer): string {
  const bytes = new Uint8Array(data);
  const utf8 = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  if (utf8) return new TextDecoder('utf-8').decode(bytes);
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('gbk').decode(bytes);
  }
}
