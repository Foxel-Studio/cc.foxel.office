# Office

只通过办公文件打开，不能从插件页单独打开。

| 扩展名 | 预览方式 |
| --- | --- |
| docx | docx-preview，按页显示 |
| xlsx、xls、csv | SheetJS 读成表格，多个工作表可以切换。最多显示 1000 行、40 列 |
| pptx | pptx-preview，按页列出幻灯片 |
| doc、ppt | 浏览器无法解析这些旧格式，会提示另存为 docx 或 pptx |

这些格式要把整个文件读进浏览器后才能解析，超过 40 MB 会拒绝预览。CSV 若不是合法 UTF-8，会按 GBK 解码。

```bash
cd plugins/cc.foxel.office
bun install
bun test
bun run foxpkg
```

安装包是 `dist/cc.foxel.office.foxpkg`。
