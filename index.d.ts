export {default} from './lib/index.js'

/**
 * Image metadata.
 */
export interface Image {
  /**
   * Alt text of image (optional, example: `'M.T.A. map designed in 1979'`).
   */
  alt?: string | null | undefined
  /**
   * Height of image (optional, example: `'550'`).
   */
  height?: number | string | null | undefined
  /**
   * URL of image (required, example:
   * `'https://static01.nyt.com/images/…/mta-crop-jumbo.jpg'`).
   */
  url: string
  /**
   * Width of image (optional, example: `'1050'`).
   */
  width?: number | string | null | undefined
}

/**
 * Configuration.
 */
export interface Options {
  /**
   * Name of the author of the document (optional, example: `'Jane Doe'`).
   *
   * Inferred by `unified-infer-git-meta` from Git or `vfile-matter` from
   * frontmatter.
   * Used by `rehype-meta`.
   */
  author?: string | null | undefined
  /**
   * Facebook username of the author of the document (optional, example:
   * `'example'`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  authorFacebook?: string | null | undefined
  /**
   * Twitter username of the author of the document (optional, example:
   * `'@janedoe'`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  authorTwitter?: string | null | undefined
  /**
   * Hexadecimal theme color of document or site (optional, `'#bada55'`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  color?: string | null | undefined
  /**
   * Whether to add copyright metadata (default: `false`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  copyright?: boolean | null | undefined
  /**
   * Description of the document (optional, example: `'The city has changed
   * drastically over the past 40 years, yet the M.T.A. map designed in 1979
   * has largely endured.'`).
   *
   * Inferred by `rehype-infer-description-meta` from HTML or `vfile-matter`
   * from frontmatter.
   * Used by `rehype-meta`.
   */
  description?: string | null | undefined
  /**
   * One or more images associated with the document (optional); if strings are
   * passed, they are seen as `Image` objects with a `url` field set to that
   * value.
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  image?: Array<Image | string> | Image | string | null | undefined
  /**
   * Date the document was last modified (example: `'2019-12-03T19:13:00.000Z'`).
   *
   * > 👉 **Note**: parsing a string is inconsistent, prefer dates.
   *
   * Inferred by `unified-infer-git-meta` from Git or `vfile-matter` from
   * frontmatter.
   * Used by `rehype-meta`.
   */
  modified?: Date | string | null | undefined
  /**
   * Name of the whole site (optional, example: `'The New York Times'`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  name?: string | null | undefined
  /**
   * Whether to add Open Graph metadata (default: `false`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  og?: boolean | null | undefined
  /**
   * Whether to add the site name `name` to the `og:title` (default: `false`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  ogNameInTitle?: boolean | null | undefined
  /**
   * Origin the file will be hosted on (optional, example:
   * `https://www.nytimes.com`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  origin?: string | null | undefined
  /**
   * Absolute pathname of where the file will be hosted (default: `/`,
   * example: `/interactive/2019/12/02/nyregion/nyc-subway-map.html`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  pathname?: string | null | undefined
  /**
   * Date the document (or site) was first published (example:
   * `'2019-12-03T19:13:00.000Z'`).
   *
   * > 👉 **Note**: parsing a string is inconsistent, prefer dates.
   *
   * Inferred by `unified-infer-git-meta` from Git or `vfile-matter` from
   * frontmatter.
   * Used by `rehype-meta`.
   */
  published?: Date | string | null | undefined
  /**
   * Reading time of the document in minutes (optional); if two numbers are
   * given, they represent a range of two estimates.
   *
   * Inferred by `rehype-infer-reading-time-meta` from HTML or `vfile-matter`
   * from frontmatter.
   * Used by `rehype-meta`.
   */
  readingTime?:
    | [lowEstimate: number, highEstimate: number]
    | [estimate: number]
    | number
    | null
    | undefined
  /**
   * Section associated with the document (optional, example: `'New York'`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  section?: string | null | undefined
  /**
   * Value to use to join the `title` and `name` together (default: `' - '`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  separator?: string | null | undefined
  /**
   * Name of the author of the whole site (optional, example: `'The New York
   * Times'`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  siteAuthor?: string | null | undefined
  /**
   * Tags associated with the whole site (optional, example: `['US Politics',
   * 'Impeachment', 'NATO', 'London', 'Food', 'Poverty', 'Climate Change',
   * 'Global Warming']`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  siteTags?: string[] | null | undefined
  /**
   * Twitter username of the whole site (optional, example: `'@nytimes'`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  siteTwitter?: string | null | undefined
  /**
   * Tags associated with the document (optional, example: `['Subway', 'Map',
   * 'Public Transit', 'Design', 'MTA', 'Massimo Vignelli', 'NYC']`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  tags?: string[] | null | undefined
  /**
   * Title of the document (optional, example: `'The New York City Subway Map
   * as You’ve Never Seen It Before'`).
   *
   * Inferred by `rehype-infer-title-meta` from HTML or `vfile-matter` from
   * frontmatter.
   * Used by `rehype-document` and `rehype-meta`.
   */
  title?: string | null | undefined
  /**
   * Whether to add Twitter metadata (default: `false`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  twitter?: boolean | null | undefined
  /**
   * What the document refers to (default: `'website'`).
   *
   * Inferred by `vfile-matter` from frontmatter.
   * Used by `rehype-meta`.
   */
  type?: 'article' | 'website' | null | undefined
}

// Add custom data supported when `rehype-meta` is added.
declare module 'vfile' {
  interface DataMapMatter extends Options {}
  interface DataMapMeta extends Options {}

  interface DataMap {
    matter: DataMapMatter
    meta: DataMapMeta
  }
}
