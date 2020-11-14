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
          A generic paragraph explaining what this site is supposed to be and why you care about that. More information below.
        </p>
		<Link href="/products">
          <a>Call to action</a>
        </Link>
	  </header>

	  {/* Pretend there's a bunch more styles here. */}
	  <style jsx>
		.text-center {
		  text-align: center;
		}
	  </style>
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
  unstable_runtimeJS: false
}
```

The configuration object has one parameter that we are interested in: **`unstable_runtimeJS`**. To disable Next.js' runtime scripts, we'll set this to `false`. Keep in mind, Next.js only applies the configuration object on a per-page basis. Once we do this, the scripts provided are no longer in the **build**. This does not affect how `next dev` works because Next.js needs these scripts to be able to run in development mode.

All of these steps were for a "simple" site. What exactly does that mean?

In this instance, it means that you're using Next.js' default `Document` rendering component. It's what allows you to write your page components and not worry about creating your `<head>`, `<link>`, `<script>`, or `<body>` elements.

## What if I'm using _document.js?

To review, `pages/_document.js` is a file that allows you to create a custom `Document` which lets us have control over what Next.js was handling above. Next.js also handles the insertion of its own `<NextScript>`. However, if we're writing our own `_document.js` file, we will need to provide `<NextScript>` in the return value of our `render()` method as is explained in the documentation. This seems a bit counterproductive though because we're trying to 

There are actually four total required components in the return value:

- `<Html>`
- `<Head />`
- `<Main />`
- `<NextScript />`

Now that we have our requirements we can see a basic example of 

