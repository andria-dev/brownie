---
title: 'React Spring Modal: An In-Depth Tutorial'
description: How to use my new library to accessibly and smoothly display beautiful modals
date: 2019-11-11
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

To create your own modal with `<BaseModal>` you just have to use `react-spring`'s `useTransition`. Say you want your modal to grow in using a CSS transform, that might look like this:

  ```jsx
  // This is the state that determines if the modal is open
  const [isOpen, setOpen] = useState(false)

  // This is where our animation is created
  // we go from `scale(0)` to `scale(1)`
  const transition = useTransition(isOpen, null, {
    from: { transform: 'scale(0)' },
    enter: { transform: 'scale(1)' },
    leave: { transform: 'scale(0)' }
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

  If you're not fond of animations just pass in any old thing to BaseModal:

```jsx
<BaseModal>
  <main>
    <h1>My simple modal</h1>
    <p>Sometimes animations just slow things down</p>
  </main>
</BaseModal>
```

- nesting
