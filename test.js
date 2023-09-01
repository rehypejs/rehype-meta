import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import rehypeDocument from 'rehype-document'
import rehypeMeta from 'rehype-meta'

const currentYear = new Date().getFullYear()

test('rehypeMeta', async function (t) {
  await t.test('core', async function (t) {
    await t.test('should expose the public api', async function () {
      assert.deepEqual(Object.keys(await import('rehype-meta')).sort(), [
        'default'
      ])
    })

    await t.test('should work in fragment mode', async function () {
      assert.equal(
        rehype()
          .data('settings', {fragment: true})
          .use(rehypeMeta)
          .processSync('')
          .toString(),
        '<head></head>\n'
      )
    })

    await t.test('should work in document mode', async function () {
      assert.equal(
        rehype().use(rehypeMeta).processSync('').toString(),
        '<html><head></head><body></body></html>'
      )
    })

    await t.test('should add a `title` if `title` is set', async function () {
      assert.equal(
        rehype()
          .data('settings', {fragment: true})
          .use(rehypeMeta, {title: 'About'})
          .processSync('')
          .toString(),
        ['<head>', '<title>About</title>', '</head>', ''].join('\n')
      )
    })

    await t.test(
      'should add a combined `title` and `name` if both are set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {name: 'Example', title: 'About'})
            .processSync('')
            .toString(),
          ['<head>', '<title>About - Example</title>', '</head>', ''].join('\n')
        )
      }
    )

    await t.test(
      'should combine `title` and `name` with a given separator',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              name: 'Example',
              separator: ' | ',
              title: 'About'
            })
            .processSync('')
            .toString(),
          ['<head>', '<title>About | Example</title>', '</head>', ''].join('\n')
        )
      }
    )

    await t.test(
      'should add a `link[rel=canonical]` if `origin` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {origin: 'https://a.com'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<link rel="canonical" href="https://a.com/">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `link[rel=canonical]` if `origin` and `pathname` are set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {origin: 'https://a.com', pathname: '/b'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<link rel="canonical" href="https://a.com/b">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=description]` if `description` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {description: 'Hello, World!'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="description" content="Hello, World!">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=keyword]` if `tags` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {tags: ['a', 'b', 'c']})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="keywords" content="a, b, c">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=keyword]` if `siteTags` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {siteTags: ['a', 'b', 'c']})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="keywords" content="a, b, c">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should combine `tags` and `siteTags` if both are set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {siteTags: ['b', 'c'], tags: ['a', 'b']})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="keywords" content="a, b, c">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=author]` if `author` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {author: 'Jane X. Doe'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="author" content="Jane X. Doe">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=copyright]` if `author` is set and `copyright` is on',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {author: 'Jane X. Doe', copyright: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="author" content="Jane X. Doe">',
            '<meta name="copyright" content="© ' +
              currentYear +
              ' Jane X. Doe">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=author]` if `siteAuthor` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {siteAuthor: 'Jane X. Doe'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="author" content="Jane X. Doe">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=copyright]` if `siteAuthor` is set and `copyright` is on',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {copyright: true, siteAuthor: 'Jane X. Doe'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="author" content="Jane X. Doe">',
            '<meta name="copyright" content="© ' +
              currentYear +
              ' Jane X. Doe">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should use the given `published` in `meta[name=copyright]`',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              author: 'Jane X. Doe',
              copyright: true,
              published: '2018'
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="author" content="Jane X. Doe">',
            '<meta name="copyright" content="© 2018 Jane X. Doe">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=theme-color]` if `color` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {color: '123456'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="theme-color" content="#123456">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test('should not add an extra `#` to colors', async function () {
      assert.equal(
        rehype()
          .data('settings', {fragment: true})
          .use(rehypeMeta, {color: '#123456'})
          .processSync('')
          .toString(),
        [
          '<head>',
          '<meta name="theme-color" content="#123456">',
          '</head>',
          ''
        ].join('\n')
      )
    })

    await t.test(
      'should add a `meta[name=twitter:card]` if `twitter` is true',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {twitter: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="twitter:card" content="summary">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should *not* add a `meta[name=twitter:card][content=summary]` if `og` is true',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {og: true, twitter: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="website">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=twitter:image]` if `image` is set and `twitter` is true, and use a `twitter:card=summary_large_image`',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              image: 'https://example.com/index.png',
              twitter: true
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="twitter:card" content="summary_large_image">',
            '<meta name="twitter:image" content="https://example.com/index.png">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=twitter:image:alt]` if an `image.alt` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              image: {alt: 'A', url: 'https://example.com/index.png'},
              twitter: true
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="twitter:card" content="summary_large_image">',
            '<meta name="twitter:image" content="https://example.com/index.png">',
            '<meta name="twitter:image:alt" content="A">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=twitter:site]` if `siteTwitter` is set and `twitter` is true',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {siteTwitter: 'example', twitter: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="twitter:card" content="summary">',
            '<meta name="twitter:site" content="@example">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should not add an extra `@` to twitter sites',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {siteTwitter: '@example', twitter: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="twitter:card" content="summary">',
            '<meta name="twitter:site" content="@example">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[name=twitter:creator]` if `authorTwitter` is set and `twitter` is true',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {authorTwitter: 'example', twitter: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="twitter:card" content="summary">',
            '<meta name="twitter:creator" content="@example">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should not add an extra `@` to twitter authors',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {authorTwitter: '@example', twitter: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="twitter:card" content="summary">',
            '<meta name="twitter:creator" content="@example">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=og:type][content=website]` if `og` is true',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {og: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="website">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=og:title]` if `og` is true and `title` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {og: true, title: 'About'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<title>About</title>',
            '<meta property="og:type" content="website">',
            '<meta property="og:title" content="About">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=og:title]` if `og` is true, `ogNameInTitle` is true, and `title` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {og: true, ogNameInTitle: true, title: 'About'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<title>About</title>',
            '<meta property="og:type" content="website">',
            '<meta property="og:title" content="About">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=og:title]` if `og` is true, `ogNameInTitle` is true, `title` is set, and `name` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              name: 'Site',
              og: true,
              ogNameInTitle: true,
              title: 'About'
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<title>About - Site</title>',
            '<meta property="og:type" content="website">',
            '<meta property="og:site_name" content="Site">',
            '<meta property="og:title" content="About - Site">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=og:site_name]` if `og` is true and a `name` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {name: 'Example', og: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<title>Example</title>',
            '<meta property="og:type" content="website">',
            '<meta property="og:site_name" content="Example">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=og:description]` if `og` is true and `description` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {description: 'Lorem ipsum', og: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="description" content="Lorem ipsum">',
            '<meta property="og:type" content="website">',
            '<meta property="og:description" content="Lorem ipsum">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=og:url]` if `og` is true',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {og: true, origin: 'https://a.com'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<link rel="canonical" href="https://a.com/">',
            '<meta property="og:type" content="website">',
            '<meta property="og:url" content="https://a.com/">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test('should ignore `image` by default', async function () {
      assert.equal(
        rehype()
          .data('settings', {fragment: true})
          .use(rehypeMeta, {image: 'https://example.com/index.png'})
          .processSync('')
          .toString(),
        '<head></head>\n'
      )
    })

    await t.test(
      'should add a `meta[property=og:image]` if `image` is set and `og` is on',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {image: 'https://example.com/index.png', og: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="website">',
            '<meta property="og:image" content="https://example.com/index.png">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=og:image:alt]` if `image` is an object with an alt',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              image: {alt: 'Alpha', url: 'https://example.com/index.png'},
              og: true
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="website">',
            '<meta property="og:image" content="https://example.com/index.png">',
            '<meta property="og:image:alt" content="Alpha">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=og:image:width]` if `image` is an object with a `width`',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              og: true,
              image: {url: 'https://example.com/index.png', width: 1}
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="website">',
            '<meta property="og:image" content="https://example.com/index.png">',
            '<meta property="og:image:width" content="1">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=og:image:height]` if `image` is an object with a `height`',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              og: true,
              image: {height: 1, url: 'https://example.com/index.png'}
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="website">',
            '<meta property="og:image" content="https://example.com/index.png">',
            '<meta property="og:image:height" content="1">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should *not* add a `meta[property=og:image]` if `image` is an object without a `url`',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            // @ts-expect-error: check how the runtime handles missing `url`.
            .use(rehypeMeta, {
              image: {alt: '?', height: 1, width: 1},
              og: true
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="website">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test('should add up to six images', async function () {
      assert.equal(
        rehype()
          .data('settings', {fragment: true})
          .use(rehypeMeta, {
            image: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
            og: true
          })
          .processSync('')
          .toString(),
        [
          '<head>',
          '<meta property="og:type" content="website">',
          '<meta property="og:image" content="a">',
          '<meta property="og:image" content="b">',
          '<meta property="og:image" content="c">',
          '<meta property="og:image" content="d">',
          '<meta property="og:image" content="e">',
          '<meta property="og:image" content="f">',
          '</head>',
          ''
        ].join('\n')
      )
    })

    await t.test(
      'should add a `meta[property=og:type][content=article]` if `og` is true and `type` is `article`',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {og: true, type: 'article'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="article">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=article:published_time]` if `og` is true, `type` is `article`, and `published` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              og: true,
              published: new Date(1_234_567_890_123),
              type: 'article'
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="article">',
            '<meta property="article:published_time" content="2009-02-13T23:31:30.123Z">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=article:modified_time]` if `og` is true, `type` is `article`, and `modified` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              og: true,
              modified: new Date(1_234_567_890_123),
              type: 'article'
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="article">',
            '<meta property="article:modified_time" content="2009-02-13T23:31:30.123Z">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test('should support dates as strings', async function () {
      assert.equal(
        rehype()
          .data('settings', {fragment: true})
          .use(rehypeMeta, {
            og: true,
            published: '2019-12-04T22:00:00.000Z',
            type: 'article'
          })
          .processSync('')
          .toString(),
        [
          '<head>',
          '<meta property="og:type" content="article">',
          '<meta property="article:published_time" content="2019-12-04T22:00:00.000Z">',
          '</head>',
          ''
        ].join('\n')
      )
    })

    await t.test(
      'should add a `meta[property=article:author]` if `og` is true, `type` is `article`, and `authorFacebook` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              authorFacebook: 'example',
              og: true,
              type: 'article'
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="article">',
            '<meta property="article:author" content="https://www.facebook.com/example">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add a `meta[property=article:section]` if `og` is true, `type` is `article`, and `section` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {og: true, section: 'a', type: 'article'})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta property="og:type" content="article">',
            '<meta property="article:section" content="a">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add up to 6 `meta[property=article:tag]` if `og` is true, `type` is `article`, and `tags` are set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {
              og: true,
              tags: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
              type: 'article'
            })
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="keywords" content="a, b, c, d, e, f, g">',
            '<meta property="og:type" content="article">',
            '<meta property="article:tag" content="a">',
            '<meta property="article:tag" content="b">',
            '<meta property="article:tag" content="c">',
            '<meta property="article:tag" content="d">',
            '<meta property="article:tag" content="e">',
            '<meta property="article:tag" content="f">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add `meta[name=twitter:label1]`, `meta[name=twitter:data1]` if `twitter` is true and `section` is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {section: 'a', twitter: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="twitter:card" content="summary">',
            '<meta name="twitter:label1" content="Posted in">',
            '<meta name="twitter:data1" content="a">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add `meta[name=twitter:label1]`, `meta[name=twitter:data1]` if `twitter` is true, `readingTime` is set, and section is not',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {readingTime: 0.1, twitter: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="twitter:card" content="summary">',
            '<meta name="twitter:label1" content="Reading time">',
            '<meta name="twitter:data1" content="1 minute">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should add `meta[name=twitter:label2]`, `meta[name=twitter:data2]` if `twitter` is true, `readingTime` is set, and section is set',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {readingTime: 0.1, section: 'a', twitter: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="twitter:card" content="summary">',
            '<meta name="twitter:label1" content="Posted in">',
            '<meta name="twitter:data1" content="a">',
            '<meta name="twitter:label2" content="Reading time">',
            '<meta name="twitter:data2" content="1 minute">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )

    await t.test(
      'should set `meta[name=twitter:data1]` to a `readingTime` range if `readingTime` is a tuple',
      async function () {
        assert.equal(
          rehype()
            .data('settings', {fragment: true})
            .use(rehypeMeta, {readingTime: [8.2, 11.1], twitter: true})
            .processSync('')
            .toString(),
          [
            '<head>',
            '<meta name="twitter:card" content="summary">',
            '<meta name="twitter:label1" content="Reading time">',
            '<meta name="twitter:data1" content="9-12 minutes">',
            '</head>',
            ''
          ].join('\n')
        )
      }
    )
  })

  await t.test('should work together', async function (t) {
    await t.test('should work on a newspaper article', async function () {
      assert.equal(
        rehype()
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
          .processSync('')
          .toString(),
        [
          '<head>',
          '<title>The New York City Subway Map as You’ve Never Seen It Before | The New York Times</title>',
          '<link rel="canonical" href="https://www.nytimes.com/interactive/2019/12/02/nyregion/nyc-subway-map.html">',
          '<meta name="description" content="The city has changed drastically over the past 40 years, yet the M.T.A. map designed in 1979 has largely endured.">',
          '<meta name="keywords" content="Subway, Map, Public Transit, Design, MTA, Massimo Vignelli, NYC, US Politics, Impeachment, NATO, London, Food, Poverty, Climate Change, Global Warming">',
          '<meta name="author" content="Jane Doe">',
          '<meta name="copyright" content="© 2019 Jane Doe">',
          '<meta property="og:type" content="article">',
          '<meta property="og:site_name" content="The New York Times">',
          '<meta property="og:url" content="https://www.nytimes.com/interactive/2019/12/02/nyregion/nyc-subway-map.html">',
          '<meta property="og:title" content="The New York City Subway Map as You’ve Never Seen It Before">',
          '<meta property="og:description" content="The city has changed drastically over the past 40 years, yet the M.T.A. map designed in 1979 has largely endured.">',
          '<meta property="og:image" content="https://static01.nyt.com/images/2019/12/02/autossell/mta-promo-image/mta-crop-facebookJumbo.jpg">',
          '<meta property="og:image:alt" content="M.T.A. map designed in 1979">',
          '<meta property="og:image:width" content="1050">',
          '<meta property="og:image:height" content="550">',
          '<meta property="article:published_time" content="2019-12-02T10:00:00.000Z">',
          '<meta property="article:modified_time" content="2019-12-03T19:13:00.000Z">',
          '<meta property="article:author" content="https://www.facebook.com/janedoe">',
          '<meta property="article:section" content="New York">',
          '<meta property="article:tag" content="Subway">',
          '<meta property="article:tag" content="Map">',
          '<meta property="article:tag" content="Public Transit">',
          '<meta property="article:tag" content="Design">',
          '<meta property="article:tag" content="MTA">',
          '<meta property="article:tag" content="Massimo Vignelli">',
          '<meta name="twitter:card" content="summary_large_image">',
          '<meta name="twitter:image" content="https://static01.nyt.com/images/2019/12/02/autossell/mta-promo-image/mta-crop-facebookJumbo.jpg">',
          '<meta name="twitter:image:alt" content="M.T.A. map designed in 1979">',
          '<meta name="twitter:site" content="@nytimes">',
          '<meta name="twitter:creator" content="@jane">',
          '<meta name="twitter:label1" content="Posted in">',
          '<meta name="twitter:data1" content="New York">',
          '<meta name="twitter:label2" content="Reading time">',
          '<meta name="twitter:data2" content="12 minutes">',
          '</head>',
          ''
        ].join('\n')
      )
    })

    await t.test('should work on a recipe', async function () {
      assert.equal(
        rehype()
          .data('settings', {fragment: true})
          .use(rehypeDocument, {
            css: 'index.css',
            js: 'index.js',
            language: 'en'
          })
          .use(rehypeMeta, {
            author: 'Jane Doe',
            authorFacebook: 'janedoe',
            authorTwitter: '@jane',
            copyright: true,
            description:
              'Crispy Sea Salt and Vinegar Roasted Potatoes. These are so crisp and flavorful, you’ll want to eat them as a side dish for every meal!',
            image: {
              height: '1012',
              url: 'https://hostthetoast.com/wp-content/uploads/2014/06/Salt-and-Vinegar-Potatoes-6.jpg',
              width: '670'
            },
            modified: '2017-04-26T22:37:10-05:00',
            name: 'Host The Toast',
            og: true,
            origin: 'https://hostthetoast.com',
            pathname: '/crispy-sea-salt-vinegar-roasted-potatoes/',
            published: '2014-06-30T15:01:35-05:00',
            readingTime: 3.083,
            section: 'Food',
            siteAuthor: 'Host the Toast',
            siteTwitter: '@hostthetoast',
            tags: [
              'chips',
              'Crispy',
              'crispy sea salt and vinegar roasted potatoes',
              'Easy',
              'Potatoes',
              'Recipe',
              'Roasted',
              'salt',
              'salt and vinegar',
              'sea salt',
              'side',
              'side dish',
              'vinegar',
              'wedges'
            ],
            title: 'Crispy Sea Salt and Vinegar Roasted Potatoes',
            twitter: true,
            type: 'article'
          })
          .processSync('')
          .toString(),
        [
          '<!doctype html>',
          '<html lang="en">',
          '<head>',
          '<meta charset="utf-8">',
          '<meta content="width=device-width, initial-scale=1" name="viewport">',
          '<link href="index.css" rel="stylesheet">',
          '',
          '<title>Crispy Sea Salt and Vinegar Roasted Potatoes - Host The Toast</title>',
          '<link rel="canonical" href="https://hostthetoast.com/crispy-sea-salt-vinegar-roasted-potatoes/">',
          '<meta name="description" content="Crispy Sea Salt and Vinegar Roasted Potatoes. These are so crisp and flavorful, you’ll want to eat them as a side dish for every meal!">',
          '<meta name="keywords" content="chips, Crispy, crispy sea salt and vinegar roasted potatoes, Easy, Potatoes, Recipe, Roasted, salt, salt and vinegar, sea salt, side, side dish, vinegar, wedges">',
          '<meta name="author" content="Jane Doe">',
          '<meta name="copyright" content="© 2014 Jane Doe">',
          '<meta property="og:type" content="article">',
          '<meta property="og:site_name" content="Host The Toast">',
          '<meta property="og:url" content="https://hostthetoast.com/crispy-sea-salt-vinegar-roasted-potatoes/">',
          '<meta property="og:title" content="Crispy Sea Salt and Vinegar Roasted Potatoes">',
          '<meta property="og:description" content="Crispy Sea Salt and Vinegar Roasted Potatoes. These are so crisp and flavorful, you’ll want to eat them as a side dish for every meal!">',
          '<meta property="og:image" content="https://hostthetoast.com/wp-content/uploads/2014/06/Salt-and-Vinegar-Potatoes-6.jpg">',
          '<meta property="og:image:width" content="670">',
          '<meta property="og:image:height" content="1012">',
          '<meta property="article:published_time" content="2014-06-30T20:01:35.000Z">',
          '<meta property="article:modified_time" content="2017-04-27T03:37:10.000Z">',
          '<meta property="article:author" content="https://www.facebook.com/janedoe">',
          '<meta property="article:section" content="Food">',
          '<meta property="article:tag" content="chips">',
          '<meta property="article:tag" content="Crispy">',
          '<meta property="article:tag" content="crispy sea salt and vinegar roasted potatoes">',
          '<meta property="article:tag" content="Easy">',
          '<meta property="article:tag" content="Potatoes">',
          '<meta property="article:tag" content="Recipe">',
          '<meta name="twitter:card" content="summary_large_image">',
          '<meta name="twitter:image" content="https://hostthetoast.com/wp-content/uploads/2014/06/Salt-and-Vinegar-Potatoes-6.jpg">',
          '<meta name="twitter:site" content="@hostthetoast">',
          '<meta name="twitter:creator" content="@jane">',
          '<meta name="twitter:label1" content="Posted in">',
          '<meta name="twitter:data1" content="Food">',
          '<meta name="twitter:label2" content="Reading time">',
          '<meta name="twitter:data2" content="4 minutes">',
          '</head>',
          '<body>',
          '<script src="index.js"></script>',
          '</body>',
          '</html>',
          ''
        ].join('\n')
      )
    })
  })
})
