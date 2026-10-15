import { init } from 'pptx-preview';

export async function renderPptx(container: HTMLElement, data: ArrayBuffer): Promise<() => void> {
  const width = container.clientWidth > 240 ? container.clientWidth - 32 : 960;
  const previewer = init(container, {
    width,
    height: Math.round(width * 9 / 16),
    mode: 'list',
  });
  await previewer.preview(data);
  return () => previewer.destroy();
}
