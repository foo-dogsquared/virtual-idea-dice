# virtual-invention-dice
Inspired from Atomic Shrimp's invention cube. Also serves as a simpler exercise for integrating PWA. For more information about the inspiration, you can read more about it in [this link](http://atomicshrimp.com/post/2014/01/20/Invention-Dice). There's also a video from the creator of this idea which you can see it [right here](https://www.youtube.com/watch?v=NBdVpiWUKhU).

## Demo
![Demo of the app](./docs/assets/demo.gif)

## Features of the app
- Defining your own set of virtual idea dice set (or VIDS, as I call them)
- Storing VIDS in IndexedDB (with [localforage](https://localforage.github.io/localForage/))
- Import and export of VIDS
- Saving dice results in IndexedDB (with [localforage](https://localforage.github.io/localForage/))

## Development build
If you want to open this app locally on your machine, just do the following:

- clone this repo or download the zip of this repo provided
- install all of the dependencies needed (`npm i`)
- open the app over `localhost` with `npm run serve`

Voila! It's open now! 😁

If you want to contribute or just add features that you want, take note of the following configurations:

- created with [Vue CLI](https://cli.vuejs.org/guide/) and the [official Vue router library](https://router.vuejs.org/)
- uses [Tailwind CSS](http://tailwindcss.com/) for most of the CSS
- uses [ESLint](https://github.com/eslint/eslint) and it has the [standard style guide](https://github.com/standard/standard) as the configuration
- all of the usual configurations and constants like the routes, app information, and the author are located in [`./src/appConstants.js`](./src/appConstants.js), I've made it so that I can update it easily in one place

Also, for future references:
- Node v11.3.0
- npm 6.4.1

## Todo
- Multiple virtual idea dice set (VIDS) support
