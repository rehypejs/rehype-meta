/**
 * @typedef {import('../complex-types.js')} DoNotTouchThisAsItIncludesAugmentation

 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 *
 * @typedef Image
 * @property {string} url
 * @property {string|undefined} [alt]
 * @property {string|number|undefined} [width]
 * @property {string|number|undefined} [height]
 *
 * @typedef Options
 * @property {boolean} [og=false]
 *   Whether to add Open Graph metadata (`boolean`, default: `false`).
 * @property {boolean} [ogNameInTitle=false]
 *   Whether to add the site name `name` to the `og:title` (`boolean`,
 *   default: `false`).
 * @property {boolean} [twitter=false]
 *   Whether to add Twitter metadata (`boolean`, default: `false`).
 * @property {boolean} [copyright=false]
 *   Whether to add copyright metadata (`boolean`, default: `false`).
 * @property {'article'|'website'} [type='website']
 *   What the document refers to (`'website' | 'article'`, default: `website`).
 * @property {string} [origin]
 *   Origin the file will be hosted on (`string`, optional, example:
 *   `https://www.nytimes.com`).
 * @property {string} [pathname='/']
 *   Absolute pathname of where the file will be hosted (`string`, default: `/`,
 *   example: `/interactive/2019/12/02/nyregion/nyc-subway-map.html`).
 * @property {string} [name]
 *   Name of the whole site (`string`, optional, example: `'The New York
 *   Times'`).
 * @property {Array<string>} [siteTags]
 *   Tags associated with the whole site (`Array<string>`, optional, example:
 *   `['US Politics', 'Impeachment', 'NATO', 'London', 'Food', 'Poverty',
 *   'Climate Change', 'Global Warming']`).
 * @property {string} [siteAuthor]
 *   Name of the author of the whole site (`string`, optional, example:
 *   `'The New York Times'`).
 * @property {string} [siteTwitter]
 *   Twitter username of the whole site (`string`, optional, example:
 *   `'@nytimes'`).
 * @property {string} [color]
 *   Hexadecimal theme color of document or site (`string`, optional, example:
 *   `'#bada55'`).
 * @property {string} [author]
 *   Name of the author of the document (`string`, optional, example:
 *   `'Jane Doe'`).
 * @property {string} [authorTwitter]
 *   Twitter username of the author of the document (`string`, optional,
 *   example: `'@janedoe'`).
 * @property {string} [authorFacebook]
 *   Facebook username of the author of the document (`string`, optional,
 *   example: `'example'`).
 * @property {string} [title]
 *   Title of the document (`string`, optional, example: `'The New York City
 *   Subway Map as You’ve Never Seen It Before'`).
 * @property {string} [separator=' - ']
 *   Value to use to join the `title` and `name` together (`string`, default:
 *   `' - '`).
 * @property {string} [description]
 *   Value used to join the `title` and `name` together if both exist (`string`,
 *   optional, example: `'The city has changed drastically over the past 40
 *   years, yet the M.T.A. map designed in 1979 has largely endured.'`).
 * @property {string} [section]
 *   Section associated with the document (`string`, optional, example: `'New
 *   York'`).
 * @property {Array<string>} [tags]
 *   Tags associated with the document (`Array<string>`, optional, example:
 *   `['Subway', 'Map', 'Public Transit', 'Design', 'MTA', 'Massimo Vignelli',
 *   'NYC']`).
 * @property {string|Image|Array<string|Image>} [image]
 *   One or more images associated with the document (`string`, `Image`, or
 *   `Array<string|Image>`, optional).
 *   If strings are passed, they are seen as `Image` objects with a `url` field
 *   set to that value.
 *
 *   `Image`:
 *
 *   *   `url` (`string`, required, example:
 *        `'https://static01.nyt.com/images/…/mta-crop-jumbo.jpg'`)
 *   *   `alt` (`string`, optional, example: `'M.T.A. map designed in 1979'`)
 *   *   `width` (`string`, optional, example: `'1050'`)
 *   *   `height` (`string`, optional, example: `'550'`)
 * @property {string|Date} [published]
 *   Date the document (or site) was first published (`Date` or `string`,
 *   optional, example: `'2019-12-02T10:00:00.000Z'`).
 *
 *   *Note*: parsing a string is [inconsistent][timestamp], prefer dates.
 * @property {string|Date} [modified]
 *   Date the document was last modified (`Date` or `string`, optional, example:
 *   `'2019-12-03T19:13:00.000Z'`).
 *
 *   *Note*: parsing a string is [inconsistent][timestamp], prefer dates.
 * @property {number|[number]|[number, number]} [readingTime]
 *   Reading time of the document in minutes (`number`, optional).
 *   If two numbers are given, they represent a range of two estimates.
 *
 * @typedef DataFields
 * @property {boolean} first
 *
 * @typedef {Options & DataFields} Data
 */

import {h} from 'hastscript'
import {select} from 'hast-util-select'
import {fromSelector} from 'hast-util-from-selector'

const fbBase = 'https://www.facebook.com/'

const defaultSeparator = ' - '

const generators = [
  title,
  canonical,
  description,
  keywords,
  author,
  copyright,
  themeColor,
  ogType,
  ogSiteName,
  ogUrl,
  ogTitle,
  ogDescription,
  ogImage,
  ogArticlePublishedTime,
  ogArticleModifiedTime,
  ogArticleAuthor,
  ogArticleSection,
  ogArticleTag,
  twitterCard,
  twitterImage,
  twitterSite,
  twitterCreator,
  twitterData
]

/**
 * @type {import('unified').Plugin<[Options] | Array<void>, Root>}
 */
export default function meta(options) {
  return (tree, file) => {
    const head = ensure({first: false}, tree, 'head')
    /** @type {Data} */
    const data = Object.assign(
      {pathname: '/'},
      options,
      file.data.matter,
      file.data.meta,
      {first: true}
    )

    let index = -1
    while (++index < generators.length) {
      generators[index](data, head)
    }

    // Other:
    // generator: unified@version
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function title(data, root) {
  const value = join(
    [data.title, data.name],
    data.separator || defaultSeparator
  )

  if (data.title || data.name) {
    const node = ensure(data, root, 'title')
    node.children = [{type: 'text', value}]
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function canonical(data, root) {
  const value = url(data)

  if (value) {
    const node = ensure(data, root, 'link[rel=canonical]')
    node.properties.href = value
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function description(data, root) {
  const value = data.description

  if (value) {
    const node = ensure(data, root, 'meta[name=description]')
    node.properties.content = value
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function keywords(data, root) {
  const value = [...new Set([...(data.tags || []), ...(data.siteTags || [])])]

  if (value.length > 0) {
    const node = ensure(data, root, 'meta[name=keywords]')
    node.properties.content = value.join(', ')
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function author(data, root) {
  const value = data.author || data.siteAuthor

  if (value) {
    const node = ensure(data, root, 'meta[name=author]')
    node.properties.content = value
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function copyright(data, root) {
  const author = data.author || data.siteAuthor
  const date = toDate(data.published) || new Date()

  if (author && data.copyright === true) {
    const node = ensure(data, root, 'meta[name=copyright]')
    node.properties.content =
      '© ' + String(date.getUTCFullYear()) + ' ' + author
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function themeColor(data, root) {
  const value = data.color

  if (value) {
    const node = ensure(data, root, 'meta[name=theme-color]')
    node.properties.content = prefix(value, '#')
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function ogType(data, root) {
  const value = data.og
    ? data.type === 'article'
      ? data.type
      : 'website'
    : undefined

  if (value) {
    const node = ensure(data, root, 'meta[property=og:type]')
    node.properties.content = value
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function ogSiteName(data, root) {
  const value = data.og ? data.name : undefined

  if (value) {
    const node = ensure(data, root, 'meta[property=og:site_name]')
    node.properties.content = value
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function ogUrl(data, root) {
  const value = data.og ? url(data) : undefined

  if (value) {
    const node = ensure(data, root, 'meta[property=og:url]')
    node.properties.content = value
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function ogTitle(data, root) {
  if (data.og) {
    const value = data.ogNameInTitle
      ? join([data.title, data.name], data.separator || defaultSeparator)
      : data.title

    if (value) {
      const node = ensure(data, root, 'meta[property=og:title]')
      node.properties.content = value
    }
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function ogDescription(data, root) {
  const value = data.og ? data.description : undefined

  if (value) {
    const node = ensure(data, root, 'meta[property=og:description]')
    node.properties.content = value
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function ogImage(data, root) {
  const images = data.og ? toImages(data.image).slice(0, 6) : []
  /** @type {Array<keyof Image>} */
  const keys = ['url', 'alt', 'width', 'height']
  let index = -1

  while (++index < images.length) {
    const image = images[index]
    let offset = -1

    while (++offset < keys.length) {
      const key = keys[offset]
      const value = image[key]

      if (value) {
        append(
          data,
          root,
          h('meta', {
            property: 'og:image' + (key === 'url' ? '' : ':' + key),
            content: value
          })
        )
      }
    }
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function ogArticlePublishedTime(data, root) {
  const value =
    data.og && data.type === 'article' ? toDate(data.published) : undefined

  if (value) {
    const node = ensure(data, root, 'meta[property=article:published_time]')
    node.properties.content = value.toISOString()
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function ogArticleModifiedTime(data, root) {
  const value =
    data.og && data.type === 'article' ? toDate(data.modified) : undefined

  if (value) {
    const node = ensure(data, root, 'meta[property=article:modified_time]')
    node.properties.content = value.toISOString()
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function ogArticleAuthor(data, root) {
  const value =
    data.og && data.type === 'article' ? data.authorFacebook : undefined

  if (value) {
    const node = ensure(data, root, 'meta[property=article:author]')
    node.properties.content = fbBase + value
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function ogArticleSection(data, root) {
  const value = data.og && data.type === 'article' ? data.section : undefined

  if (value) {
    const node = ensure(data, root, 'meta[property=article:section]')
    node.properties.content = value
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function ogArticleTag(data, root) {
  const value =
    data.og && data.type === 'article' ? (data.tags || []).slice(0, 6) : []
  let index = -1

  while (++index < value.length) {
    append(
      data,
      root,
      h('meta', {property: 'article:tag', content: value[index]})
    )
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function twitterCard(data, root) {
  const value = data.twitter
    ? toImages(data.image)[0]
      ? 'summary_large_image'
      : 'summary'
    : undefined

  // If `og:type` is set (which is always created if `og` is on, and
  // `twitter:card` does not exist, then `summary` is implied. So we can remove
  // explicit summary)
  if (value === 'summary' && data.og) {
    return
  }

  if (value) {
    const node = ensure(data, root, 'meta[name=twitter:card]')
    node.properties.content = value
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function twitterImage(data, root) {
  const image = data.twitter ? toImages(data.image)[0] : undefined
  /** @type {Array<keyof Image>} */
  const keys = ['url', 'alt']
  let index = -1

  if (image) {
    while (++index < keys.length) {
      const key = keys[index]
      const value = image[key]

      if (value) {
        append(
          data,
          root,
          h('meta', {
            name: 'twitter:image' + (key === 'url' ? '' : ':' + key),
            content: value
          })
        )
      }
    }
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function twitterSite(data, root) {
  const value = data.twitter ? data.siteTwitter : undefined

  if (value) {
    const node = ensure(data, root, 'meta[name=twitter:site]')
    node.properties.content = prefix(value, '@')
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function twitterCreator(data, root) {
  const value = data.twitter ? data.authorTwitter : undefined

  if (value) {
    const node = ensure(data, root, 'meta[name=twitter:creator]')
    node.properties.content = prefix(value, '@')
  }
}

/**
 * @param {Data} data
 * @param {Element} root
 */
function twitterData(data, root) {
  const {twitter, section, readingTime} = data
  const time = (
    readingTime
      ? Array.isArray(readingTime)
        ? readingTime
        : [readingTime, readingTime]
      : []
  ).map((d) => Math.ceil(d))
  /** @type {string|undefined} */
  let timeLabel

  if (time.length > 1 && time[0] !== time[1]) {
    timeLabel = time[0] + '-' + time[1] + ' minutes'
  } else if (time[0]) {
    timeLabel = time[0] + ' minute' + (time[0] > 1 ? 's' : '')
  }

  const items = twitter
    ? [
        {label: 'Posted in', data: section},
        {label: 'Reading time', data: timeLabel}
      ].filter((d) => d.data !== undefined)
    : []

  let index = -1

  while (++index < items.length) {
    const no = index + 1
    ensure(
      data,
      root,
      'meta[name=twitter:label' + no + ']'
    ).properties.content = items[index].label
    ensure(data, root, 'meta[name=twitter:data' + no + ']').properties.content =
      items[index].data
  }
}

/**
 * @param {Data} data
 * @param {Root|Element} root
 * @param {string} selector
 * @returns {Element & Required<Pick<Element, 'properties'>>}
 */
function ensure(data, root, selector) {
  let node = select(selector, root)

  if (!node) {
    node = fromSelector(selector)
    append(data, root, node)
  }

  // Always available.
  /* c8 ignore next 3 */
  if (!node.properties) {
    node.properties = {}
  }

  // @ts-expect-error: hush.
  return node
}

/**
 * @param {Data} data
 * @param {Root|Element} root
 * @param {Element} node
 */
function append(data, root, node) {
  if (data.first) {
    root.children.push({type: 'text', value: '\n'})
    data.first = false
  }

  root.children.push(node, {type: 'text', value: '\n'})
}

/**
 * @param {Data} data
 * @returns {string}
 */
function url(data) {
  return data.origin ? data.origin + data.pathname : ''
}

/**
 * @template Thing
 * @param {Array<Thing>} values
 * @param {string} separator
 * @returns {string}
 */
function join(values, separator) {
  return values.filter(Boolean).join(separator)
}

/**
 * @param {string} value
 * @param {string} prefix
 * @returns {string}
 */
function prefix(value, prefix) {
  return value.charAt(0) === prefix ? value : prefix + value
}

/**
 * @param {Date|string|undefined} d
 * @returns {Date|undefined}
 */
function toDate(d) {
  return d
    ? typeof d === 'object' && 'toJSON' in d
      ? d
      : new Date(String(d))
    : undefined
}

/**
 * @param {string|Image|Array<string|Image>} [d]
 * @returns {Array<Image>}
 */
function toImages(d) {
  const values = d ? (Array.isArray(d) ? d : [d]) : []

  return values
    .map((d) => (typeof d === 'string' ? {url: d} : d))
    .filter((d) => d && d.url)
}
