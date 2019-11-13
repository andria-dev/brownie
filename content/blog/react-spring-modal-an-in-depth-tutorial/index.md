---
title: 'React Spring Modal: An In-Depth Tutorial'
description: How to use my new library to accessibly and smoothly display beautiful modals
date: 2019-11-11
published: false
---

<video autoplay loop style="width: 100%; border-radius: 4px;">
  <source src="notably-example-recording.mp4" />
</video>

## What is React Spring Modal?

React Spring Modal is a component library for building completely animatable and thoroughly accessible modals. Packaged with it are a couple of pre-built modal components with animations to simplify the more common use cases.

The underlying animation library it uses is [`react-spring`](https://www.react-spring.io/)

<hr>

## Setup

Before we can jump right in, there are a few things you need to do to get started due to this package's reliance on React and React Spring.

### Installation

React Spring Modal has three peer dependencies: react, react-dom, and react-spring. To install this package and it's peer dependencies run this command `pnpm i react-spring-modal react react-dom react-spring`.

### Initialization

You might be thinking that we're good to go now and we can just start rendering components. Don't worry, we're almost there.

First, add `<div id="modal-root"></div>` to your _index.html_ file to allow the modals to render outside of the normal flow of your tree and into a special modal tree.

Your _index.html_ file should have something like the following in it:

```html
<div id="root"></div>
<div id="modal-root"></div>
```

## Usage

This library comes with a way to compose your own modal components and, in addition, it's own provided modals for common situations to reduce the overhead to get started.

### Provided Modals

- `<BottomModal>` slides in from the bottom providing a nice user interface for contextual menus.
- `<CenterModal>` is just your average centered-in-the-screen modal that fades in.

#### Props

To use these two components all you need to do is provide to the component the following props:

- `isOpen` a boolean used to determine whether or not the modal should be open
- `onRequestClose` a function that will change the state associated with `isOpen` to `false`. This is used for things like pressing the Esc (escape) key or clicking outside of the modal.

### Custom Modals

In order to create custom modals, you are provided with a component: `<BaseModal>`. This is the underlying component used to build your provided components and will be the underlying component for your custom modals as well.

But to be clear, `<BaseModal>` isn't just a component to render the tree you provide it to `<div id="modal-root">` through a portal. **It handles quite a few accessibility and user experience concerns that truly bring to life modals on the web**.

Here is a list of all of the things that `<BaseModal>` does:

- Locks the screen from scrolling when the modal is open.
- Provides a backdrop that fades in.
- Focus restoration when closing the modal.
- Focuses on the first focusable element of the modal when opened.
- Closes the modal when Esc (escape) is pressed.
- Closes the modal when the backdrop is clicked on instead of an item in the modal.
- Applies the attribute `inert` to `<div id="root">` or `<div id="__next">` which prevents all users (screen readers, keyboard warriors, and mouse chasers) from interacting with the elements you should no longer be able to reach.

#### How do you use BaseModal?

You use it the same way you would `<BottomModal>` or `<CenterModal>`, however, there's no styled container that looks like a modal that your elements are rendered into. Instead, you have to provide a styled and animated container element yourself.

To create your own modal with `<BaseModal>` you just have to use `react-spring`'s `useTransition`. Say you want your modal to fade in using a CSS transform, that might look like this:

```jsx
// This is the state that determines if the modal is open
const [isOpen, setOpen] = useState(false)

// This is where our animation is created
// we go from `opacity: 0` to `opacity: 1`
const transition = useTransition(isOpen, null, {
  from: { opacity: '0' },
  enter: { opacity: '1' },
  leave: { opacity: '0' }
})

// Below you'll see a property called "props" it contains all of the animated styles, pass it to your `animated` component and you're all set
// You'll also see "item", this is used to determine when your modal should be rendered at all.
return (
  <BaseModal isOpen={isOpen} onRequestClose={() => setOpen(false)}>
    {transition.map(
      ({ item, key, props }) =>
        item && (
          <animated.div key={key} style={props}>
            <h1>Your Modal Has Arrived</h1>
            <p>This will have scaled in once opened</p>
          </animated.div>
        )
    )}
  </BaseModal>
)
```

In the above code-block, you'll notice the main part of animating your modal is setting at what point what the CSS styles you provide should be applied to your element.

- `from` contains the styles that are applied when the modal is first rendered.
- `enter` contains the styles that are applied when the modal animates to it's open state.
- `leave` is the opposite of `enter` and often matches `from`. It contains the styles for the closed state.

Then, these styles are handed to you, once you begin mapping over `transition`, through the property `props`. You can take `props` and pass it directly to your `<animated.div>` (or any other `animated.` element).

Other than specifying your styles, all you have to do is tell it when to open and when to close:

```js
useTransition(isOpen, null /* etc ... */)
```

In the above piece of code, `useTransition` takes in three arguments, we just covered the third one mere moments ago. The first argument, in our case, will always be a `Boolean` value representing the open/close state of the modal. The second argument represents the `key` to uniquely identify your items you wish to animate. It will always be `null` because we are only animating one modal not a list of them.

The second part of telling it how to open and close is done through the property `item`. With our use case, `item` will always be `true` or `false`. This will allow us to conditionally render our modal via `item && (/* my modal code */)`.

<small>Side note: yes you have to do `transition.map()` to access `item` and `props`.</small>

#### What if I just want a plain old modal?

If you're not fond of animations just pass in any old thing to `<BaseModal>` as children to have it render it while still getting all of it's benefits:

```jsx
<BaseModal>
  <main className="MyModal">
    <h1>My simple modal</h1>
    <p>Sometimes animations just slow things down</p>
  </main>
</BaseModal>
```

#### "Wow! This is so simple."

If you're thinking to yourself "Wow! This is so simple," then you're gonna love how simple it is to render another modal from within your modal. If you think that it's not so simple, <a href="https://github.com/ChrisBrownie55/react-spring-modal/issues">please open up an issue on the repository</a> and we can discuss making it better.

### Nesting

The steps one would take to render a modal from within a modal, otherwise known as nesting modals, are no different than the steps to render one modal. For example, say I have two modal components, `<OuterModal>` and `<InnerModal>`, and I want to render `<InnerModal>` when something happens in `<OuterModal>`. That might look like this:

```jsx
const [isOuterOpen, toggleOuterOpen] = useToggle(false)
const [isInnerOpen, toggleInnerOpen] = useToggle(false)

return (
  <OuterModal isOpen={isOuterOpen} onRequestClose={toggleOuterOpen}>
    <h1>This is the outer modal</h1>
    <p>Lorem ipsum dolor sit amet.</p>
    <button onClick={toggleInnerOpen}>Open Inner Modal</button>

    <InnerModal isOpen={isInnerOpen} onRequestClose={toggleInnerOpen}>
      <h1>This is the inner modal.</h1>
    </InnerModal>
  </OuterModal>
)
```

## Thank you for your time.

Here are some links to look at if you want to keep exploring:

- <a href="https://www.react-spring.io/">React Spring</a>
- <a href="https://twitter.com/0xca0a">Creator of React Spring</a>
- <a href="https://github.com/ChrisBrownie55/react-spring-modal">React Spring Modal</a>
- <a href="https://github.com/ChrisBrownie55/notably">Notably: an application built with react-spring-modal</a>
