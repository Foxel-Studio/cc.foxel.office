import type { PluginContext } from './contract';
import { extOf, officeKind } from './formats';
import { t } from './i18n';
import { fetchOffice, MAX_OFFICE_BYTES } from './load';
import { renderDocx } from './render/docx';
import { renderPptx } from './render/pptx';
import { renderSheet } from './render/sheet';
import { resolveMediaUrl } from './url';
import './styles.css';

function statusElement(text: string, isError = false): HTMLDivElement {
  const el = document.createElement('div');
  el.className = isError ? 'foxel-office-status is-error' : 'foxel-office-status';
  el.textContent = text;
  return el;
}

function mount(container: HTMLElement, ctx: PluginContext) {
  const shell = document.createElement('div');
  shell.className = 'foxel-office';
  const status = statusElement(t('loading'));
  shell.appendChild(status);
  container.replaceChildren(shell);

  const view = document.createElement('div');
  view.className = 'foxel-office-view';
  const abort = new AbortController();
  let disposed = false;
  let release: (() => void) | undefined;

  const starting = (async () => {
    const kind = officeKind(ctx.filePath);
    if (kind === 'legacy') {
      status.textContent = t('legacy');
      return;
    }
    if (!kind) throw new Error(t('legacy'));
    const url = await resolveMediaUrl(ctx);
    let data: ArrayBuffer;
    try {
      data = await fetchOffice(url, abort.signal);
    } catch (error) {
      if (error instanceof Error && error.message === 'too-large') {
        throw new Error(t('tooLarge', { size: MAX_OFFICE_BYTES / (1024 * 1024) }));
      }
      throw error;
    }
    if (disposed) return;
    shell.replaceChildren(view);
    if (kind === 'docx') await renderDocx(view, data);
    else if (kind === 'sheet') renderSheet(view, data, extOf(ctx.filePath));
    else release = await renderPptx(view, data);
  })();

  void starting.catch((error) => {
    if (disposed || (error instanceof DOMException && error.name === 'AbortError')) return;
    console.error('[cc.foxel.office]', error);
    shell.replaceChildren(statusElement(error instanceof Error ? error.message : String(error), true));
  });

  return () => {
    disposed = true;
    abort.abort();
    release?.();
    shell.remove();
  };
}

const register = window.FoxelRegister;
if (!register) throw new Error('FoxelRegister is missing');
register({ mount });
