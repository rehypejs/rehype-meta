# rehype-meta

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**rehype**][rehype] plugin to add metadata (Open Graph, Twitter) to your head.

## Contents

*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`rehype().use(meta[, options])`](#rehypeusemeta-options)
    *   [`Config`](#config)
*   [Metadata](#metadata)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## Install

[npm][]:

```sh
npm install rehype-meta
```

## Use

Say `example.js` looks as follows:

```js
var report = require('vfile-reporter')
var rehype = require('rehype')
var meta = require('rehype-meta')

rehype()
  .data('settings', {fragment: true})
  .use(meta, {
    twitter: true,
    og: true,
    copyright: true,
    type: 'article',
    origin: 'https://www.nytimes.com',
    pathname: '/interactive/2019/12/02/nyregion/nyc-subway-map.html',
    name: 'The New York Times',
    siteTags: [
      'US Politics',
      'Impeachment',
      'NATO',
      'London',
      'Food',
      'Poverty',
      'Climate Change',
      'Global Warming'
    ],
    siteAuthor: 'The New York Times',
    siteTwitter: '@nytimes',
    author: 'Jane Doe',
    authorTwitter: '@jane',
    authorFacebook: 'janedoe',
    title: 'The New York City Subway Map as You’ve Never Seen It Before',
    separator: ' | ',
    description:
      'The city has changed drastically over the past 40 years, yet the M.T.A. map designed in 1979 has largely endured.',
    section: 'New York',
    tags: [
      'Subway',
      'Map',
      'Public Transit',
      'Design',
      'MTA',
      'Massimo Vignelli',
      'NYC'
    ],
    image: {
      url:
        'https://static01.nyt.com/images/2019/12/02/autossell/mta-promo-image/mta-crop-facebookJumbo.jpg',
      alt: 'M.T.A. map designed in 1979',
      width: '1050',
      height: '550'
    },
    published: '2019-12-02T10:00:00.000Z',
    modified: '2019-12-03T19:13:00.000Z'
  })
  .process('', function(err, file) {
    console.error(report(err || file))
    console.log(String(file))
  })
```

Now, running `node example` yields:

```html
no issues found
<head>
<title>The New York City Subway Map as You’ve Never Seen It Before | The New York Times</title>
<link rel="canonical" href="https://www.nytimes.com/interactive/2019/12/02/nyregion/nyc-subway-map.html">
<meta name="description" content="The city has changed drastically over the past 40 years, yet the M.T.A. map designed in 1979 has largely endured.">
<meta name="keywords" content="Subway, Map, Public Transit, Design, MTA, Massimo Vignelli, NYC, US Politics, Impeachment, NATO, London, Food, Poverty, Climate Change, Global Warming">
<meta name="author" content="Jane Doe">
<meta name="copyright" content="© 2019 Jane Doe">
<meta property="og:type" content="article">
<meta property="og:site_name" content="The New York Times">
<meta property="og:url" content="https://www.nytimes.com/interactive/2019/12/02/nyregion/nyc-subway-map.html">
<meta property="og:title" content="The New York City Subway Map as You’ve Never Seen It Before">
<meta property="og:description" content="The city has changed drastically over the past 40 years, yet the M.T.A. map designed in 1979 has largely endured.">
<meta property="og:image" content="https://static01.nyt.com/images/2019/12/02/autossell/mta-promo-image/mta-crop-facebookJumbo.jpg">
<meta property="og:image:alt" content="M.T.A. map designed in 1979">
<meta property="og:image:width" content="1050">
<meta property="og:image:height" content="550">
<meta property="article:published_time" content="2019-12-02T10:00:00.000Z">
<meta property="article:modified_time" content="2019-12-03T19:13:00.000Z">
<meta property="article:author" content="https://www.facebook.com/janedoe">
<meta property="article:section" content="New York">
<meta property="article:tag" content="Subway">
<meta property="article:tag" content="Map">
<meta property="article:tag" content="Public Transit">
<meta property="article:tag" content="Design">
<meta property="article:tag" content="MTA">
<meta property="article:tag" content="Massimo Vignelli">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://static01.nyt.com/images/2019/12/02/autossell/mta-promo-image/mta-crop-facebookJumbo.jpg">
<meta name="twitter:image:alt" content="M.T.A. map designed in 1979">
<meta name="twitter:site" content="@nytimes">
<meta name="twitter:creator" content="@jane">
</head>
```

## API

### `rehype().use(meta[, options])`

Add metadata to the head of a document.
Adds a `<head>` if one doesn’t already exist.
Overwrites metadata if found: for example, when a `<title>` already exists,
updates it.

##### `options`

Configuration with least priority.
Mixed into [config][].

### `Config`

There are three ways to configure the metadata of a document.

1.  Pass an object as `options` when [using `meta`][use]
2.  Define it in YAML front matter (by integrating with
    [`vfile-matter`][matter])
3.  Define an object at `file.data.meta`

Configuration is created by extending the defaults, with these objects, in the
above order (so `file.data.meta` takes precedence over `options`).
Only `options` is enough if every file should have the same metadata.
If your workflow enables front matter, `vfile-matter` is a good way to keep data
in files.
Alternatively, do it yourself by adding data at `file.data.meta`.

###### `config.og`

Whether to add Open Graph metadata (`boolean`, default: `false`).

Affects: [`meta[property=og:site_name]`][m-og-site-name],
[`meta[property=og:url]`][m-og-url],
[`meta[property=og:title]`][m-og-title],
[`meta[property=og:description]`][m-og-description],
[`meta[property=og:image]`][m-og-image],
[`meta[property=article:published_time]`][m-article-published-time],
[`meta[property=article:modified_time]`][m-article-modified-time],
[`meta[property=article:author]`][m-article-author],
[`meta[property=article:section]`][m-article-section],
[`meta[property=article:tag]`][m-article-tag],
[`meta[name=twitter:card]`][m-twitter-card].

###### `config.twitter`

Whether to add Twitter metadata (`boolean`, default: `false`).

Affects: [`meta[name=twitter:card]`][m-twitter-card],
[`meta[name=twitter:image]`][m-twitter-image],
[`meta[name=twitter:site]`][m-twitter-site],
[`meta[name=twitter:creator]`][m-twitter-creator].

###### `config.copyright`

Whether to add copyright metadata (`boolean`, default: `false`).

Affects: [`meta[name=copyright]`][m-copyright].

###### `config.type`

What the document refers to (`'website' | 'article'`, default: `website`).

Affects: [`meta[property=og:type]`][m-og-type],
[`meta[property=article:published_time]`][m-article-published-time],
[`meta[property=article:modified_time]`][m-article-modified-time],
[`meta[property=article:author]`][m-article-author],
[`meta[property=article:section]`][m-article-section],
[`meta[property=article:tag]`][m-article-tag].

###### `config.origin`

Origin the file will be hosted on (`string`, optional, example:
`https://www.nytimes.com`).

Affects: [`link[rel=canonical]`][m-canonical],
[`meta[property=og:url]`][m-og-url].

###### `config.pathname`

Absolute pathname of where the file will be hosted (`string`, default: `/`,
example: `/interactive/2019/12/02/nyregion/nyc-subway-map.html`).

Affects: [`link[rel=canonical]`][m-canonical],
[`meta[property=og:url]`][m-og-url].

###### `config.name`

Name of the whole site (`string`, optional, example: `'The New York Times'`).

Affects: [`title`][m-title], [`meta[property=og:site_name]`][m-og-site-name].

###### `config.siteTags`

Tags associated with the whole site (`Array.<string>`, optional, example:
`['US Politics', 'Impeachment', 'NATO', 'London', 'Food', 'Poverty', 'Climate
Change', 'Global Warming']`).

Affects: [`meta[name=keywords]`][m-keywords].

###### `config.siteAuthor`

Name of the author of the whole site (`string`, optional, example:
`'The New York Times'`).

Affects: [`meta[name=author]`][m-author], [`meta[name=copyright]`][m-copyright].

###### `config.siteTwitter`

Twitter username of the whole site (`string`, optional, example: `'@nytimes'`).

Affects: [`meta[name=twitter:site]`][m-twitter-site].

###### `config.color`

Hexadecimal theme color of document or site (`string`, optional, example:
`'#bada55'`).

Affects: [`meta[name=theme-color]`][m-theme-color].

###### `config.author`

Name of the author of the document (`string`, optional, example:
`'Jane Doe'`).

Affects: [`meta[name=author]`][m-author], [`meta[name=copyright]`][m-copyright].

###### `config.authorTwitter`

Twitter username of the author of the document (`string`, optional, example:
`'@janedoe'`).

Affects: [`meta[name=twitter:creator]`][m-twitter-creator].

###### `config.authorFacebook`

Facebook username of the author of the document (`string`, optional, example:
`'example'`).

Affects: [`meta[property=article:author]`][m-article-author].

###### `config.title`

Title of the document (`string`, optional, example: `'The New York City Subway
Map as You’ve Never Seen It Before'`).

Affects: [`title`][m-title], [`meta[property=og:title]`][m-og-title].

###### `config.separator`

Value to use to join the `title` and `name` together (`string`, default:
`' - '`).

Affects: [`title`][m-title].

###### `config.description`

Value used to join the `title` and `name` together if both exist (`string`,
optional, example: `'The city has changed drastically over the past 40 years,
yet the M.T.A. map designed in 1979 has largely endured.'`).

Affects: [`meta[name=description]`][m-description],
[`meta[property=og:description]`][m-og-description].

###### `config.section`

Section associated with the document (`string`, optional, example:
`'New York'`).

Affects: [`meta[property=article:section]`][m-article-section].

###### `config.tags`

Tags associated with the document (`Array.<string>`, optional, example:
`['Subway', 'Map', 'Public Transit', 'Design', 'MTA', 'Massimo Vignelli',
'NYC']`).

Affects: [`meta[name=keywords]`][m-keywords],
[`meta[property=article:tag]`][m-article-tag].

###### `config.image`

One or more images associated with the document (`string`, `Image`, or
`Array.<string | Image>`, optional).
If strings are passed, they are seen as `Image` objects with a `url` field set
to that value.

`Image`:

*   `url` (`string`, required, example: `'https://static01.nyt.com/images/…/mta-crop-jumbo.jpg'`)
*   `alt` (`string`, optional, example: `'M.T.A. map designed in 1979'`)
*   `width` (`string`, optional, example: `'1050'`)
*   `height` (`string`, optional, example: `'550'`)

Affects: [`meta[property=og:image]`][m-og-image],
[`meta[name=twitter:card]`][m-twitter-card],
[`meta[name=twitter:image]`][m-twitter-image].

###### `config.published`

Date the document (or site) was first published (`Date` or `string`, optional,
example: `'2019-12-02T10:00:00.000Z'`).

*Note*: parsing a string is [inconsistent][timestamp], prefer dates.

Affects: [`meta[name=copyright]`][m-copyright],
[`meta[property=article:published_time]`][m-article-published-time].

###### `config.modified`

Date the document was last modified (`Date` or `string`, optional, example:
`'2019-12-03T19:13:00.000Z'`).

*Note*: parsing a string is [inconsistent][timestamp], prefer dates.

Affects: [`meta[property=article:modified_time]`][m-article-modified-time].

## Metadata

The following metadata can be added by `rehype-meta`.

###### `title`

Affected by: [`title`][c-title], [`name`][c-name], [`separator`][c-separator].

If `title` is `'About'`:

```html
<title>About</title>
```

If `name` is `'Example'`:

```html
<title>Example</title>
```

If `title` is `'About'` and `name` is `'Example'`:

```html
<title>About - Example</title>
```

If `title` is `'About'`, `name` is `'Example'`, and separator to `' | '`:

```html
<title>About | Example</title>
```

###### `link[rel=canonical]`

Affected by: [`origin`][c-origin], [`pathname`][c-pathname].

If `origin` is `'https://example.com'` and `path` is `'/path/'`:

```html
<link rel="canonical" href="https://example.com/path/">
```

If `origin` is `'https://example.com'` and `path` is not set:

```html
<link rel="canonical" href="https://example.com/">
```

###### `meta[name=description]`

Affected by: [`description`][c-description].

If `description` is `'Lorem ipsum'`:

```html
<meta name="description" content="Lorem ipsum">
```

###### `meta[name=keywords]`

Affected by: [`tags`][c-tags], [`siteTags`][c-sitetags].

If `tags` is `['a', 'b']`:

```html
<meta name="keywords" content="a, b">
```

If `siteTags` is `['b', 'c']`:

```html
<meta name="keywords" content="b, c">
```

If `tags` is `['a', 'b']` and `siteTags` is `['b', 'c']`:

```html
<meta name="keywords" content="a, b, c">
```

###### `meta[name=author]`

Affected by: [`author`][c-author], [`siteAuthor`][c-siteauthor].

If `author` is `'Jane'`:

```html
<meta name="author" content="Jane">
```

If `siteAuthor` is `'John'`:

```html
<meta name="author" content="John">
```

If `author` is `'Jane'` and `siteAuthor` is `'John'`:

```html
<meta name="author" content="Jane">
```

###### `meta[name=copyright]`

Affected by: [`copyright`][c-copyright], [`author`][c-author],
[`siteAuthor`][c-siteauthor], [`published`][c-published].

The below examples depend on the current date, so for example purposes, say it
was the year 2030.

If `copyright` is not `true`, `meta[name=copyright]` is not added.

If `copyright` is `true` and `author` is `'Jane'`:

```html
<meta name="copyright" content="© 2030 Jane">
```

If `copyright` is `true` and `siteAuthor` is `'John'`:

```html
<meta name="copyright" content="© 2030 John">
```

If `copyright` is `true`, `author` is `'Jane'`, and `siteAuthor` is `'John'`:

```html
<meta name="copyright" content="© 2030 Jane">
```

If `copyright` is `true`, `author` is `'Jane'`, and `published` is `'2015'`:

```html
<meta name="copyright" content="© 2015 Jane">
```

###### `meta[name=theme-color]`

Affected by: [`color`][c-color].

If `color` is `'#bada55'`:

```html
<meta name="theme-color" content="#bada55">
```

###### `meta[property=og:type]`

Affected by: [`og`][c-og], [`type`][c-type].

If `og` is not `true`, `meta[property=og:type]` is not added.

If `og` is `true` and `type` is `'website'`:

```html
<meta property="og:type" content="website">
```

If `og` is `true` and `type` is `'article'`:

```html
<meta property="og:type" content="article">
```

###### `meta[property=og:site_name]`

Affected by: [`og`][c-og], [`name`][c-name].

If `og` is not `true`, `meta[property=og:site_name]` is not added.

If `og` is `true` and `name` is `'Example'`:

```html
<meta property="og:site_name" content="Example">
```

###### `meta[property=og:url]`

Affected by: [`og`][c-og], [`origin`][c-origin], [`pathname`][c-pathname].

If `og` is not `true`, `meta[property=og:url]` is not added.

If `og` is `true`, `origin` is `'https://example.com'`, and `path` is
`'/path/'`:

```html
<meta property="og:url" content="https://example.com/path/">
```

If `origin` is `'https://example.com'` and `path` is not set:

```html
<meta property="og:url" content="https://example.com/">
```

###### `meta[property=og:title]`

Affected by: [`og`][c-og], [`title`][c-title].

If `og` is not `true`, `meta[property=og:title]` is not added.

If `og` is `true` and `title` is `'About'`:

```html
<meta property="og:title" content="title">
```

###### `meta[property=og:description]`

Affected by: [`og`][c-og], [`description`][c-description].

If `og` is not `true`, `meta[property=og:description]` is not added.

If `og` is `true` and `description` is `'Lorem ipsum'`:

```html
<meta property="og:description" content="Lorem ipsum">
```

###### `meta[property=og:image]`

Affected by: [`og`][c-og], [`image`][c-image].

If `og` is not `true`, `meta[property=og:image]`, `meta[property=og:image:alt]`,
`meta[property=og:image:width]`, and `meta[property=og:image:height]` are not
added.

*Note*: up to 6 images are added.

If `og` is `true` and `image` is `'https://example.com/image.png'`:

```html
<meta property="og:image" content="https://example.com/image.png">
```

If `og` is `true` and `image` is `['https://example.com/a.png',
'https://example.com/b.png']`:

```html
<meta property="og:image" content="https://example.com/a.png">
<meta property="og:image" content="https://example.com/b.png">
```

If `og` is `true` and `image` is `{url: 'https://example.com/a.png', alt: 'A',
width: '670', height: '1012'}`:

```html
<meta property="og:image" content="https://example.com/a.png">
<meta property="og:image:alt" content="A">
<meta property="og:image:width" content="670">
<meta property="og:image:height" content="1012">
```

###### `meta[property=article:published_time]`

Affected by: [`og`][c-og], [`type`][c-type], [`published`][c-published].

If `og` is not `true` or `type` is not `'article'`,
`meta[property=article:published_time]` is not added.

If `og` is `true`, `type` is `'article'`, and `published` is
`'2014-06-30T15:01:35-05:00'`:

```html
<meta property="article:published_time" content="2014-06-30T20:01:35.000Z">
```

###### `meta[property=article:modified_time]`

Affected by: [`og`][c-og], [`type`][c-type], [`modified`][c-modified].

If `og` is not `true` or `type` is not `'article'`,
`meta[property=article:modified_time]` is not added.

If `og` is `true`, `type` is `'article'`, and `modified` is
`'2017-04-26T22:37:10-05:00'`:

```html
<meta property="article:modified_time" content="2017-04-27T03:37:10.000Z">
```

###### `meta[property=article:author]`

Affected by: [`og`][c-og], [`type`][c-type],
[`authorFacebook`][c-authorfacebook].

If `og` is not `true` or `type` is not `'article'`,
`meta[property=article:author]` is not added.

If `og` is `true`, `type` is `'article'`, and `authorFacebook` is
`'jane'`:

```html
<meta property="article:author" content="https://www.facebook.com/jane">
```

###### `meta[property=article:section]`

Affected by: [`og`][c-og], [`type`][c-type], [`section`][c-section].

If `og` is not `true` or `type` is not `'article'`,
`meta[property=article:section]` is not added.

If `og` is `true`, `type` is `'article'`, and `section` is `'Politics'`:

```html
<meta property="article:section" content="Politics">
```

###### `meta[property=article:tag]`

Affected by: [`og`][c-og], [`type`][c-type], [`tag`][c-tags].

If `og` is not `true` or `type` is not `'article'`, `meta[property=article:tag]`
are not added.

*Note*: up to 6 tags are added.

If `og` is `true`, `type` is `'article'`, and `tags` is `['US Politics',
'Impeachment', 'NATO', 'London', 'Food', 'Poverty', 'Climate Change']`:

```html
<meta property="article:tag" content="US Politics">
<meta property="article:tag" content="Impeachment">
<meta property="article:tag" content="NATO">
<meta property="article:tag" content="London">
<meta property="article:tag" content="Food">
<meta property="article:tag" content="Poverty">
```

###### `meta[name=twitter:card]`

Affected by: [`og`][c-og], [`twitter`][c-twitter], [`image`][c-image].

If `twitter` is not `true`, `meta[name=twitter:card]` is not added.
If `twitter` is `true`, `og` is true, and there is no valid image, no
`meta[name=twitter:card]` is added either, because Twitter assumes a summary in
this case.

If `twitter` is `true` and there is a valid image:

```html
<meta name="twitter:card" content="summary_large_image">
```

If `twitter` is `true` and there is no valid image:

```html
<meta name="twitter:card" content="summary">
```

###### `meta[name=twitter:image]`

Affected by: [`twitter`][c-twitter], [`image`][c-image].

If `twitter` is not `true`, `meta[name=twitter:image]` and
`meta[name=twitter:image:alt]` are not added.

*Note*: only one image is added.

If `twitter` is `true` and `image` is `'https://example.com/image.png'`:

```html
<meta name="twitter:image" content="https://example.com/image.png">
```

If `twitter` is `true` and `image` is `['https://example.com/a.png',
'https://example.com/b.png']`:

```html
<meta name="twitter:image" content="https://example.com/a.png">
```

If `twitter` is `true` and `image` is `{url: 'https://example.com/a.png', alt:
'A', width: '670', height: '1012'}`:

```html
<meta name="twitter:image" content="https://example.com/a.png">
<meta name="twitter:image:alt" content="A">
```

###### `meta[name=twitter:site]`

Affected by: [`twitter`][c-twitter], [`siteTwitter`][c-sitetwitter].

If `twitter` is not `true`, `meta[name=twitter:site]` is not added.

If `twitter` is `true` and `siteTwitter` is `'@example'`:

```html
<meta name="twitter:site" content="@example">
```

###### `meta[name=twitter:creator]`

Affected by: [`twitter`][c-twitter], [`authorTwitter`][c-authortwitter].

If `twitter` is not `true`, `meta[name=twitter:creator]` is not added.

If `twitter` is `true` and `authorTwitter` is `'@example'`:

```html
<meta name="twitter:creator" content="@example">
```

## Security

Use of `rehype-meta` is relatively safe, however, it is possible for an attacker
to define metadata from within a because of the [`matter`][matter] integration .

## Related

*   [`rehype-document`](https://github.com/rehypejs/rehype-document)
    — Wrap a document around the tree
*   [`rehype-format`](https://github.com/rehypejs/rehype-format)
    — Format HTML
*   [`rehype-minify`](https://github.com/rehypejs/rehype-minify)
    — Minify HTML

## Contribute

See [`contributing.md`][contributing] in [`rehypejs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/rehypejs/rehype-meta/workflows/main/badge.svg

[build]: https://github.com/rehypejs/rehype-meta/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-meta.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-meta

[downloads-badge]: https://img.shields.io/npm/dm/rehype-meta.svg

[downloads]: https://www.npmjs.com/package/rehype-meta

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-meta.svg

[size]: https://bundlephobia.com/result?p=rehype-meta

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/HEAD/contributing.md

[support]: https://github.com/rehypejs/.github/blob/HEAD/support.md

[coc]: https://github.com/rehypejs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[rehype]: https://github.com/rehypejs/rehype

[matter]: https://github.com/vfile/vfile-matter

[config]: #config

[use]: #rehypeusemeta-options

[timestamp]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date#Timestamp_string

[c-og]: #configog

[c-type]: #configtype

[c-twitter]: #configtwitter

[c-copyright]: #configcopyright

[c-origin]: #configorigin

[c-pathname]: #configpathname

[c-name]: #configname

[c-sitetags]: #configsitetags

[c-siteauthor]: #configsiteauthor

[c-sitetwitter]: #configsitetwitter

[c-color]: #configcolor

[c-author]: #configauthor

[c-authortwitter]: #configauthortwitter

[c-authorfacebook]: #configauthorfacebook

[c-title]: #configtitle

[c-separator]: #configseparator

[c-description]: #configdescription

[c-section]: #configsection

[c-tags]: #configtags

[c-image]: #configimage

[c-published]: #configpublished

[c-modified]: #configmodified

[m-title]: #title

[m-canonical]: #linkrelcanonical

[m-description]: #metanamedescription

[m-keywords]: #metanamekeywords

[m-author]: #metanameauthor

[m-copyright]: #metanamecopyright

[m-theme-color]: #metanametheme-color

[m-og-type]: #metapropertyogtype

[m-og-site-name]: #metapropertyogsite_name

[m-og-url]: #metapropertyogurl

[m-og-title]: #metapropertyogtitle

[m-og-description]: #metapropertyogdescription

[m-og-image]: #metapropertyogimage

[m-article-published-time]: #metapropertyarticlepublished_time

[m-article-modified-time]: #metapropertyarticlemodified_time

[m-article-author]: #metapropertyarticleauthor

[m-article-section]: #metapropertyarticlesection

[m-article-tag]: #metapropertyarticletag

[m-twitter-card]: #metanametwittercard

[m-twitter-image]: #metanametwitterimage

[m-twitter-site]: #metanametwittersite

[m-twitter-creator]: #metanametwittercreator
