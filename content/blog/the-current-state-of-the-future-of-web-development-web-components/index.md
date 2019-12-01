---
title: 'The Current State Of The Future Of Web Development: Web Components'
description: ''
date: 2019-11-28
published: false
---

## What are Web Components?

> Web Components are a suite of technologies allowing you to create reusable custom elements.
>
> — MDN <sup>[1]</sup>

Currently, web components are made up of **`customElements`, the shadow DOM, and HTML templates**.

`customElements` is the registry you use to define your web components as either standalone elements or extensions of existing elements. There are a few extra APIs attached to `customElements` other than `define()` that we won't go into right now. <sup>[2]</sup>

Then you have the shadow DOM, this is your very own isolated DOM for your custom element. This is what allows things like scoped CSS to be possible. <sup>[3]</sup>

Lastly, we have HTML templates. These are a couple of elements and APIs that are used to make reusable templates. `<template>` is used to keep a copy of your HTML until you render your HTML content to the DOM <sup>[4]</sup>. In conjunction with that, the `<slot>` element is used as a placeholder for content that can be passed into your custom element. <sup>[5]</sup>

### What can they do?

- Qui sint incididunt amet ullamco ut occaecat.
- Qui sint incididunt amet ullamco ut occaecat.
- Qui sint incididunt amet ullamco ut occaecat.
- Qui sint incididunt amet ullamco ut occaecat.
- Qui sint incididunt amet ullamco ut occaecat.

## Advantages and disadvantages of using Web Components:

Ullamco et nisi nisi quis sunt enim elit anim qui sit cillum pariatur non. Aliqua commodo reprehenderit pariatur anim. Mollit incididunt do esse enim tempor do magna excepteur ullamco labore nulla occaecat. Aute mollit fugiat anim id fugiat laborum enim in dolor do id ut eu amet. Nulla pariatur dolore tempor aute consequat deserunt aliquip quis ea.

### Advantages

- Culpa culpa laboris laborum veniam incididunt exercitation cillum ut culpa amet et velit.
- Culpa culpa laboris laborum veniam incididunt exercitation cillum ut culpa amet et velit.
- Culpa culpa laboris laborum veniam incididunt exercitation cillum ut culpa amet et velit.

### Disadvantages

- Pariatur voluptate cillum ipsum consequat officia commodo sit excepteur proident sunt tempor adipisicing id.
- Pariatur voluptate cillum ipsum consequat officia commodo sit excepteur proident sunt tempor adipisicing id.
- Pariatur voluptate cillum ipsum consequat officia commodo sit excepteur proident sunt tempor adipisicing id.

### How can we make it better?

Pariatur dolore proident eu reprehenderit laboris velit eiusmod. Minim labore aute fugiat ea eiusmod quis quis pariatur dolore adipisicing. Aliqua enim eu ea pariatur Lorem nulla eu id consectetur tempor sint.

## Tooling

Mollit laborum id elit qui enim irure do. Velit eu in cupidatat cillum dolor incididunt qui eu eu commodo esse do. Culpa tempor consequat non commodo deserunt minim sit sunt. Et qui elit ullamco magna sint occaecat sunt duis laborum. Do voluptate Lorem laborum non irure amet culpa. Voluptate irure exercitation labore culpa ex sunt tempor veniam deserunt non fugiat eu Lorem dolor. Veniam tempor esse elit reprehenderit exercitation elit cupidatat.

### State management

Ea fugiat proident nostrud non in nostrud enim ipsum elit tempor amet ipsum sunt. Pariatur labore incididunt incididunt culpa. Qui mollit nulla pariatur eiusmod mollit velit incididunt ipsum sit sint cillum. Ex quis consequat veniam occaecat ut est eu incididunt excepteur aliquip aliqua velit sit. Laborum aliqua cupidatat laborum duis cupidatat fugiat proident aute nulla laboris exercitation voluptate. Dolore aute velit veniam qui sint non fugiat veniam.

Fugiat proident est laboris veniam laboris consectetur sit eiusmod. Fugiat magna qui sunt ea officia eiusmod. Nisi do ad nisi laborum.

### Bundling

Mollit ex tempor laboris commodo voluptate non non aliqua consequat adipisicing nisi aliquip. Minim adipisicing eiusmod deserunt dolore consectetur eiusmod laborum. Commodo cillum quis adipisicing nulla mollit exercitation labore eiusmod sit deserunt laboris. Non est elit Lorem id duis aliquip velit. Voluptate magna amet consectetur cillum ex proident cupidatat officia. Et exercitation voluptate consectetur pariatur occaecat anim in exercitation anim sunt in aute. Id ullamco velit ut cillum consectetur aute aute anim nostrud occaecat amet irure consectetur.

## Sources

https://chrisbrownie55.github.io/svg-designer

1. https://developer.mozilla.org/en-US/docs/Web/Web_Components
2. https://w3c.github.io/webcomponents/spec/custom
3. https://developers.google.com/web/fundamentals/web-components/shadowdom
4. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
5. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot
