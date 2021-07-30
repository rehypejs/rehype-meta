import {h} from 'hastscript'
import {select} from 'hast-util-select'
import {fromSelector} from 'hast-util-from-selector'

const fbBase = 'https://www.facebook.com/'

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
  twitterCreator
]

export default function meta(options) {
  return transform

  function transform(tree, file) {
    const head = ensure({first: false}, tree, 'head', false)
    const data = Object.assign(
      {pathname: '/', separator: ' - '},
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

function title(data, root) {
  const value = join([data.title, data.name], data.separator)
  let node

  if (data.title || data.name) {
    node = ensure(data, root, 'title')
    node.children = [{type: 'text', value}]
  }
}

function canonical(data, root) {
  const value = url(data)
  let node

  if (value) {
    node = ensure(data, root, 'link[rel=canonical]')
    node.properties.href = value
  }
}

function description(data, root) {
  const value = data.description
  let node

  if (value) {
    node = ensure(data, root, 'meta[name=description]')
    node.properties.content = value
  }
}

function keywords(data, root) {
  const value = [...new Set([...(data.tags || []), ...(data.siteTags || [])])]
  let node

  if (value.length > 0) {
    node = ensure(data, root, 'meta[name=keywords]')
    node.properties.content = value.join(', ')
  }
}

function author(data, root) {
  const value = data.author || data.siteAuthor
  let node

  if (value) {
    node = ensure(data, root, 'meta[name=author]')
    node.properties.content = value
  }
}

function copyright(data, root) {
  const author = data.author || data.siteAuthor
  const date = toDate(data.published) || new Date()
  let node

  if (author && data.copyright === true) {
    node = ensure(data, root, 'meta[name=copyright]')
    node.properties.content =
      '© ' + String(date.getUTCFullYear()) + ' ' + author
  }
}

function themeColor(data, root) {
  const value = data.color
  let node

  if (value) {
    node = ensure(data, root, 'meta[name=theme-color]')
    node.properties.content = prefix(value, '#')
  }
}

function ogType(data, root) {
  const value = data.og
    ? data.type === 'article'
      ? data.type
      : 'website'
    : null
  let node

  if (value) {
    node = ensure(data, root, 'meta[property=og:type]')
    node.properties.content = value
  }
}

function ogSiteName(data, root) {
  const value = data.og ? data.name : null
  let node

  if (value) {
    node = ensure(data, root, 'meta[property=og:site_name]')
    node.properties.content = value
  }
}

function ogUrl(data, root) {
  const value = data.og ? url(data) : null
  let node

  if (value) {
    node = ensure(data, root, 'meta[property=og:url]')
    node.properties.content = value
  }
}

function ogTitle(data, root) {
  const value = data.og ? data.title : null
  let node

  if (value) {
    node = ensure(data, root, 'meta[property=og:title]')
    node.properties.content = value
  }
}

function ogDescription(data, root) {
  const value = data.og ? data.description : null
  let node

  if (value) {
    node = ensure(data, root, 'meta[property=og:description]')
    node.properties.content = value
  }
}

function ogImage(data, root) {
  const images = data.og ? toImages(data.image).slice(0, 6) : []
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

function ogArticlePublishedTime(data, root) {
  const value =
    data.og && data.type === 'article' ? toDate(data.published) : null
  let node

  if (value) {
    node = ensure(data, root, 'meta[property=article:published_time]')
    node.properties.content = value.toISOString()
  }
}

function ogArticleModifiedTime(data, root) {
  const value =
    data.og && data.type === 'article' ? toDate(data.modified) : null
  let node

  if (value) {
    node = ensure(data, root, 'meta[property=article:modified_time]')
    node.properties.content = value.toISOString()
  }
}

function ogArticleAuthor(data, root) {
  const value = data.og && data.type === 'article' ? data.authorFacebook : null
  let node

  if (value) {
    node = ensure(data, root, 'meta[property=article:author]')
    node.properties.content = fbBase + value
  }
}

function ogArticleSection(data, root) {
  const value = data.og && data.type === 'article' ? data.section : null
  let node

  if (value) {
    node = ensure(data, root, 'meta[property=article:section]')
    node.properties.content = value
  }
}

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

function twitterCard(data, root) {
  let value = data.twitter
    ? toImages(data.image)[0]
      ? 'summary_large_image'
      : 'summary'
    : null
  let node

  // If `og:type` is set (which is always created if `og` is on, and
  // `twitter:card` does not exist, then `summary` is implied. So we can remove
  // explicit summary)
  if (value === 'summary' && data.og) {
    value = null
  }

  if (value) {
    node = ensure(data, root, 'meta[name=twitter:card]')
    node.properties.content = value
  }
}

function twitterImage(data, root) {
  const image = data.twitter ? toImages(data.image)[0] : null
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

function twitterSite(data, root) {
  const value = data.twitter ? data.siteTwitter : null
  let node

  if (value) {
    node = ensure(data, root, 'meta[name=twitter:site]')
    node.properties.content = prefix(value, '@')
  }
}

function twitterCreator(data, root) {
  const value = data.twitter ? data.authorTwitter : null
  let node

  if (value) {
    node = ensure(data, root, 'meta[name=twitter:creator]')
    node.properties.content = prefix(value, '@')
  }
}

function ensure(data, root, selector) {
  let node = select(selector, root)

  if (!node) {
    node = fromSelector(selector)
    append(data, root, node)
  }

  return node
}

function append(data, root, node) {
  if (data.first) {
    root.children.push({type: 'text', value: '\n'})
    data.first = false
  }

  root.children.push(node, {type: 'text', value: '\n'})
}

function url(data) {
  return data.origin ? data.origin + data.pathname : ''
}

function join(values, separator) {
  return values.filter(Boolean).join(separator)
}

function prefix(value, prefix) {
  return value.charAt(0) === prefix ? value : prefix + value
}

function toDate(d) {
  return d ? (d.toJSON ? d : new Date(String(d))) : null
}

function toImages(d) {
  const values = Array.isArray(d) ? d : [d]

  return values
    .map((d) => (typeof d === 'string' ? {url: d} : d))
    .filter((d) => d && d.url)
}
