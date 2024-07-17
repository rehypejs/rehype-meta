import type {Options as RehypeMetaFields} from './lib/types.js'

export type {Image, Options} from './lib/types.js'
export {default} from './lib/index.js'

// Add custom data supported when `rehype-meta` is added.
declare module 'vfile' {
  interface DataMapMatter extends RehypeMetaFields {}
  interface DataMapMeta extends RehypeMetaFields {}

  interface DataMap {
    matter: DataMapMatter
    meta: DataMapMeta
  }
}
