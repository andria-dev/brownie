---
title: How to Make Your Code Readable
description: Just because a machine can read it doesn't mean it's good
date: 2018-06-30
published: true
---

![](matrix-code.jpeg)
<br>
<small align="center" style="width: 100%; display: block;">Photo by [Markus Spiske](https://unsplash.com/@markusspiske?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=medium&utm_medium=referral)</small>

We've all seen (and written) bad code at one point or another. To avoid putting more bad code into the world, hopefully we're all working at bettering our coding skills, which means perfecting what we already know and not just learning the newest framework out there.

**Why do we need to write good code, not just performant code?**

While the performance of your product or site is important, so is the way your code looks. The reasoning behind this is that the machine isn't the only entity reading your code.

First, and foremost, you are eventually going to have to re-read some portion of your code, if not the whole thing, and, when that time comes, performant code isn't going to help you understand what you've written - or help you figure out how to fix it.

Second, if you work on a team or collaborate with other developers, those team members will have to read your code at some time, and will try to interpret it in a way they understand. To make that task easier for them, it's important to consider how you name variables and functions, the length of each line, and the structure of your code, among other things.

Lastly, _it's just nicer to look at_.

What follows are instruction in how to improve your code-writing skills.

---

## How Do You Identify Bad Code?

The simplest way to identify bad code, in my opinion, is to try to read your code as if it were a sentence or phrase.

Here, for example, is some bad code:

![Screenshot of the bad version of function "traverseUpUntil"](bad-code.png)

The function pictured above, when passed an element and a conditional function, returns the nearest "parent" node that passes the conditional function.

```js
const traverseUpUntil = (el, f) => {
```

Following the idea that code should be as readable as regular writing, the first line has three fatal flaws.

**The parameters for the function are not readable like words.**

- While `el` can be understood as it is commonly used to mean `element`, the parameter name `f` does not explain its purpose.
- If you were to use the function, it would read, "traverse up until el passes f," which could probably be better understood as "traverse up until f passes, from el." Granted, the best way to _actually_ do this would be to allow the function to be called `el.traverseUpUntil(f)` - but that's a different problem.

In the second line, `let p = el.parentNode`, we again have a naming issue, this time with a variable. If one were to look at the code they would most likely understand what `p` is. It is the `parentNode` of parameter `el`. However, when we look at `p` used anywhere else, we no longer have the context that explains what it is.

```js
while (p.parentNode && !f(p)) {
```

In this line, the main problem we encounter is not knowing what `!f(p)` means or what it does, because `f` could mean anything at this point. What the person reading the code is supposed to understand is that `!f(p)` is a check to see if the current node passes the condition. If it does, stop the loop.

```js
p = p.parentNode
```

This one is pretty self-explanatory.

```js
return p
```

Due to the bad variable name, a reader can't feel 100 percent clear about what is being returned.

## Make Improvements

![Screenshot of the good version of function "traverseUpUntil"](good-code.png)

First we modify the parameter names and their order: `(el, f) =>` into `(condition, node) =>` (you can also do `condition => node =>` which adds an extra layer of useability).

You might be wondering why instead of using "element" I used "node." I used it for the following reasons:

- We are already writing code in terms of nodes, such as `.parentNode`, so why not make it consistent.
- Using node is shorter than writing element, but doesn't sacrifice any meaning. This works with all forms of nodes that have the property "parentNode," not just HTML elements.

Next, we touch up on the variable name(s).

```js
let parent = node
```

It's very important to fully elaborate the meaning of your variable within its name. For example, "p" is now "parent." You may have also noticed we aren't starting out by getting `node.parentNode`. Instead, we only get `node`.

This leads us into our next few lines.

```js
do {
  parent = parent.parentNode
} while (parent.parentNode && !condition(parent))
```

Instead of a regular `while` loop, I've opted for a `do … while` loop. This means that we only have to get the "parent" node once, as it runs the condition after the action, not the other way around. The use of the `do … while` loop also fits the rule of being able to read the code like writing.

Let's try reading it: **"Do parent equals parent's parent node while there is a parent node and the condition function doesn't return true."** While that sentence may seem a bit weird, it is more easily read as writing and helps us understand what the code means.

```js
return parent
```

While many people opt to use the generic `ret` variable (or `returnValue`), **it is not a good practice to name the variable you return "ret."** If you name your return variables appropriately, what is being returned becomes more obvious. However, sometimes functions can be long and daunting, causing the code to be more confusing. In this instance, **I would suggest splitting your function into multiple functions**, and if it's still too complicated, adding comments can help.

## Simplify the Code

Now that you've made the code readable, it's time to **take out any unnecessary code**. As I'm sure some of you have already noticed, we probably don't need the variable `parent` at all.

```js
const traverseUpUntil = (condition, node) => {
  do {
    node = node.parentNode
  } while (node.parentNode && !condition(node))

  return node
}
```

What I've done is take out the first line and replace "parent" with "node." This bypasses the unnecessary step of creating "parent" and goes straight to the loop.

### But what about the variable name?

While "node" isn't the best descriptor for this variable, it's a decent one. But let's not settle for decent, let's rename it. How about "currentNode"?

```js
const traverseUpUntil = (condition, currentNode) => {
  do {
    currentNode = currentNode.parentNode
  } while (currentNode.parentNode && !condition(currentNode))

  return currentNode
}
```

That's better! Now when we read it we know that no matter what, `currentNode` will always represent the node we are currently at instead of it just being some node.
