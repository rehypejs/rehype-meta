import type {Image} from './lib/index.js'

/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare module 'vfile' {
  interface DataMap {
    // Note: when changing `meta`, please copy/paste the changes into `matter` afterwards.
    meta: {
      /**
       * Whether to add Open Graph metadata.
       *
       * Used by `rehype-meta`.
       */
      og?: boolean

      /**
       * Whether to add the site name `name` to the `og:title`.
       *
       * Used by `rehype-meta`.
       */
      ogNameInTitle?: boolean

      /**
       * Whether to add Twitter metadata.
       *
       * Used by `rehype-meta`.
       */
      twitter?: boolean

      /**
       * Whether to add copyright metadata.
       *
       * Used by `rehype-meta`.
       */
      copyright?: boolean

      /**
       * What the document refers to.
       *
       * Used by `rehype-meta`.
       */
      type?: 'article' | 'website'

      /**
       * Origin the file will be hosted on.
       *
       * Used by `rehype-meta`.
       */
      origin?: string

      /**
       * Absolute pathname of where the file will be hosted.
       *
       * Used by `rehype-meta`.
       */
      pathname?: string

      /**
       * Name of the whole site.
       *
       * Used by `rehype-meta`.
       */
      name?: string

      /**
       * Tags associated with the whole site.
       *
       * Used by `rehype-meta`.
       */
      siteTags?: string[]

      /**
       * Name of the author of the whole site.
       *
       * Used by `rehype-meta`.
       */
      siteAuthor?: string

      /**
       * Twitter username of the whole site.
       *
       * Used by `rehype-meta`.
       */
      siteTwitter?: string

      /**
       * Hexadecimal theme color of document or site.
       *
       * Used by `rehype-meta`.
       */
      color?: string

      /**
       * Name of the author of the document.
       *
       * Used by `rehype-meta`.
       */
      author?: string

      /**
       * Twitter username of the author of the document.
       *
       * Used by `rehype-meta`.
       */
      authorTwitter?: string

      /**
       * Facebook username of the author of the document.
       *
       * Used by `rehype-meta`.
       */
      authorFacebook?: string

      /**
       * Title of the document.
       *
       * Used by `rehype-meta`.
       */
      title?: string

      /**
       * Value to use to join the `title` and `name` together.
       *
       * Used by `rehype-meta`.
       */
      separator?: string

      /**
       * Value used to join the `title` and `name` together if both exist.
       *
       * Used by `rehype-meta`.
       */
      description?: string

      /**
       * Section associated with the document.
       *
       * Used by `rehype-meta`.
       */
      section?: string

      /**
       * Tags associated with the document.
       *
       * Used by `rehype-meta`.
       */
      tags?: string[]

      /**
       * One or more images associated with the document.
       * If strings are passed, they are seen as `Image` objects with a `url`
       * field set to that value.
       *
       * Used by `rehype-meta`.
       */
      tags?: string | Image | Array<string | Image>

      /**
       * Date the document (or site) was first published.
       *
       * > 👉 **Note**: parsing a string is inconsistent, prefer dates.
       *
       * Used by `rehype-meta`.
       */
      published?: string | Date

      /**
       * Date the document was last modified.
       *
       * > 👉 **Note**: parsing a string is inconsistent, prefer dates.
       *
       * Used by `rehype-meta`.
       */
      modified?: string | Date

      /**
       * Reading time of the document in minutes.
       *
       * If two numbers are given, they represent a range of two estimates.
       *
       * Used by `rehype-meta`.
       */
      readingTime?: number | [number] | [number, number]
    }

    // Note: do not change `matter` manually.
    // please copy/paste the changes from `meta` instead.
    matter: {
      /**
       * Whether to add Open Graph metadata.
       *
       * Used by `rehype-meta`.
       */
      og?: boolean

      /**
       * Whether to add the site name `name` to the `og:title`.
       *
       * Used by `rehype-meta`.
       */
      ogNameInTitle?: boolean

      /**
       * Whether to add Twitter metadata.
       *
       * Used by `rehype-meta`.
       */
      twitter?: boolean

      /**
       * Whether to add copyright metadata.
       *
       * Used by `rehype-meta`.
       */
      copyright?: boolean

      /**
       * What the document refers to.
       *
       * Used by `rehype-meta`.
       */
      type?: 'article' | 'website'

      /**
       * Origin the file will be hosted on.
       *
       * Used by `rehype-meta`.
       */
      origin?: string

      /**
       * Absolute pathname of where the file will be hosted.
       *
       * Used by `rehype-meta`.
       */
      pathname?: string

      /**
       * Name of the whole site.
       *
       * Used by `rehype-meta`.
       */
      name?: string

      /**
       * Tags associated with the whole site.
       *
       * Used by `rehype-meta`.
       */
      siteTags?: string[]

      /**
       * Name of the author of the whole site.
       *
       * Used by `rehype-meta`.
       */
      siteAuthor?: string

      /**
       * Twitter username of the whole site.
       *
       * Used by `rehype-meta`.
       */
      siteTwitter?: string

      /**
       * Hexadecimal theme color of document or site.
       *
       * Used by `rehype-meta`.
       */
      color?: string

      /**
       * Name of the author of the document.
       *
       * Used by `rehype-meta`.
       */
      author?: string

      /**
       * Twitter username of the author of the document.
       *
       * Used by `rehype-meta`.
       */
      authorTwitter?: string

      /**
       * Facebook username of the author of the document.
       *
       * Used by `rehype-meta`.
       */
      authorFacebook?: string

      /**
       * Title of the document.
       *
       * Used by `rehype-meta`.
       */
      title?: string

      /**
       * Value to use to join the `title` and `name` together.
       *
       * Used by `rehype-meta`.
       */
      separator?: string

      /**
       * Value used to join the `title` and `name` together if both exist.
       *
       * Used by `rehype-meta`.
       */
      description?: string

      /**
       * Section associated with the document.
       *
       * Used by `rehype-meta`.
       */
      section?: string

      /**
       * Tags associated with the document.
       *
       * Used by `rehype-meta`.
       */
      tags?: string[]

      /**
       * One or more images associated with the document.
       * If strings are passed, they are seen as `Image` objects with a `url`
       * field set to that value.
       *
       * Used by `rehype-meta`.
       */
      tags?: string | Image | Array<string | Image>

      /**
       * Date the document (or site) was first published.
       *
       * > 👉 **Note**: parsing a string is inconsistent, prefer dates.
       *
       * Used by `rehype-meta`.
       */
      published?: string | Date

      /**
       * Date the document was last modified.
       *
       * > 👉 **Note**: parsing a string is inconsistent, prefer dates.
       *
       * Used by `rehype-meta`.
       */
      modified?: string | Date

      /**
       * Reading time of the document in minutes.
       *
       * If two numbers are given, they represent a range of two estimates.
       *
       * Used by `rehype-meta`.
       */
      readingTime?: number | [number] | [number, number]
    }
  }
}
/* eslint-enable @typescript-eslint/consistent-type-definitions */
