import { feedLoader } from '@ascorbic/feed-loader'
import { blueskyPostsLoader } from 'astro-loader-bluesky-posts'

import { githubPrsLoader } from 'astro-loader-github-prs'
import { githubReleasesLoader } from 'astro-loader-github-releases'
import { file, glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import {
  pageSchema,
  photoSchema,
  postSchema,
  projectSchema,
  streamSchema,
} from '~/content/schema'

const pages = defineCollection({
  loader: glob({ base: './src/pages', pattern: '**/*.mdx' }),
  schema: pageSchema,
})

const home = defineCollection({
  loader: glob({ base: './src/content/home', pattern: 'index.{md,mdx}' }),
})

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.{md,mdx}' }),
  schema: postSchema,
})

const projects = defineCollection({
  loader: file('./src/content/projects/data.json'),
  schema: projectSchema,
})

const releases = defineCollection({
  loader: githubReleasesLoader({
    mode: 'repoList',
    repos: [
      'atomclub/form-next',
    ],
    monthsBack: 12,
    entryReturnType: 'byRelease',
    clearStore: true,
  }),
})

const prs = defineCollection({
  loader: githubPrsLoader({
    search:
      'repo:chemio9/nvim repo:chemio9/dotfiles repo:atomclub/form-next',
    monthsBack: 6,
    clearStore: true,
  }),
})

const highlights = defineCollection({
  loader: blueskyPostsLoader({
    uris: [
      // 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3larljiyi7s2v',
    ],
    newlineHandling: 'paragraph',
    fetchThread: true,
    threadDepth: 4,
    fetchOnlyAuthorReplies: true,
  }),
})

const photos = defineCollection({
  loader: file('src/content/photos/data.json'),
  schema: photoSchema,
})

const changelog = defineCollection({
  loader: glob({
    base: './src/content/changelog',
    pattern: '**/[^_]*.{md,mdx}',
  }),
  schema: postSchema,
})

const streams = defineCollection({
  loader: file('./src/content/streams/data.json'),
  schema: streamSchema,
})

const feeds = defineCollection({
  loader: feedLoader({
    url: 'https://astro.build/rss.xml',
  }),
})

export const collections = {
  pages,
  home,
  blog,
  projects,
  releases,
  prs,
  highlights,
  photos,
  changelog,
  streams,
  feeds,
}
