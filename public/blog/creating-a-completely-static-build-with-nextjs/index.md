---
title: Creating a Completely Static Build with Next.js
description: 'A brief tutorial on how to set up Next.js to produce no-JavaScript static builds and end FOUC'
date: 2020-11-12
published: false
---

If you've ever tried to write a Next.js application that utilizes its SSG (static site generation) or SSR (server-side rendering) features, you may have noticed a **considerable FOUC** (flash of unstyled content). In my experience, this was caused by Next.js using its **`<NextScript>` component** to load in all the styles at runtime. For a static site, it would be preferable to compile all the styles to static CSS files and load them straight from the server.

This article will explain how to make a site built with Next.js completely independent of all the scripts that Next.js likes to bundle it with. This way, your site can load instantly once the user's web browser retrieves the HTML and CSS.

Let's dive right in to some basic Next.js code for an application:

```jsx
// pages/index.js
import Link from 'next/link'

export default function HomePage() {
	return (
		<div className="page">
			<header className="page-section">
				<h1 className="landing-title">Welcome to Next.js!</h1>
				<p className="text-center">
					A generic paragraph explaining what this site is supposed to be and
					why you care about that. More information below.
				</p>
				<Link href="/products">
					<a>Call to action</a>
				</Link>
			</header>

			{/* Pretend there's a bunch more styles here. */}
			<style jsx>{`
				.text-center {
					text-align: center;
				}
			`}</style>
		</div>
	)
}
```

In this example you can see that we are creating our "HomePage" with a simple landing page layout. With our content, we're using `styled-jsx`, which Next.js supports out-of-the-box, to style it.

## Making a simple site static

If we were to try to make this into a static site with `next build`, Next.js would include its `<NextScript>`s. Including these scripts somewhat defeats the purpose of having a static website or even just a static landing page.

With this simple application, all we are required to do to remove these scripts is export a configuration object from our page file. Here is an example of that:

```jsx
function HomePage() {
	/* Truncated */
}

export const config = {
	unstable_runtimeJS: false,
}
```

The configuration object has one parameter that we are interested in: **`unstable_runtimeJS`**. To disable Next.js' runtime scripts, we'll set this to `false`. Keep in mind, Next.js only applies the configuration object on a per-page basis. Once we do this, the scripts provided are no longer in the **build**. This does not affect how `next dev` works because Next.js needs these scripts to be able to run in development mode.

All of these steps were for a "simple" site. What exactly does that mean?

In this instance, it means that you're using Next.js' default `Document` rendering component. It's what allows you to write your page components and not worry about creating your `<head>`, `<link>`, `<script>`, or `<body>` elements.

## What if I'm using "\_document.js"?

To review, `pages/_document.js` is a file that allows you to create a custom `Document` which lets us have control over what Next.js was handling above. Next.js also handles the insertion of its own `<NextScript>`. However, if we're writing our own `_document.js` file, we will need to provide `<NextScript>` in the return value of our `render()` method, as is explained in the documentation. This seems a bit counterproductive though because we're trying to remove the Next.js' scripts from our build. We'll figure that out in a second.

Let's make a basic `_document.js` file first. There's a total of four required components in the return value of our `render()` method:

- `<Html>`
- `<Head />`
- `<Main />`
- `<NextScript />`

Now that we have our requirements let's look at an example:

```jsx
// pages/_document.js
import Document, {Html, Head, Main, NextScript} from 'next/document'

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en-US">
				<Head>
					<meta charSet="UTF-8" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
```

This example is fairly self-explanatory. If you want to add metadata, scripts, or styles to your site, you can do so within the `<Head></Head>` tags. Just as well, if you want to add extra content besides your page itself, `<Main />`, then you can do so within the `<body></body>` tags.

### Removing Next.js' scripts safely

When removing `<NextScript />` from your `render()` method, there are a few things to consider:

- In development mode, `<NextScript />` must always be present.
- When `unstable_runtimeJS` is `false`, `<NextScript />` is optional.
- However, when `unstable_runtimeJS` is `true`, which is the default, `<NextScript />` is required.

With this information we can start working on removing these scripts from our build where we don't want them. Remember, we only want to include the scripts if we're in development mode, or, conversely, if we're not in production mode or if `unstable_runtimeJS` is enabled. We can write this with two simple conditions.

```javascript
// unstable_runtimeJS is provided via `this.props`
const shouldRenderScripts =
	this.props.unstable_runtimeJS || process.env.NODE_ENV !== 'production'
```

Now that we know when to render the scripts, we can remove them the rest of the time.

```jsx
export default class MyDocument extends Document {
	render() {
		const shouldRenderScripts =
			this.props.unstable_runtimeJS || process.env.NODE_ENV !== 'production'
		return (
			<Html lang="en-US">
				<Head>
					<meta charSet="UTF-8" />
				</Head>
				<body>
					<Main />
					{shouldRenderScripts ? <NextScript /> : null}
				</body>
			</Html>
		)
	}
}
```

That's it! You've created a completely static build with the Next.js framework. Although, some of you might be having some problems with your styles not being included now just as I did when implementing this.

## Including your styles in your build

Personally, I'm not too familiar with the inner workings of `styled-components` or `styled-jsx`, however, I did find a solution. We need to write a static method called `getInitialProps` that runs at build-time. In this method, we will use a `ServerStyleSheet` to collect all the stylesheets from our pages. Then, we'll extract the styles and flush `styled-jsx`'s styles and add them to `this.props`.

```jsx
import Document, {Html, Head, Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'
import flush from 'styled-jsx/server'

export default class BlogDocument extends Document {
	static getInitialProps({renderPage}) {
		// Step 1: Create an instance of ServerStyleSheet
		const sheet = new ServerStyleSheet()

		// Step 2: Retrieve styles from components in the page
		const page = renderPage((App) => (props) =>
			sheet.collectStyles(<App {...props} />),
		)

		// Step 3: Extract the styles as <style> tags
		const styleTags = sheet.getStyleElement()
		const styles = flush()

		// Step 4: Pass styleTags as a prop
		return {...page, styleTags, styles}
	}

	render() {
		const shouldRenderScripts =
			this.props.unstable_runtimeJS || process.env.NODE_ENV !== 'production'

		return (
			<Html lang="en-US">
				<Head>
					<meta charSet="UTF-8" />
					{this.props.styleTags}
				</Head>
				<body>
					<Main />
					{shouldRenderScripts ? <NextScript /> : null}
				</body>
			</Html>
		)
	}
}
```

If this doesn't work for you, shoot me a message on Twitter or leave comment on Next.js' GitHub.

## Thank you for reading this

I appreciate your time, and I hope you gained as much from this as I did. Any compliments or constructive comments are always welcome.
