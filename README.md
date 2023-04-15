# Big Head Charles HTML5 PWA Game 

A development project for HTML5 game built with [Parcel](https://parceljs.org).


## Specs

### Dependencies

- Preload It
- PrismJs
- Tiny Modal

### Tools

- Parcel
- Terser
- Workbox
- Post HTML Include
- PWA Asset Generator
- RimRaf
- Sass

### Project Structure

- assets (images)
- partials (html sections)
- scripts (js)
- styles (sass)
- index.html (main file)
- manifest.json (pwa)
- service-worker.js (pwa)
- styles.scss (main style sheet)
- .parcelrc (parcel config)
- .service-worker-rc.json (workbox config)
- gitpod.yml (gitpod codespace)
- icon.png (sample icon)
- netlify.toml (netlify config)


## Quick Start

### Netlify Deployment

To get started instantly, you can one-click deploy to Netlify below (this also creates a copy of the repository in your own GitHub account), or you can click the "Use this Template" above.

[![Deploy to Netlify](./src/assets/deploy-to-netlify.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/aileen-r/parcel-html-sass-js-starter-template)

## Features

### HTML5 partials with posthtml‑include

Split your HTML pages into smaller, more manageable files with PostHTML's Include plugin for Parcel.

```html
<!-- index.html -->
<html>
  <head>
    <title>index.html</title>
  </head>
  <body>
    <include
      src="partials/header.html"
      locals='{
        "title": "Hello World"
      }'
    ></include>
  </body>
</html>
```

```html
<!-- partials/header.html -->
<header>
  <h1>{{ title }}</h1>
</header>
```

### Modern ES6 JavaScript

Use modern JavaScript syntax and features like ES6 imports without the need for additional configuration.

```js
// index.js
import helloWorld from "./scripts/helloWorld";

helloWorld();
```

```js
// scripts/helloWorld.js

const helloWorld = () => {
  console.log("Hello world 👋");
};

export default helloWorld;
```

### SASS

Use the CSS pre-processor SASS to split your CSS into separate files and use other features like [variables](https://sass-lang.com/documentation/variables) and [mixins](https://sass-lang.com/documentation/at-rules/mixin). Check out the [Parcel docs](https://v2.parceljs.org/) if you're interested in using another pre- or post-processor such as PostCSS, LESS, or Stylus. Or, have a look at [this same starter template using vanilla CSS](https://github.com/aileen-r/parcel-html-css-js-starter-template) if you'd prefer.

```scss
// styles.scss
$link-color: #ff526f;
$link-darkened-color: #ad001d;

a {
  color: $link-color;

  &:hover {
    color: $link-darkened-color;
  }
}
```

## How to run

### Development 

**Prerequisites**: You'll need [Node](https://nodejs.org) and [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed on your local computer.

Run

```
npm install
```

to install dependencies, then

`npm run start` will start a development service. Editing the scss, js and html files will trigger a compile int a *dist* folder when saved.

to start the local development server.

To build for production, run

`npm run build` will empty the *dist* folder and compile the files with compression and also build the game pwa and service worker assets
