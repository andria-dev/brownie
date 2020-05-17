---
title: 'The Current State Of The Future Of Web Development: Web Components'
description: ''
date: 2020-05-14
published: false
---

## What are Web Components?

> Web Components are a suite of technologies allowing you to create reusable custom elements.
>
> — MDN <sup>[1]</sup>

Currently, **`customElements`, the shadow DOM, and HTML templates** make up web components.

`customElements` is the registry you would use to define your web components as either standalone elements or extensions of existing elements. There are a few extra APIs attached to `customElements` other than `define()` that we won't go into right now. <sup>[2]</sup>

Then you have the shadow DOM, this is your very own isolated DOM for your custom element. This is what allows things like scoped CSS to be possible. <sup>[3]</sup>

Lastly, we have HTML templates. These are a couple of elements and APIs that are used to make reusable templates. `<template>` is used to keep a copy of your HTML until you render your HTML content to the DOM <sup>[4]</sup>. In conjunction with that, the `<slot>` element, used as a placeholder for content, can be passed into your custom element. <sup>[5]</sup>

### What can they do?

Web Components have a variety of different abilities that provide a unique API for the developer to interact with. These abilities cover a lot of use cases for the web community. Here are some of the abilities provided by the Web Component API:

- React to changes in attributes, that are declared in the `observedAttributes` property, via `attributeChangedCallback`.
  - This allows you to create elements that are reactive and reusable in nature because they can adjust when their "props" change.
- Dispatch events upward either to their immediate parent element or all the way through the tree.
  - This is different from libraries like React where one is required to pass down a function allowing them to pass things back upward.
- Encapsulate CSS styles which will prevent the styles from becoming global and clashing with existing stylesheets that one is using.
- Reuse your code in multiple places as HTML elements. This is possible because of the way that Web Components create new instances of themselves.
- Slotting, or allowing elements to be passed down and rendered inside a web component like `children` via default and named slots.

## Advantages and disadvantages of using Web Components:

Beyond just looking at what Web Components capabilities are, it's important to look at how well they're implemented and what features they're missing. This can range from small nitpicks to issues that are the main focus of the community. On the flip side, there are also the features that definitively prove conducive to an expeditious development experience and more manageable code base. We'll start with these ones first:

### Advantages

- Web Components **can fit in anywhere**.
  - Due to their nature of extending HTML elements, Web Components can be placed anywhere that HTML is used.
  - This is applicable to most modern JavaScript frameworks and libraries. Even browser extensions can utilize Web Components.
- They don't care **how content is rendered**.
  - Web Components weren't built around the concept of a render function, therefore, a specific style of rendering can be created by expanding upon the base HTMLElement class. A couple great examples of this include:
    - Polymer — utilizes a `render()` method, which returns a template, on their `Polymer` class. The method is called when states or specified attributes change.
    - Haunted — utilizes function components based on React's Hooks style to create Web Components that rerender on dependency changes.
- They **support bi-directional data flow**.
  - Due to Web Components nature of having no input on how you manage state, bi-directional data flow is made possible.
  - This allows developers to write more reactive code that avoids constant event-handling duplication and manual state management handling
  - I built an example of this, [check out two-way](https://github.com/ChrisBrownie55/two-way).

### Disadvantages

- The **lack of state management** in Web Components leaves raw Web Components with only events and attributes
  - Event-based state management, _without a state-machine or state-chart_, can lead to many errors and hard to manage code.
- **SSR and SSG are currently limited** because Web Components were built on JavaScript APIs that don't map to regular HTML5 elements. <sup>[7]</sup>
  - Most options these days that do map to HTML elements are polyfills that are just more userland JavaScript.
- You will likely have to **abandon all of your bundling and tooling applications** that you're used to in favor of full Web Component frameworks such as:
  - Stencil.js
  - The Polymer Project
  - Or no framework at all
- **Progressive enhancement is much more difficult** for the same reasons that SSR and SSG are limited.
  - The inability to remove JavaScript from Web Components makes custom elements _extremely_ difficult to progressively enhance compared to other modern frameworks.

### How can we make it better?

Web Components are lacking many features that make web development itself more intuitive today, all in all Web Components have a long way to go. To improve upon the _"Custom Elements v1"_ standard, I think it's important to look at the successes and failures of past libraries and frameworks.

#### First let's look at JQuery

<JQuery is huge>. <JQuery is entirely state-framework independent and therefore relies on events>. <Event-only based development is messy>, <doesn't scale well>.

##### How does this compare to Web Components?

<Web Components have attributes>. <Attributes make things better... almost>, <they provide a way to store state as properties passed to an element>. <They don't fix solely event-based development though>.

##### A modal in JQuery:

<Explain the HTML>.

```html
```

<Explain the JS>.

```js
```

<Make conclusion>.

#### How does this compare to more modern frameworks and libraries:

##### React

##### Vue

## Tooling

Mollit laborum id elit qui enim irure do. Velit eu in cupidatat cillum dolor incididunt qui eu eu commodo esse do. Culpa tempor consequat non commodo deserunt minim sit sunt. Et qui elit ullamco magna sint occaecat sunt duis laborum. Do voluptate Lorem laborum non irure amet culpa. Voluptate irure exercitation labore culpa ex sunt tempor veniam deserunt non fugiat eu Lorem dolor. Veniam tempor esse elit reprehenderit exercitation elit cupidatat.

### State management

Ea fugiat proident nostrud non in nostrud enim ipsum elit tempor amet ipsum sunt. Pariatur labore incididunt incididunt culpa. Qui mollit nulla pariatur eiusmod mollit velit incididunt ipsum sit sint cillum. Ex quis consequat veniam occaecat ut est eu incididunt excepteur aliquip aliqua velit sit. Laborum aliqua cupidatat laborum duis cupidatat fugiat proident aute nulla laboris exercitation voluptate. Dolore aute velit veniam qui sint non fugiat veniam.

Fugiat proident est laboris veniam laboris consectetur sit eiusmod. Fugiat magna qui sunt ea officia eiusmod. Nisi do ad nisi laborum.

### Bundling

Mollit ex tempor laboris commodo voluptate non non aliqua consequat adipisicing nisi aliquip. Minim adipisicing eiusmod deserunt dolore consectetur eiusmod laborum. Commodo cillum quis adipisicing nulla mollit exercitation labore eiusmod sit deserunt laboris. Non est elit Lorem id duis aliquip velit. Voluptate magna amet consectetur cillum ex proident cupidatat officia. Et exercitation voluptate consectetur pariatur occaecat anim in exercitation anim sunt in aute. Id ullamco velit ut cillum consectetur aute aute anim nostrud occaecat amet irure consectetur.

## Sources

0. https://chrisbrownie55.github.io/svg-designer
1. https://developer.mozilla.org/en-US/docs/Web/Web_Components
2. https://w3c.github.io/webcomponents/spec/custom
3. https://developers.google.com/web/fundamentals/web-components/shadowdom
4. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
5. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot
6. https://javascript.info/shadow-dom-events
7. https://github.com/skatejs/skatejs/tree/master/packages/ssr
