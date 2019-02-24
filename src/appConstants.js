import localforage from 'localforage'

export const appName = 'Digital Invention Dice'
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
    name: 'digital-invention-dice',
    dieStoreName: 'dice',
    ideasStoreName: 'ideas'
  },
  name: 'Digital Invention Dice',
  icon: '🎲',
  tagline: 'Explore randomly generated ideas with your mind and imagination.'
}

export const routes = {
  home: {
    path: '/',
    name: 'home'
  },
  about: {
    path: '/about',
    name: 'about'
  },
  app: {
    path: '/app',
    name: 'app'
  }
}

export const diceStorageKey = 'digital-invention-dice'

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
