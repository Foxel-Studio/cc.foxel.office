import { renderAsync } from 'docx-preview';

export async function renderDocx(container: HTMLElement, data: ArrayBuffer): Promise<void> {
  await renderAsync(data, container, container, {
    className: 'foxel-docx',
    inWrapper: true,
    breakPages: true,
    renderHeaders: true,
    renderFooters: true,
  });
}
