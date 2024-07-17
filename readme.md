# rehype-meta

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to add metadata to the `<head>`.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(rehypeMeta[, options])`](#unifieduserehypemeta-options)
  * [`Image`](#image)
  * [`Options`](#options)
* [Metadata](#metadata)
* [Examples](#examples)
  * [Example: frontmatter in markdown](#example-frontmatter-in-markdown)
  * [Example: inferring metadata](#example-inferring-metadata)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin to manage the metadata (Open
Graph, Twitter Cards, SEO, etc.) that can be found in `<head>`.
It focusses on reasonable and useful metadata that is supported by several and
popular vendors instead of every possible field supported somewhere.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**rehype** adds support for HTML to unified.
**hast** is the HTML AST that rehype uses.
This is a rehype plugin that adds metadata to the head in the tree.

## When should I use this?

This plugin is particularly useful as a metadata manager when you’re working
with articles that are supposed to be shared on the web, whether it’s on Twitter
or Slack.
You can define key/value pairs, either with frontmatter, with other plugins, or
as options, and this plugin will generate the HTML used by different services.

This plugin works on complete documents (not fragments).
A different plugin, [`rehype-document`][rehype-document], wraps fragments in
documents.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install rehype-meta
```

In Deno with [`esm.sh`][esmsh]:

```js
import rehypeMeta from 'https://esm.sh/rehype-meta@4'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import rehypeMeta from 'https://esm.sh/rehype-meta@4?bundle'
</script>
```

## Use

Say our module `example.js` looks as follows:

```js
import {rehype} from 'rehype'
import rehypeMeta from 'rehype-meta'

const file = await rehype()
  .data('settings', {fragment: true})
  .use(rehypeMeta, {
    author: 'Jane Doe',
    authorFacebook: 'janedoe',
    authorTwitter: '@jane',
    copyright: true,
    description:
      'The city has changed drastically over the past 40 years, yet the M.T.A. map designed in 1979 has largely endured.',
    image: {
      alt: 'M.T.A. map designed in 1979',
      height: '550',
      url: 'https://static01.nyt.com/images/2019/12/02/autossell/mta-promo-image/mta-crop-facebookJumbo.jpg',
      width: '1050'
    },
    modified: '2019-12-03T19:13:00.000Z',
    name: 'The New York Times',
    og: true,
    origin: 'https://www.nytimes.com',
    pathname: '/interactive/2019/12/02/nyregion/nyc-subway-map.html',
    published: '2019-12-02T10:00:00.000Z',
    readingTime: 11.1,
    section: 'New York',
    separator: ' | ',
    siteAuthor: 'The New York Times',
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
    siteTwitter: '@nytimes',
    tags: [
      'Subway',
      'Map',
      'Public Transit',
      'Design',
      'MTA',
      'Massimo Vignelli',
      'NYC'
    ],
    title:
      'The New York City Subway Map as You’ve Never Seen It Before',
    twitter: true,
    type: 'article'
  })
  .process('')

console.log(String(file))
```

…now running `node example.js` yields:

```html
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
<meta name="twitter:label1" content="Posted in">
<meta name="twitter:data1" content="New York">
<meta name="twitter:label2" content="Reading time">
<meta name="twitter:data2" content="12 minutes">
</head>
```

## API

This package exports no identifiers.
The default export is [`rehypeMeta`][api-rehype-meta].

### `unified().use(rehypeMeta[, options])`

Add metadata to the `<head>`.

###### Parameters

* `options` ([`Options`][api-options], optional)
  — configuration

###### Returns

Transform ([`Transformer`][unified-transformer]).

##### Notes

###### Algorithm

* adds a `<head>` if one doesn’t already exist
* overwrites existing metadata in `<head>` (for example, when a `<title>`
  already exists, it’s updated)

###### Config

There are three ways to configure the metadata of a document.

1. pass an object as `options` when [using `rehypeMeta`][api-rehype-meta]
2. define it in YAML front matter (by integrating with
   [`vfile-matter`][vfile-matter])
3. define an object at `file.data.meta`

Configuration is created by extending the defaults, with these objects, in the
above order (so `file.data.meta` is preferred over `options`).
Only `options` is enough if every file has the same metadata.
If your workflow enables front matter, that’s a good way to keep data in files.
Alternatively, do it yourself by adding data at `file.data.meta`, which can also
be done by plugins:

* [`rehype-infer-description-meta`](https://github.com/rehypejs/rehype-infer-description-meta)
  — infer [`description`][o-description] from the document
* [`rehype-infer-reading-time-meta`](https://github.com/rehypejs/rehype-infer-reading-time-meta)
  — infer [`readingTime`][o-reading-time] from the document
* [`rehype-infer-title-meta`](https://github.com/rehypejs/rehype-infer-title-meta)
  — infer [`title`][o-title] from the document
* [`unified-infer-git-meta`](https://github.com/unifiedjs/unified-infer-git-meta)
  — infer [`author`][o-author], [`modified`][o-modified], and
  [`published`][o-published] from Git

### `Image`

Image metadata (TypeScript type).

###### Fields

* `alt` (`string`, optional, example: `'M.T.A. map designed in 1979'`)
  — alt text of image
* `height` (`number | string`, optional, example: `'550'`)
  — height of image
* `url` (`string`, required, example:
  `'https://static01.nyt.com/images/…/mta-crop-jumbo.jpg'`)
  — URL of image
* `width` (`number | string`, optional, example: `'1050'`)
  — width of image

### `Options`

Configuration (TypeScript type).

##### Fields

###### `author`

Name of the author of the document (`string`, optional, example:
`'Jane Doe'`).

Affects: [`meta[name=author]`][m-author], [`meta[name=copyright]`][m-copyright].

###### `authorFacebook`

Facebook username of the author of the document (`string`, optional, example:
`'example'`).

Affects: [`meta[property=article:author]`][m-article-author].

###### `authorTwitter`

Twitter username of the author of the document (`string`, optional, example:
`'@janedoe'`).

Affects: [`meta[name=twitter:creator]`][m-twitter-creator].

###### `color`

Hexadecimal theme color of document or site (`string`, optional, example:
`'#bada55'`).

Affects: [`meta[name=theme-color]`][m-theme-color].

###### `copyright`

Whether to add copyright metadata (`boolean`, default: `false`).

Affects: [`meta[name=copyright]`][m-copyright].

###### `description`

Description of the document (`string`, optional, example:
`'The city has changed drastically over the past 40 years,
yet the M.T.A. map designed in 1979 has largely endured.'`).

Affects: [`meta[name=description]`][m-description],
[`meta[property=og:description]`][m-og-description].

###### `image`

One or more images associated with the document
(`Array<Image | string> | Image | string`, optional); if strings are
passed, they are seen as `Image` objects with a `url` field set to that
value.

Affects: [`meta[property=og:image]`][m-og-image],
[`meta[name=twitter:card]`][m-twitter-card],
[`meta[name=twitter:image]`][m-twitter-image].

###### `modified`

Date the document was last modified (`Date` or `string`, optional, example:
`'2019-12-03T19:13:00.000Z'`).

> 👉 **Note**: parsing a string is [inconsistent][timestamp], prefer dates.

Affects: [`meta[property=article:modified_time]`][m-article-modified-time].

###### `name`

Name of the whole site (`string`, optional, example: `'The New York Times'`).

Affects: [`title`][m-title], [`meta[property=og:site_name]`][m-og-site-name],
[`meta[property=og:title]`][m-og-title].

###### `og`

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

###### `ogNameInTitle`

Whether to add the site name `name` to the `og:title` (`boolean`, default:
`false`).

Affects: [`meta[property=og:title]`][m-og-title].

###### `origin`

Origin the file will be hosted on (`string`, optional, example:
`https://www.nytimes.com`).

Affects: [`link[rel=canonical]`][m-canonical],
[`meta[property=og:url]`][m-og-url].

###### `pathname`

Absolute pathname of where the file will be hosted (`string`, default: `/`,
example: `/interactive/2019/12/02/nyregion/nyc-subway-map.html`).

Affects: [`link[rel=canonical]`][m-canonical],
[`meta[property=og:url]`][m-og-url].

###### `published`

Date the document (or site) was first published (`Date` or `string`, optional,
example: `'2019-12-02T10:00:00.000Z'`).

> 👉 **Note**: parsing a string is [inconsistent][timestamp], prefer dates.

Affects: [`meta[name=copyright]`][m-copyright],
[`meta[property=article:published_time]`][m-article-published-time].

###### `readingTime`

Estimated reading time in minutes for the document (`[number, number]` or
`number`, optional, example: `1.219403`).
If two numbers are given, they represent a range of two estimates.

Affects: [`meta[name=twitter:label1]`][m-twitter-label1],
[`meta[name=twitter:data1]`][m-twitter-data1],
[`meta[name=twitter:label2]`][m-twitter-label2],
[`meta[name=twitter:data2]`][m-twitter-data2].

###### `section`

Section associated with the document (`string`, optional, example:
`'New York'`).

Affects: [`meta[property=article:section]`][m-article-section], [`meta[name=twitter:label1]`][m-twitter-label1],
[`meta[name=twitter:data1]`][m-twitter-data1].

###### `separator`

Value to use to join the `title` and `name` together (`string`, default:
`' - '`).

Affects: [`title`][m-title], [`meta[property=og:title]`][m-og-title].

###### `siteAuthor`

Name of the author of the whole site (`string`, optional, example:
`'The New York Times'`).

Affects: [`meta[name=author]`][m-author], [`meta[name=copyright]`][m-copyright].

###### `siteTags`

Tags associated with the whole site (`Array<string>`, optional, example:
`['US Politics', 'Impeachment', 'NATO', 'London', 'Food', 'Poverty', 'Climate
Change', 'Global Warming']`).

Affects: [`meta[name=keywords]`][m-keywords].

###### `siteTwitter`

Twitter username of the whole site (`string`, optional, example: `'@nytimes'`).

Affects: [`meta[name=twitter:site]`][m-twitter-site].

###### `tags`

Tags associated with the document (`Array<string>`, optional, example:
`['Subway', 'Map', 'Public Transit', 'Design', 'MTA', 'Massimo Vignelli',
'NYC']`).

Affects: [`meta[name=keywords]`][m-keywords],
[`meta[property=article:tag]`][m-article-tag].

###### `title`

Title of the document (`string`, optional, example: `'The New York City Subway
Map as You’ve Never Seen It Before'`).

Affects: [`title`][m-title], [`meta[property=og:title]`][m-og-title].

###### `twitter`

Whether to add Twitter metadata (`boolean`, default: `false`).

Affects: [`meta[name=twitter:card]`][m-twitter-card],
[`meta[name=twitter:image]`][m-twitter-image],
[`meta[name=twitter:site]`][m-twitter-site],
[`meta[name=twitter:creator]`][m-twitter-creator],
[`meta[name=twitter:label1]`][m-twitter-label1],
[`meta[name=twitter:data1]`][m-twitter-data1],
[`meta[name=twitter:label2]`][m-twitter-label2],
[`meta[name=twitter:data2]`][m-twitter-data2].

###### `type`

What the document refers to (`'article' | 'website'`, default: `'website'`).

Affects: [`meta[property=og:type]`][m-og-type],
[`meta[property=article:published_time]`][m-article-published-time],
[`meta[property=article:modified_time]`][m-article-modified-time],
[`meta[property=article:author]`][m-article-author],
[`meta[property=article:section]`][m-article-section],
[`meta[property=article:tag]`][m-article-tag].

## Metadata

The following metadata can be added by `rehype-meta`.

###### `link[rel=canonical]`

Affected by: [`origin`][o-origin], [`pathname`][o-path-name].

If `origin` is `'https://example.com'` and `path` is `'/path/'`:

```html
<link rel="canonical" href="https://example.com/path/">
```

If `origin` is `'https://example.com'` and `path` is not set:

```html
<link rel="canonical" href="https://example.com/">
```

###### `meta[name=author]`

Affected by: [`author`][o-author], [`siteAuthor`][o-site-author].

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

Affected by: [`copyright`][o-copyright], [`author`][o-author],
[`siteAuthor`][o-site-author], [`published`][o-published].

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

###### `meta[name=description]`

Affected by: [`description`][o-description].

If `description` is `'Lorem ipsum'`:

```html
<meta name="description" content="Lorem ipsum">
```

###### `meta[name=keywords]`

Affected by: [`tags`][o-tags], [`siteTags`][o-site-tags].

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

###### `meta[name=theme-color]`

Affected by: [`color`][o-color].

If `color` is `'#bada55'`:

```html
<meta name="theme-color" content="#bada55">
```

###### `meta[name=twitter:card]`

Affected by: [`og`][o-og], [`twitter`][o-twitter], [`image`][o-image].

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

###### `meta[name=twitter:creator]`

Affected by: [`twitter`][o-twitter], [`authorTwitter`][o-author-twitter].

If `twitter` is not `true`, `meta[name=twitter:creator]` is not added.

If `twitter` is `true` and `authorTwitter` is `'@example'`:

```html
<meta name="twitter:creator" content="@example">
```

###### `meta[name=twitter:data1]`

###### `meta[name=twitter:label1]`

Affected by: [`twitter`][o-twitter], [`section`][o-section],
[`readingTime`][o-reading-time].

> 👉 **Note**: this data is used by Slack, not by Twitter.

If `twitter` is not `true`, `meta[name=twitter:label1]` and
`meta[name=twitter:data1]` are not added.

If `twitter` is `true` and `section` is `'Food'`:

```html
<meta name="twitter:label1" content="Posted in">
<meta name="twitter:data1" content="Food">
```

If `twitter` is `true`, `section` is not defined, and `readingTime` is `3.083`:

```html
<meta name="twitter:label1" content="Reading time">
<meta name="twitter:data1" content="4 minutes">
```

###### `meta[name=twitter:data2]`

###### `meta[name=twitter:label2]`

Affected by: [`twitter`][o-twitter], [`section`][o-section],
[`readingTime`][o-reading-time].

> 👉 **Note**: this data is used by Slack, not by Twitter.

If `twitter` is not `true`, `section` is not defined, or `readingTime` is not
defined, `meta[name=twitter:label2]` and `meta[name=twitter:data2]` are not
added.

If `twitter` is `true`, `section` is defined, and `readingTime` is `0.8`:

```html
<meta name="twitter:label2" content="Reading time">
<meta name="twitter:data2" content="1 minute">
```

If `twitter` is `true`, `section` is defined, and `readingTime` is `[8, 12]`:

```html
<meta name="twitter:label2" content="Reading time">
<meta name="twitter:data2" content="8-12 minutes">
```

###### `meta[name=twitter:image]`

Affected by: [`twitter`][o-twitter], [`image`][o-image].

If `twitter` is not `true`, `meta[name=twitter:image]` and
`meta[name=twitter:image:alt]` are not added.

> 👉 **Note**: only one image is added.

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

Affected by: [`twitter`][o-twitter], [`siteTwitter`][o-site-twitter].

If `twitter` is not `true`, `meta[name=twitter:site]` is not added.

If `twitter` is `true` and `siteTwitter` is `'@example'`:

```html
<meta name="twitter:site" content="@example">
```

###### `meta[property=article:author]`

Affected by: [`og`][o-og], [`type`][o-type],
[`authorFacebook`][o-author-facebook].

If `og` is not `true` or `type` is not `'article'`,
`meta[property=article:author]` is not added.

If `og` is `true`, `type` is `'article'`, and `authorFacebook` is
`'jane'`:

```html
<meta property="article:author" content="https://www.facebook.com/jane">
```

###### `meta[property=article:modified_time]`

Affected by: [`og`][o-og], [`type`][o-type], [`modified`][o-modified].

If `og` is not `true` or `type` is not `'article'`,
`meta[property=article:modified_time]` is not added.

If `og` is `true`, `type` is `'article'`, and `modified` is
`'2017-04-26T22:37:10-05:00'`:

```html
<meta property="article:modified_time" content="2017-04-27T03:37:10.000Z">
```

###### `meta[property=article:published_time]`

Affected by: [`og`][o-og], [`type`][o-type], [`published`][o-published].

If `og` is not `true` or `type` is not `'article'`,
`meta[property=article:published_time]` is not added.

If `og` is `true`, `type` is `'article'`, and `published` is
`'2014-06-30T15:01:35-05:00'`:

```html
<meta property="article:published_time" content="2014-06-30T20:01:35.000Z">
```

###### `meta[property=article:section]`

Affected by: [`og`][o-og], [`type`][o-type], [`section`][o-section].

If `og` is not `true` or `type` is not `'article'`,
`meta[property=article:section]` is not added.

If `og` is `true`, `type` is `'article'`, and `section` is `'Politics'`:

```html
<meta property="article:section" content="Politics">
```

###### `meta[property=article:tag]`

Affected by: [`og`][o-og], [`type`][o-type], [`tag`][o-tags].

If `og` is not `true` or `type` is not `'article'`, `meta[property=article:tag]`
are not added.

> 👉 **Note**: up to 6 tags are added.

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

###### `meta[property=og:description]`

Affected by: [`og`][o-og], [`description`][o-description].

If `og` is not `true`, `meta[property=og:description]` is not added.

If `og` is `true` and `description` is `'Lorem ipsum'`:

```html
<meta property="og:description" content="Lorem ipsum">
```

###### `meta[property=og:image]`

Affected by: [`og`][o-og], [`image`][o-image].

If `og` is not `true`, `meta[property=og:image]`, `meta[property=og:image:alt]`,
`meta[property=og:image:width]`, and `meta[property=og:image:height]` are not
added.

> 👉 **Note**: up to 6 images are added.

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

###### `meta[property=og:site_name]`

Affected by: [`og`][o-og], [`name`][o-name].

If `og` is not `true`, `meta[property=og:site_name]` is not added.

If `og` is `true` and `name` is `'Example'`:

```html
<meta property="og:site_name" content="Example">
```

###### `meta[property=og:title]`

Affected by: [`og`][o-og], [`ogNameInTitle`][o-og-name-in-title],
[`title`][o-title], [`name`][o-name], [`separator`][o-separator].

If `og` is not `true`, `meta[property=og:title]` is not added.

If `og` is `true` and `title` is `'About'`:

```html
<meta property="og:title" content="About">
```

If `og` is `true`, `ogNameInTitle` is `true`, `title` is `'About'`, and `name`
is `'Site'`:

```html
<meta property="og:title" content="About - Site">
```

If `og` is `true`, `ogNameInTitle` is `true`, `title` is `'About'`, `name` is
`'Site'`, and `separator` is `' | '`:

```html
<meta property="og:title" content="About | Site">
```

###### `meta[property=og:type]`

Affected by: [`og`][o-og], [`type`][o-type].

If `og` is not `true`, `meta[property=og:type]` is not added.

If `og` is `true` and `type` is `'website'`:

```html
<meta property="og:type" content="website">
```

If `og` is `true` and `type` is `'article'`:

```html
<meta property="og:type" content="article">
```

###### `meta[property=og:url]`

Affected by: [`og`][o-og], [`origin`][o-origin], [`pathname`][o-path-name].

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

###### `title`

Affected by: [`title`][o-title], [`name`][o-name], [`separator`][o-separator].

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

## Examples

### Example: frontmatter in markdown

This example shows how it’s possible to combine the different data sources to
pass site wide info as options and define more specific data from within
markdown files with frontmatter.

Say we have the following file `example.md`:

```markdown
---
title: Neptune
author: U. Le Verrier
authorTwitter: '@leverrier123'
description: Neptune is blue.
tags:
- neptune
- blue
---

# Neptune

To do: write some stuff about why neptune is cool.
```

…and a module `example.js`:

```js
import remarkFrontmatter from 'remark-frontmatter'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeDocument from 'rehype-document'
import rehypeMeta from 'rehype-meta'
import rehypeStringify from 'rehype-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {matter} from 'vfile-matter'

const file = await read('example.md')

// Define where the generated file will be available.
file.data.meta = {
  origin: 'https://planets.com',
  pathname: '/neptune/'
}

await unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(function () {
    return function (_, file) {
      matter(file)
    }
  })
  .use(remarkRehype)
  // `rehype-document` manages non-metadata things in `<head>`.
  .use(rehypeDocument, {
    css: 'https://planets.com/index.css',
    js: 'https://planets.com/index.js'
  })
  // Site wide metadata:
  .use(rehypeMeta, {
    copyright: true,
    name: 'Planets',
    og: true,
    siteAuthor: 'J. Galle',
    siteTags: ['planet', 'solar', 'galaxy'],
    siteTwitter: '@the_planets',
    twitter: true,
    type: 'article'
  })
  .use(rehypeStringify)
  .process(file)

console.log(String(file))
```

…now running `node example.js` yields:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Neptune - Planets</title>
<meta content="width=device-width, initial-scale=1" name="viewport">
<link href="https://planets.com/index.css" rel="stylesheet">
<link rel="canonical" href="https://planets.com/neptune/">
<meta name="description" content="Neptune is blue.">
<meta name="keywords" content="neptune, blue, planet, solar, galaxy">
<meta name="author" content="U. Le Verrier">
<meta name="copyright" content="© 2023 U. Le Verrier">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Planets">
<meta property="og:url" content="https://planets.com/neptune/">
<meta property="og:title" content="Neptune">
<meta property="og:description" content="Neptune is blue.">
<meta property="article:tag" content="neptune">
<meta property="article:tag" content="blue">
<meta name="twitter:site" content="@the_planets">
<meta name="twitter:creator" content="@leverrier123">
</head>
<body>
<h1>Neptune</h1>
<p>To do: write some stuff about why neptune is cool.</p>
<script src="https://planets.com/index.js"></script>
</body>
</html>
```

### Example: inferring metadata

Some metadata can be automatically gathered, either by extracting it from the
document, or by accessing the file system or Git.
This is done by other plugins (see [config][]) which “infer” that metadata and
store their results on `file.data.meta`, which this plugin then looks at.

Taking this readme as an example and running the following code within this
repo:

```js
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeDocument from 'rehype-document'
import rehypeInferTitleMeta from 'rehype-infer-title-meta'
import rehypeInferDescriptionMeta from 'rehype-infer-description-meta'
import rehypeInferReadingTimeMeta from 'rehype-infer-reading-time-meta'
import rehypeMeta from 'rehype-meta'
import rehypeStringify from 'rehype-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import unifiedInferGitMeta from 'unified-infer-git-meta'

const file = await unified()
  .use(remarkParse)
  .use(unifiedInferGitMeta) // Find published, modified, and authors in Git.
  .use(remarkRehype)
  .use(rehypeDocument)
  .use(rehypeInferTitleMeta) // Find the main title.
  .use(rehypeInferDescriptionMeta, {truncateSize: 64}) // Find the description.
  .use(rehypeInferReadingTimeMeta) // Estimate reading time.
  .use(rehypeMeta, {og: true, twitter: true, copyright: true})
  .use(rehypeStringify)
  .process(await read('readme.md'))

console.log(String(file))
```

Yields:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>rehype-meta</title>
<meta content="width=device-width, initial-scale=1" name="viewport">
<meta name="description" content="rehype plugin to add metadata to the <head…">
<meta name="author" content="Titus Wormer">
<meta name="copyright" content="© 2019 Titus Wormer">
<meta property="og:type" content="website">
<meta property="og:title" content="rehype-meta">
<meta property="og:description" content="rehype plugin to add metadata to the <head…">
<meta name="twitter:label1" content="Reading time">
<meta name="twitter:data1" content="16-25 minutes">
</head>
<body>
<h1>rehype-meta</h1>
…
```

## Types

This package is fully typed with [TypeScript][].
It exports the additional types [`Image`][api-image] and
[`Options`][api-options].

It also registers expected fields on `file.data.meta` and `file.data.matter`
with `vfile`.
If you’re working with the file, make sure to import this plugin somewhere in
your types, as that registers the new fields on the file.

```js
/**
 * @import {} from 'rehype-meta'
 */

import {VFile} from 'vfile'

const file = new VFile()

console.log(file.data.meta.title) //=> TS now knows that this is a `string?`.
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `rehype-meta@^4`, compatible
with Node.js 16.

This plugin works with `rehype-parse` version 3+, `rehype-stringify` version 3+,
`rehype` version 4+, and `unified` version 6+.

## Security

Use of `rehype-meta` is relatively safe, however, it is possible for an attacker
to define metadata from within a because of the [`matter`][vfile-matter]
integration.

## Related

* [`unified-infer-git-meta`](https://github.com/unifiedjs/unified-infer-git-meta)
  — infer file metadata from Git
* [`rehype-infer-description-meta`](https://github.com/rehypejs/rehype-infer-description-meta)
  — infer file metadata from the description of a document
* [`rehype-infer-title-meta`](https://github.com/rehypejs/rehype-infer-title-meta)
  — infer file metadata from the title of a document
* [`rehype-infer-reading-time-meta`](https://github.com/rehypejs/rehype-infer-reading-time-meta)
  — infer file metadata about how long the document takes to read
* [`rehype-document`][rehype-document]
  — wrap a fragment in a document
* [`rehype-format`](https://github.com/rehypejs/rehype-format)
  — format HTML
* [`rehype-minify`](https://github.com/rehypejs/rehype-minify)
  — minify HTML

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

[size-badge]: https://img.shields.io/bundlejs/size/rehype-meta

[size]: https://bundlejs.com/?q=rehype-meta

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/main/contributing.md

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[coc]: https://github.com/rehypejs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[rehype]: https://github.com/rehypejs/rehype

[rehype-document]: https://github.com/rehypejs/rehype-document

[typescript]: https://www.typescriptlang.org

[unified]: https://github.com/unifiedjs/unified

[unified-transformer]: https://github.com/unifiedjs/unified#transformer

[vfile-matter]: https://github.com/vfile/vfile-matter

[timestamp]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date#Timestamp_string

[config]: #config

[api-image]: #image

[api-options]: #options

[api-rehype-meta]: #unifieduserehypemeta-options

[m-article-author]: #metapropertyarticleauthor

[m-article-modified-time]: #metapropertyarticlemodified_time

[m-article-published-time]: #metapropertyarticlepublished_time

[m-article-section]: #metapropertyarticlesection

[m-article-tag]: #metapropertyarticletag

[m-author]: #metanameauthor

[m-canonical]: #linkrelcanonical

[m-copyright]: #metanamecopyright

[m-description]: #metanamedescription

[m-keywords]: #metanamekeywords

[m-og-description]: #metapropertyogdescription

[m-og-image]: #metapropertyogimage

[m-og-site-name]: #metapropertyogsite_name

[m-og-title]: #metapropertyogtitle

[m-og-type]: #metapropertyogtype

[m-og-url]: #metapropertyogurl

[m-title]: #title-1

[m-theme-color]: #metanametheme-color

[m-twitter-card]: #metanametwittercard

[m-twitter-creator]: #metanametwittercreator

[m-twitter-data1]: #metanametwitterdata1

[m-twitter-data2]: #metanametwitterdata2

[m-twitter-image]: #metanametwitterimage

[m-twitter-label1]: #metanametwitterlabel1

[m-twitter-label2]: #metanametwitterlabel2

[m-twitter-site]: #metanametwittersite

[o-author]: #author

[o-author-facebook]: #authorfacebook

[o-author-twitter]: #authortwitter

[o-color]: #color

[o-copyright]: #copyright

[o-description]: #description

[o-image]: #image-1

[o-modified]: #modified

[o-name]: #name

[o-og]: #og

[o-og-name-in-title]: #ognameintitle

[o-origin]: #origin

[o-path-name]: #pathname

[o-published]: #published

[o-reading-time]: #readingtime

[o-section]: #section

[o-separator]: #separator

[o-site-author]: #siteauthor

[o-site-tags]: #sitetags

[o-site-twitter]: #sitetwitter

[o-tags]: #tags

[o-title]: #title

[o-twitter]: #twitter

[o-type]: #type
