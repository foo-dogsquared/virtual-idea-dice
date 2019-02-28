import localforage from 'localforage'

export const appName = 'Virtual Idea Dice'
export const author = {
  name: 'Gabriel Arazas',
  alias: 'foo-dogsquared',
  link: 'https://foo-dogsquared.github.io/',
  socialLinks: {
    github: 'https://github.com/foo-dogsquared/',
    twitter: 'https://twitter.com/foo_dogsquared',
    linkedin: 'https://linkedin.com/in/gabriel-arazas'
  }
}

export const appConfig = {
  db: {
    name: 'virtual-idea-dice',
    dieStoreName: 'dice',
    ideasStoreName: 'ideas'
  },
  name: 'Virtual Idea Dice',
  icon: '🎲',
  tagline: 'Explore randomly generated ideas with your mind and imagination.',
  repo: 'https://github.com/foo-dogsquared/virtual-idea-dice'
}

export const appHighlights = [
  {
    header: `Inspired from Atomic Shrimp's Invention Dice`,
    description: [
      `This app is inspired from <a href="https://www.youtube.com/watch?v=NBdVpiWUKhU" target="_blank">Atomic Shrimp's Invention Dice</a>.`,
      `In this case, I made the app to be fully customizable for the user in order to explore with their own set of attributes that they've put together.`
    ],
    img: 'app'
  },
  {
    header: 'Create your own set of dice',
    description: [
      "It's like Lego but with dice. Want to create your idea dice set for games? Why not!",
      "What about food? Places? Programs? Hobbies? Or anything? That's your stuff to make!",
      'The only limit here is your imagination (and your categorizing skills).'
    ],
    img: 'create'
  },
  {
    header: 'Share your idea dice set',
    description: [
      `It's possible to share your virtual idea dice set (or VIDS as I like to call them) with others through exporting and importing of your VIDS.`
    ],
    img: 'share'
  },
  {
    header: 'Almost like a native mobile app',
    description: [
      `It's built with mobile-first approach so it can feel like a native mobile app (and skip the developer fees for me) which you can do by adding the app to the home screen.`,
      `Also it works entirely offline once you visited this app (which you have already done 😁). Go on and give it a try.`
    ],
    img: 'phone'
  },
  {
    header: "It's free (and open source) real software",
    description: [
      `Its code is free and open to everyone which you can view it right <a href=${appConfig.repo} target="_blank">here</a>.`,
      `Which means you can help improve this project whether by suggestions, criticisms, or code.`
    ],
    img: 'free'
  }
]

export const routes = {
  home: {
    path: '/',
    name: 'home'
  },
  gettingStarted: {
    path: '/getting-started',
    name: 'getting started'
  },
  app: {
    path: '/app',
    name: 'app'
  },
  ideas: {
    path: '/saved-ideas',
    name: 'saved ideas'
  }
}

export const diceStorageKey = 'virtual-idea-dice'

export const state = {
  dieRenaming: 'die-renaming',
  itemEditing: 'item-editing',
  ideaSetRenaming: 'idea-set-renaming'
}

export function generateId () {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}

export const diceStorageInstance = localforage.createInstance({
  storeName: appConfig.db.dieStoreName,
  name: diceStorageKey
})

export const ideasStorageInstance = localforage.createInstance({
  storeName: appConfig.db.ideasStoreName,
  name: diceStorageKey
})

export class Die {
  constructor (id, name, items = [], enabled = true) {
    this.name = name
    this.id = id
    this.items = items
    this.enabled = enabled
  }
}

export class DieItem {
  constructor (name, id = generateId()) {
    this.itemId = id
    this.name = name
  }
}

export const atomicShrimpSampleDiceSet = [
  new Die(generateId(), 'Power source', [ new DieItem('Manual'), new DieItem('Electric'), new DieItem('Clockwork'), new DieItem('Solar'), new DieItem('Wind'), new DieItem('Water') ]),
  new Die(generateId(), 'Size', [ new DieItem('Giant'), new DieItem('Mini'), new DieItem('Pocket'), new DieItem('Portable'), new DieItem('Inhabitable'), new DieItem('Wearable') ]),
  new Die(generateId(), 'Material', [ new DieItem('Metal'), new DieItem('Wood'), new DieItem('Plastic'), new DieItem('Edible'), new DieItem('Organic'), new DieItem('Paper') ]),
  new Die(generateId(), 'Device', [ new DieItem('Robot'), new DieItem('Vehicle'), new DieItem('Game'), new DieItem('Tool'), new DieItem('Art'), new DieItem('Computer') ]),
  new Die(generateId(), 'Scope', [ new DieItem('Family'), new DieItem('Personal'), new DieItem('Office'), new DieItem('Industrial'), new DieItem('Public'), new DieItem('Home') ]),
  new Die(generateId(), 'Implementation type', [ new DieItem('Random'), new DieItem('Flying'), new DieItem('Underwater'), new DieItem('Stealth'), new DieItem('Disposable'), new DieItem('Self-build') ])
]

export const diceStorage = {
  fetch: function () {
    const dice = []
    return diceStorageInstance.iterate(function (value, key, index) {
      dice.push(new Die(value.id, value.name, value.items, value.enabled))
    })
      .then(function () { return Promise.resolve(dice) })
      .catch(function (err) {
        console.error(err)
        return Promise.reject(err)
      })
  },
  save: function (dice) {
    diceStorageInstance.clear()

    for (const die of dice) {
      diceStorageInstance.setItem(String(die.id), die)
    }
  }
}

export const ideaStorage = {
  fetch: function () {
    const ideas = []
    return ideasStorageInstance.iterate(function (value, key, index) {
      ideas.push({ 'id': Number(key), 'shards': value.shards, 'name': value.name })
    })
      .then(function () {
        return Promise.resolve(ideas)
      })
      .catch(function (err) {
        return Promise.reject(err)
      })
  },
  save: function (ideas) {
    ideasStorageInstance.clear()

    for (const idea of ideas) {
      ideasStorageInstance.setItem(String(idea.id), { 'shards': idea.shards, 'name': idea.name })
    }
  }
}
