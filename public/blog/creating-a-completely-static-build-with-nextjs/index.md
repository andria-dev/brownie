---
title: Creating a Completely Static Build with Next.js
description: 'A brief tutorial on how to set up Next.js to produce no-JavaScript static builds and end FOUC'
date: 2020-11-12
published: false
---

If you've ever tried to write a Next.js application that utilizes its SSG (static site generation) or SSR (server-side rendering) features, you may have noticed a **considerable FOUC** (flash of unstyled content). In my experience, this was caused by Next.js using its `<NextScript>` component to load in all the styles at runtime. For a static site, it would be preferable to compile all the styles to static CSS files and load them straight from the server.

This article will explain how to make a site built with Next.js completely independent of all the scripts that Next.js likes to bundle it with. This way, your site can load instantly once the user's web browser retrieves the HTML and CSS.


