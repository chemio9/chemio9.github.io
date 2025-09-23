import type {
  IconNavItem,
  IconSocialItem,
  ResponsiveNavItem,
  ResponsiveSocialItem,
} from './src/types'

import type { ProjectSchema } from '~/content/schema'

import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  extractorSplit,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { UI } from './src/config'

const { internalNavs, socialLinks, githubView } = UI
const navIcons = internalNavs
  .filter(
    item =>
      item.displayMode !== 'alwaysText'
      && item.displayMode !== 'textHiddenOnMobile',
  )
  .map(item => (item as IconNavItem | ResponsiveNavItem).icon)
const socialIcons = socialLinks
  .filter(
    item =>
      item.displayMode !== 'alwaysText'
      && item.displayMode !== 'textHiddenOnMobile',
  )
  .map(item => (item as IconSocialItem | ResponsiveSocialItem).icon)

// const projectIcons = projecstData.map((item) => item.icon)

const githubVersionColor: Record<string, string> = {
  major: 'bg-rose/15 text-rose-7 dark:text-rose-3',
  minor: 'bg-purple/15 text-purple-7 dark:text-purple-3',
  patch: 'bg-green/15 text-green-7 dark:text-green-3',
  pre: 'bg-teal/15 text-teal-7 dark:text-teal-3',
}
const githubVersionClass = Object.keys(githubVersionColor).map(
  k => `github-${k}`,
)
const githubSubLogos = githubView.subLogoMatches.map(item => item[1])

export default defineConfig({
  // Astro 5 no longer pipes `src/content/**/*.{md,mdx}` through Vite
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|vine.ts|mdx?|astro|elm|php|phtml|html)($|\?)/,
        './src/content/projects/data.json',
      ],
      // exclude files
      // exclude: []
    },
    filesystem: [
      './src/content/projects/data.json',
      './src/{content,pages}/**/*.{mdx,md}',
    ],
  },

  extractors: [
    {
      name: 'antfustyle-astro-theme/data-extractor',
      extract(ctx) {
        if (!(ctx.id ?? ''))
          return undefined
        if (ctx.id?.endsWith('projects/data.json')) {
          try {
            return (JSON.parse(ctx.code) as ProjectSchema[]).map(v => v.icon)
          } catch { }
        }
      },
    },
    extractorSplit,
  ],

  // will be deep-merged to the default theme
  extendTheme: (theme) => {
    // eslint-disable-next-line ts/no-unsafe-return
    return {
      ...theme,
      // eslint-disable-next-line ts/no-unsafe-assignment
      breakpoints: {
        // eslint-disable-next-line ts/no-unsafe-member-access
        ...theme.breakpoints,
        lgp: '1128px',
      },
    }
  },

  // define utility classes and the resulting CSS
  rules: [],

  // combine multiple rules as utility classes
  shortcuts: [
    [
      /^(\w+)-transition(?:-(\d+))?$/,
      match =>
        `transition-${match[1] === 'op' ? 'opacity' : match[1]} duration-${match[2] ? match[2] : '300'} ease-in-out`,
    ],
    [
      /^shadow-custom_(-?\d+)_(-?\d+)_(-?\d+)_(-?\d+)$/,
      ([_, x, y, blur, spread]) =>
        `shadow-[${x}px_${y}px_${blur}px_${spread}px_rgba(0,0,0,0.2)] dark:shadow-[${x}px_${y}px_${blur}px_${spread}px_rgba(255,255,255,0.25)]`,
    ],
    [
      /^btn-(\w+)$/,
      ([_, color]) =>
        `px-2.5 py-1 border border-[#8884]! rounded op-50 transition-all duration-200 ease-out no-underline! hover:(op-100 text-${color} bg-${color}/10)`,
    ],
    [
      /^github-(major|minor|patch|pre)$/,
      ([, version]) => `rounded ${githubVersionColor[version]}`,
    ],
  ],

  // presets are partial configurations
  presets: [
    presetWind3(),
    presetAttributify({
      strict: true,
      prefix: 'u-',
      prefixedOnly: false,
    }),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'height': '1.2em',
        'width': '1.2em',
        'vertical-align': 'text-bottom',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,600,800',
        mono: 'DM Mono:400,600',
        condensed: 'Roboto Condensed',
      },

      processors: createLocalFontProcessor(),
    }),
  ],

  // provides a unified interface to transform source code in order to support conventions
  transformers: [transformerDirectives(), transformerVariantGroup()],

  safelist: [
    ...navIcons,
    ...socialIcons,
    // ...projectIcons,

    /* BaseLayout */
    'focus:not-sr-only',
    'focus:fixed',
    'focus:start-1',
    'focus:top-1.5',
    'focus:op-20',

    /* GithubItem */
    ...githubVersionClass,
    ...githubSubLogos,

    /* Toc */
    'i-ri-menu-2-fill',
    'i-ri-menu-3-fill',
  ],
})
