# Alpine teleport
> A Vue style teleport for Alpine.js

Alpine teleport is an attempt to add Vue style [teleport](https://v3.vuejs.org/guide/teleport.html) functionality to Alpine.js.

The primary motivation behind the plugin is to create accessible dialogs and by placing them at the top level within the HTML body.

## Usage
You can either use the plugin from **CDN via the script tag** or import it as a regular package by installing it from npm.

### CDN
When using the CDN build, you must place the plugin script before the alpine core script.

```html
<!-- Teleport plugin -->
<script defer src="https://unpkg.com/alpine-teleport@1.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Npm module
Make sure to first install the package from the npm registry and then use it as follows.

```sh
npm i alpine-teleport
```

```js
import Alpine from 'alpinejs'
import teleport from 'alpine-teleport'

Alpine.plugin(teleport)
```

## x-teleport
The `x-teleport` directive accepts only one argument, ie the DOM node inside which the contents should be teleported. The DOM node should be present in the DOM at the time `x-teleport` is evaluated.

```html
<div x-data="{ username: '' }">
  <input type="text" x-model="username" />

  <template x-teleport="#teleport-container">
    <div>
      <h2> Preview </h2>
      <p x-text="username"></p>
    </div>
  </template>
</div>

<div id="teleport-container">
  <h2>Teleport container</h2>
</div>
```

- The `x-teleport` directive can only be used with a `template` tag.
- The contents within the `template` tag must be wrapped inside a single root node. In other words:
  
  ```html
  <!-- ❌ Will not work -->
  <template x-teleport="#teleport-container">
    <h2> Preview </h2>
    <p x-text="username"></p>
  </template>
  ```

  ```html
  <!-- ✅ Works like a charm -->
  <template x-teleport="#teleport-container">
    <div>
      <h2> Preview </h2>
      <p x-text="username"></p>
    </div>
  </template>
  ```

## Warnings
The following is the list of warnings raised by the `x-teleport` directive.

#### "x-teleport" can only be used with a template tag
The warning is raised when the `x-teleport` directive is used on a DOM element other than the `template` tag.

```html
<!-- ✅ Valid -->
<template x-teleport="#teleport-container">
</template>

<!-- ❌ Invalid -->
<div x-teleport="#teleport-container">
</div>
```

---

#### "x-teleport" contents must have a single root node
The warning is raised when the `x-teleport` template tag has more than one root elements. The fix is wrap all the elements inside a parent div.

```html
<!-- ✅ Valid -->
<template x-teleport="#teleport-container">
  <div>
    <h2> Preview </h2>
    <p x-text="username"></p>
  </div>
</template>

<!-- ❌ Invalid -->
<template x-teleport="#teleport-container">
  <h2> Preview </h2>
  <p x-text="username"></p>
</template>
```

---

#### "x-teleport" cannot locate the target DOM node
The warning is raised when we are not able to find a DOM node with the selector expression passed to `x-teleport`.

Make sure you are using a valid query selector, or manually verify that the DOM node with the same selector exists. `document.querySelector(yourExpression)` should we able to locate the DOM node.
