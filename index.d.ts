export type {Image, Options} from './lib/types.js'
export {default} from './lib/index.js'

// Add custom data supported when `rehype-meta` is added.
declare module 'vfile' {
  interface DataMapMatter extends Options {}
  interface DataMapMeta extends Options {}

  interface DataMap {
    matter: DataMapMatter
    meta: DataMapMeta
  }
}
