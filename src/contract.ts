export interface FoxelHostApi {
  close: () => Promise<void>;
  showMessage: (type: 'success' | 'error' | 'info' | 'warning', content: string) => void;
  getTempLink?: (filePath: string) => Promise<string>;
  getStreamUrl?: (filePath: string) => string;
}

export interface PluginContext {
  filePath: string;
  urls: { downloadUrl: string; streamUrl?: string };
  host: FoxelHostApi;
}

export type PluginCleanup = () => void | Promise<void>;

export interface RegisteredPlugin {
  mount: (container: HTMLElement, ctx: PluginContext) => void | PluginCleanup | Promise<void | PluginCleanup>;
  unmount?: (container: HTMLElement) => void | Promise<void>;
}

export interface FoxelExternals {
  foxelApi?: { vfs: { streamUrl: (path: string) => string } };
}

declare global {
  interface Window {
    __FOXEL_EXTERNALS__?: FoxelExternals;
    FoxelRegister?: (plugin: RegisteredPlugin) => void;
  }
}
