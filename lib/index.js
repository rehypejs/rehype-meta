/**

 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Parents} Parents
 * @typedef {import('hast').Root} Root
 *
 * @typedef {import('vfile').VFile} VFile
 *
 * @typedef {import('../index.js').Image} Image
 * @typedef {import('../index.js').Options} Options
 */

/**
 * @typedef {Options & StateFields} State
 *   Info passed around.
 *
 * @typedef StateFields
 *   Extra fields.
 * @property {boolean} first
 *   Whether no element was added yet.
 */

import {h} from 'hastscript'
import {fromSelector} from 'hast-util-from-selector'
import {select} from 'hast-util-select'

const fbBase = 'https://www.facebook.com/'

const defaultSeparator = ' - '

// Note: order means how things are added to the document.
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
 * Add metadata to the `<head>`.
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function meta(options) {
  /**
   * @param {Root} tree
   *   Tree.
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree, file) {
    const head = ensure({first: false}, tree, 'head')
    /** @type {State} */
    const state = {
      pathname: '/',
      ...options,
      ...file.data.matter,
      ...file.data.meta,
      first: true
    }

    let index = -1
    while (++index < generators.length) {
      generators[index](state, head)
    }

    // Other:
    // generator: unified@version
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function title(state, root) {
  const value = join(
    [state.title, state.name],
    state.separator || defaultSeparator
  )

  if (state.title || state.name) {
    const node = ensure(state, root, 'title')
    node.children = [{type: 'text', value}]
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function canonical(state, root) {
  const value = url(state)

  if (value) {
    const node = ensure(state, root, 'link[rel=canonical]')
    node.properties.href = value
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function description(state, root) {
  const value = state.description

  if (value) {
    const node = ensure(state, root, 'meta[name=description]')
    node.properties.content = value
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function keywords(state, root) {
  const value = [...new Set([...(state.tags || []), ...(state.siteTags || [])])]

  if (value.length > 0) {
    const node = ensure(state, root, 'meta[name=keywords]')
    node.properties.content = value.join(', ')
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function author(state, root) {
  const value = state.author || state.siteAuthor

  if (value) {
    const node = ensure(state, root, 'meta[name=author]')
    node.properties.content = value
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function copyright(state, root) {
  const author = state.author || state.siteAuthor
  const date = toDate(state.published) || new Date()

  if (author && state.copyright === true) {
    const node = ensure(state, root, 'meta[name=copyright]')
    node.properties.content =
      '© ' + String(date.getUTCFullYear()) + ' ' + author
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function themeColor(state, root) {
  const value = state.color

  if (value) {
    const node = ensure(state, root, 'meta[name=theme-color]')
    node.properties.content = prefix(value, '#')
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function ogType(state, root) {
  const value = state.og
    ? state.type === 'article'
      ? state.type
      : 'website'
    : undefined

  if (value) {
    const node = ensure(state, root, 'meta[property="og:type"]')
    node.properties.content = value
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function ogSiteName(state, root) {
  const value = state.og ? state.name : undefined

  if (value) {
    const node = ensure(state, root, 'meta[property="og:site_name"]')
    node.properties.content = value
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function ogUrl(state, root) {
  const value = state.og ? url(state) : undefined

  if (value) {
    const node = ensure(state, root, 'meta[property="og:url"]')
    node.properties.content = value
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function ogTitle(state, root) {
  if (state.og) {
    const value = state.ogNameInTitle
      ? join([state.title, state.name], state.separator || defaultSeparator)
      : state.title

    if (value) {
      const node = ensure(state, root, 'meta[property="og:title"]')
      node.properties.content = value
    }
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function ogDescription(state, root) {
  const value = state.og ? state.description : undefined

  if (value) {
    const node = ensure(state, root, 'meta[property="og:description"]')
    node.properties.content = value
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function ogImage(state, root) {
  const images = state.og ? toImages(state.image).slice(0, 6) : []
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
          state,
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
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function ogArticlePublishedTime(state, root) {
  const value =
    state.og && state.type === 'article' ? toDate(state.published) : undefined

  if (value) {
    const node = ensure(state, root, 'meta[property="article:published_time"]')
    node.properties.content = value.toISOString()
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function ogArticleModifiedTime(state, root) {
  const value =
    state.og && state.type === 'article' ? toDate(state.modified) : undefined

  if (value) {
    const node = ensure(state, root, 'meta[property="article:modified_time"]')
    node.properties.content = value.toISOString()
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function ogArticleAuthor(state, root) {
  const value =
    state.og && state.type === 'article' ? state.authorFacebook : undefined

  if (value) {
    const node = ensure(state, root, 'meta[property="article:author"]')
    node.properties.content = fbBase + value
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function ogArticleSection(state, root) {
  const value = state.og && state.type === 'article' ? state.section : undefined

  if (value) {
    const node = ensure(state, root, 'meta[property="article:section"]')
    node.properties.content = value
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function ogArticleTag(state, root) {
  const value =
    state.og && state.type === 'article' ? (state.tags || []).slice(0, 6) : []
  let index = -1

  while (++index < value.length) {
    append(
      state,
      root,
      h('meta', {property: 'article:tag', content: value[index]})
    )
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function twitterCard(state, root) {
  const value = state.twitter
    ? toImages(state.image)[0]
      ? 'summary_large_image'
      : 'summary'
    : undefined

  // If `og:type` is set (which is always created if `og` is on, and
  // `twitter:card` does not exist, then `summary` is implied. So we can remove
  // explicit summary)
  if (value === 'summary' && state.og) {
    return
  }

  if (value) {
    const node = ensure(state, root, 'meta[name="twitter:card"]')
    node.properties.content = value
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function twitterImage(state, root) {
  const image = state.twitter ? toImages(state.image)[0] : undefined
  /** @type {Array<keyof Image>} */
  const keys = ['url', 'alt']
  let index = -1

  if (image) {
    while (++index < keys.length) {
      const key = keys[index]
      const value = image[key]

      if (value) {
        append(
          state,
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
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function twitterSite(state, root) {
  const value = state.twitter ? state.siteTwitter : undefined

  if (value) {
    const node = ensure(state, root, 'meta[name="twitter:site"]')
    node.properties.content = prefix(value, '@')
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function twitterCreator(state, root) {
  const value = state.twitter ? state.authorTwitter : undefined

  if (value) {
    const node = ensure(state, root, 'meta[name="twitter:creator"]')
    node.properties.content = prefix(value, '@')
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Element} root
 *   Head element.
 * @returns {undefined}
 *   Nothing.
 */
function twitterData(state, root) {
  const {readingTime, section, twitter} = state
  const time = (
    readingTime
      ? Array.isArray(readingTime)
        ? readingTime
        : [readingTime, readingTime]
      : []
  ).map(function (d) {
    return Math.ceil(d)
  })
  /** @type {string | undefined} */
  let timeLabel

  if (time.length > 1 && time[0] !== time[1]) {
    timeLabel = time[0] + '-' + time[1] + ' minutes'
  } else if (time[0]) {
    timeLabel = time[0] + ' minute' + (time[0] > 1 ? 's' : '')
  }

  const items = twitter
    ? [
        {data: section, label: 'Posted in'},
        {data: timeLabel, label: 'Reading time'}
      ].filter(function (d) {
        return d.data !== undefined
      })
    : []

  let index = -1

  while (++index < items.length) {
    const no = index + 1
    ensure(
      state,
      root,
      'meta[name="twitter:label' + no + '"]'
    ).properties.content = items[index].label
    ensure(
      state,
      root,
      'meta[name="twitter:data' + no + '"]'
    ).properties.content = items[index].data
  }
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Parents} scope
 *   Parent to search in and append to.
 * @param {string} selector
 *   Selector to search (and create if needed).
 * @returns {Element}
 *   Found or created element.
 */
function ensure(state, scope, selector) {
  let node = select(selector, scope)

  if (!node) {
    node = fromSelector(selector)
    append(state, scope, node)
  }

  return node
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Parents} scope
 *   Node to append to.
 * @param {Element} node
 *   Node to append.
 * @returns {undefined}
 *   Nothing.
 */
function append(state, scope, node) {
  if (state.first) {
    scope.children.push({type: 'text', value: '\n'})
    state.first = false
  }

  scope.children.push(node, {type: 'text', value: '\n'})
}

/**
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   URL.
 */
function url(state) {
  return state.origin ? state.origin + state.pathname : ''
}

/**
 * @param {Array<unknown>} values
 *   Values to join.
 * @param {string} separator
 *   Separator to use.
 * @returns {string}
 *   Joined value.
 */
function join(values, separator) {
  return values.filter(Boolean).join(separator)
}

/**
 * @param {string} value
 *   Value to prefix.
 * @param {string} prefix
 *   Character.
 * @returns {string}
 *   Prefixed value.
 */
function prefix(value, prefix) {
  return value.charAt(0) === prefix ? value : prefix + value
}

/**
 * @param {Date | string | null | undefined} d
 *   Turn a date-like value into a date.
 * @returns {Date | undefined}
 *   Date.
 */
function toDate(d) {
  return d
    ? typeof d === 'object' && 'toJSON' in d
      ? d
      : new Date(String(d))
    : undefined
}

/**
 * @param {Array<Image | string> | Image | string | null | undefined} d
 *   Turn image values into an array of images.
 * @returns {Array<Image>}
 *   Images.
 */
function toImages(d) {
  const values = d ? (Array.isArray(d) ? d : [d]) : []

  return values
    .map(function (d) {
      return typeof d === 'string' ? {url: d} : d
    })
    .filter(function (d) {
      return d && d.url
    })
}
