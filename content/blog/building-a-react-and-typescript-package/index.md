---
title: Building a React and TypeScript Library
description: ""
date: 2020-08-01
published: false
---

This is a tutorial on how to build, or bundle, a React- and TypeScript-based library into a package destined for the NPM or GitHub registries. In this tutorial, we will be using Rollup as our build tool.

Rollup, for those who have yet to explore it, takes your small, separated, organized pieces of code and compiles them into a library or an application. For our purposes, it will be a library. In its simplest form, Rollup takes your entry point and all the files it imports, not including package imports, for example `import React, {useState} from 'react'` would not work, and compiles them into a single file. Our use case requires more than that.

To allow for compilation of TypeScript and JSX alongside bundling of packages including React, you'll need plugins. Before we get ahead of ourselves let's look at a basic configuration for Rollup.

