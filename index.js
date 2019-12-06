'use strict'

var h = require('hastscript')
var $ = require('hast-util-select').select
var from = require('hast-util-from-selector')

module.exports = meta

var fbBase = 'https://www.facebook.com/'

var generators = [
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

function meta(options) {
  return transform

  function transform(tree, file) {
    var head = ensure({first: false}, tree, 'head', false)
    var data = Object.assign(
      {pathname: '/', separator: ' - '},
      options,
      file.data.matter,
      file.data.meta,
      {first: true}
    )

    generators.forEach(generate)

    function generate(fn) {
      fn(data, head)
    }

    // Other:
    // generator: unified@version
  }
}

function title(data, root) {
  var value = join([data.title, data.name], data.separator)
  var node

  if (data.title || data.name) {
    node = ensure(data, root, 'title')
    node.children = [{type: 'text', value: value}]
  }
}

function canonical(data, root) {
  var value = url(data)
  var node

  if (value) {
    node = ensure(data, root, 'link[rel=canonical]')
    node.properties.href = value
  }
}

function description(data, root) {
  var value = data.description
  var node

  if (value) {
    node = ensure(data, root, 'meta[name=description]')
    node.properties.content = value
  }
}

function keywords(data, root) {
  var value = [].concat(data.tags || [], data.siteTags || []).filter(unique)
  var node

  if (value.length !== 0) {
    node = ensure(data, root, 'meta[name=keywords]')
    node.properties.content = value.join(', ')
  }
}

function author(data, root) {
  var value = data.author || data.siteAuthor
  var node

  if (value) {
    node = ensure(data, root, 'meta[name=author]')
    node.properties.content = value
  }
}

function copyright(data, root) {
  var author = data.author || data.siteAuthor
  var date = toDate(data.published) || new Date()
  var node

  if (author && data.copyright === true) {
    node = ensure(data, root, 'meta[name=copyright]')
    node.properties.content =
      '© ' + String(date.getUTCFullYear()) + ' ' + author
  }
}

function themeColor(data, root) {
  var value = data.color
  var node

  if (value) {
    node = ensure(data, root, 'meta[name=theme-color]')
    node.properties.content = prefix(value, '#')
  }
}

function ogType(data, root) {
  var value = data.og ? (data.type === 'article' ? data.type : 'website') : null
  var node

  if (value) {
    node = ensure(data, root, 'meta[property=og:type]')
    node.properties.content = value
  }
}

function ogSiteName(data, root) {
  var value = data.og ? data.name : null
  var node

  if (value) {
    node = ensure(data, root, 'meta[property=og:site_name]')
    node.properties.content = value
  }
}

function ogUrl(data, root) {
  var value = data.og ? url(data) : null
  var node

  if (value) {
    node = ensure(data, root, 'meta[property=og:url]')
    node.properties.content = value
  }
}

function ogTitle(data, root) {
  var value = data.og ? data.title : null
  var node

  if (value) {
    node = ensure(data, root, 'meta[property=og:title]')
    node.properties.content = value
  }
}

function ogDescription(data, root) {
  var value = data.og ? data.description : null
  var node

  if (value) {
    node = ensure(data, root, 'meta[property=og:description]')
    node.properties.content = value
  }
}

function ogImage(data, root) {
  var value = data.og ? toImages(data.image).slice(0, 6) : []
  var keys = ['url', 'alt', 'width', 'height']

  value.forEach(add)

  function add(value) {
    keys.forEach(each)

    function each(key) {
      var val = value[key]
      var node

      if (!val) {
        return
      }

      node = h('meta', {
        property: 'og:image' + (key === 'url' ? '' : ':' + key),
        content: val
      })

      append(data, root, node)
    }
  }
}

function ogArticlePublishedTime(data, root) {
  var value = data.og && data.type === 'article' ? toDate(data.published) : null
  var node

  if (value) {
    node = ensure(data, root, 'meta[property=article:published_time]')
    node.properties.content = value.toISOString()
  }
}

function ogArticleModifiedTime(data, root) {
  var value = data.og && data.type === 'article' ? toDate(data.modified) : null
  var node

  if (value) {
    node = ensure(data, root, 'meta[property=article:modified_time]')
    node.properties.content = value.toISOString()
  }
}

function ogArticleAuthor(data, root) {
  var value = data.og && data.type === 'article' ? data.authorFacebook : null
  var node

  if (value) {
    node = ensure(data, root, 'meta[property=article:author]')
    node.properties.content = fbBase + value
  }
}

function ogArticleSection(data, root) {
  var value = data.og && data.type === 'article' ? data.section : null
  var node

  if (value) {
    node = ensure(data, root, 'meta[property=article:section]')
    node.properties.content = value
  }
}

function ogArticleTag(data, root) {
  var value =
    data.og && data.type === 'article' ? (data.tags || []).slice(0, 6) : []

  value.forEach(add)

  function add(value) {
    append(data, root, h('meta', {property: 'article:tag', content: value}))
  }
}

function twitterCard(data, root) {
  var value = data.twitter
    ? toImages(data.image)[0]
      ? 'summary_large_image'
      : 'summary'
    : null
  var node

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
  var value = data.twitter ? toImages(data.image)[0] : null
  var keys = ['url', 'alt']

  if (value) {
    keys.forEach(each)
  }

  function each(key) {
    var val = value[key]
    var node

    if (!val) {
      return
    }

    node = h('meta', {
      name: 'twitter:image' + (key === 'url' ? '' : ':' + key),
      content: val
    })

    append(data, root, node)
  }
}

function twitterSite(data, root) {
  var value = data.twitter ? data.siteTwitter : null
  var node

  if (value) {
    node = ensure(data, root, 'meta[name=twitter:site]')
    node.properties.content = prefix(value, '@')
  }
}

function twitterCreator(data, root) {
  var value = data.twitter ? data.authorTwitter : null
  var node

  if (value) {
    node = ensure(data, root, 'meta[name=twitter:creator]')
    node.properties.content = prefix(value, '@')
  }
}

function ensure(data, root, selector) {
  var node = $(selector, root)

  if (!node) {
    node = from(selector)
    append(data, root, node)
  }

  return node
}

function append(data, root, node) {
  if (data.first) {
    root.children.push({type: 'text', value: '\n'})
    data.first = false
  }

  root.children.push(node)

  root.children.push({type: 'text', value: '\n'})
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
  var values = d && typeof d === 'object' && 'length' in d ? d : [d]

  return values.map(map).filter(filter)

  function map(d) {
    return typeof d === 'string' ? {url: d} : d
  }

  function filter(d) {
    return d && d.url
  }
}

function unique(d, i, all) {
  return all.indexOf(d) === i
}
