---
title: 给博客换了个主题
description: ""
pubDate: 2025-09-13
lastModDate: ''
toc: true
share: true
giscus: true
ogImage: true
---

### Dynamic Class Extraction from `content/projects/data.json`

By default, the original author uses `safelist` to ensure :link[Unocss]{#unocss/unocss} generates the
required classes for the project icons. And this is only handled once at the build time.
When dynamically change the content of `data.json`, the icons are missing.

Solution: use a custom extractor to extract icon classes from the file.

```diff lang=ts title=unocss.config.ts showLineNumbers=false
...
  transformerDirectives,
  transformerVariantGroup,
+  extractorSplit,
} from 'unocss'
+import type { ProjectSchema } from '~/content/schema'


-const projectIcons = projecstData.map((item) => item.icon)
+// const projectIcons = projecstData.map((item) => item.icon)
...

export default defineConfig({
  // Astro 5 no longer pipes `src/content/**/*.{md,mdx}` through Vite
  content: {
-    filesystem: ['./src/{content,pages}/**/*.{md,mdx}'],
+    pipeline: {
+      include: [
+        // the default
+        /\.(vue|svelte|[jt]sx|vine.ts|mdx?|astro|elm|php|phtml|html)($|\?)/,
+        './src/content/projects/data.json',
+      ],
+      // exclude files
+      // exclude: []
+    },
+  },

+  extractors: [
+    {
+      name: "antfustyle-astro-theme/data-extractor",
+      extract(ctx) {
+        if (!ctx.id)
+          return undefined
+        if (ctx.id?.endsWith("projects/data.json")) {
+          try {
+            return (JSON.parse(ctx.code) as ProjectSchema[]).map((v) => v.icon)
+          }
+          // eslint-disable-next-line no-empty
+          catch { }
+        }
+      },
+    },
+    extractorSplit,
+  ],

...

-  // work around the limitation of dynamically constructed utilities
-  // https://unocss.dev/guide/extracting#limitations
  safelist: [
    ...navIcons,
    ...socialIcons,
-    ...projectIcons,
+    // ...projectIcons,


```

> [!NOTE]
> TODO
