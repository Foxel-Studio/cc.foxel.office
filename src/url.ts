import type { PluginContext } from './contract';
import { t } from './i18n';

export async function resolveMediaUrl(ctx: PluginContext): Promise<string> {
  if (ctx.urls.downloadUrl) return ctx.urls.downloadUrl;
  try {
    const url = await ctx.host.getTempLink?.(ctx.filePath);
    if (url) return url;
  } catch {
    // Fall through to the stream URL.
  }
  if (ctx.host.getStreamUrl) return ctx.host.getStreamUrl(ctx.filePath);
  const stream = window.__FOXEL_EXTERNALS__?.foxelApi?.vfs.streamUrl(ctx.filePath);
  if (stream) return stream;
  throw new Error(t('noUrl'));
}
