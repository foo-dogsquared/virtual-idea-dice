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

export const colors = {
  'brand-color-1': '#17a398',
  'brand-color-dark': '#086375',
  'brand-color-light': '#bfd7ea',
  'black-transparent': 'rgba(0, 0, 0, 0.3)'
}

export const diceStorageKey = 'virtual-idea-dice'

export const state = {
  dieRenaming: 'die-renaming',
  itemEditing: 'item-editing',
  ideaSetRenaming: 'idea-set-renaming'
}

// ID-related functions
export const NUMBER_SYSTEM = 36
export const MAXIMUM_NUMBER_OF_DIGITS = 5
export const MAXIMUM_NUMBER_OF_COMBINATIONS = Math.pow(NUMBER_SYSTEM, MAXIMUM_NUMBER_OF_DIGITS)

export function generateId () {
  const code = Number(Math.floor(Math.random() * MAXIMUM_NUMBER_OF_COMBINATIONS)).toString(NUMBER_SYSTEM)
  return code
}

export function convertToProgramNumberSystem (number) {
  if (typeof number === 'number') {
    return number.toString(NUMBER_SYSTEM)
  } else if (typeof number === 'string' && !Number(`0x${number}`)) {
    return generateId()
  }
}

export const diceStorageInstance = localforage.createInstance({
  storeName: appConfig.db.dieStoreName,
  name: diceStorageKey
})

export const ideasStorageInstance = localforage.createInstance({
  storeName: appConfig.db.ideasStoreName,
  name: diceStorageKey
})

export const MAXIMUM_NAME_LENGTH = 256
export const DIE_NAME_MAXIMUM_LENGTH = 64

export class Die {
  /**
   * A die object that holds die item that represents faces of the die.
   * @param {Object} object - a destructured object that contains the option for
   *                          building the Die
   */
  constructor ({ id = generateId(), name = id, items = [], enabled = true, locked = false } = {}) {
    this.name = String(name)
    // trimming the name if it goes over the maximum length
    this.trimExtraCharacters()

    if (typeof id === 'number') this.id = convertToProgramNumberSystem(id)
    else this.id = String(id)

    this.items = []
    for (const dieItem of items) {
      if (dieItem instanceof DieItem) {
        this.items.push(dieItem)
      } else if (dieItem instanceof Object && dieItem['name'] && dieItem['itemId']) {
        const _dieItem = new DieItem(dieItem)
        this.items.push(_dieItem)
      }
    }

    this.enabled = enabled
    this.locked = locked
  }

  addDieItem (dieItem = undefined) {
    if (!this.enabled || this.locked) return

    let _dieItem

    if (dieItem instanceof DieItem) _dieItem = dieItem
    else _dieItem = new DieItem({ die: this })

    this.items.push(_dieItem)

    return _dieItem
  }

  removeDieItem (item) {
    if (!this.enabled || this.locked) return

    const itemIndex = this.items.indexOf(item)
    this.items.splice(itemIndex, 1)
  }

  checkLockOrEnabled () {
    if (!this.enabled || this.locked) return false

    return true
  }

  toggleDisabling () {
    this.enabled = !this.enabled
  }

  toggleLock () {
    this.locked = !this.locked
  }

  trimExtraCharacters () {
    if (this.name.length > DIE_NAME_MAXIMUM_LENGTH) {
      this.name = this.name.slice(0, DIE_NAME_MAXIMUM_LENGTH)
    }

    this.name = this.name.trim()
  }
}

export const DIE_ITEM_NAME_MAX_LENGTH = 64

export class DieItem {
  /**
   * A die item is a basically like a face on the die object.
   * @param {Object} options
   */
  constructor ({ name = undefined, id = generateId(), die = undefined }) {
    if (name) {
      this.name = name
    } else if (!name && die && die instanceof Die) {
      this.name = `${die.name}-${id}`
    } else {
      this.name = 'New Die Item'
    }

    this.itemId = id
  }

  trimExtraCharacters () {
    if (this.name.length > DIE_ITEM_NAME_MAX_LENGTH) {
      this.name = this.name.slice(0, DIE_ITEM_NAME_MAX_LENGTH)
    }

    this.name = this.name.trim()
  }
}

export const IDEA_SET_NAME_MAX_LENGTH = 64

export class IdeaSet {
  /**
   * An idea set made up of the results from 'rolling of the dice set'.
   * @param {Object} options - an object that specifies options for building
   *
   */
  constructor ({ id = generateId(), name = `Idea Set #${id}`, shards = undefined } = {}) {
    this.id = id
    this.name = name
    this.shards = shards || []
  }

  /**
   * Adds an idea shard to the set.
   * @param {IdeaShard} ideaShard - the idea shard to be added
   */
  addShard (ideaShard) {
    if (!(ideaShard instanceof IdeaShard)) return
    this.shards.push(ideaShard)
  }

  trimExtraCharacters () {
    if (this.name.length > IDEA_SET_NAME_MAX_LENGTH) {
      this.name = this.name.slice(0, IDEA_SET_NAME_MAX_LENGTH)
    }

    this.name = this.name.trim()
  }
}

export class IdeaShard {
  /**
   * A constructor for idea shards that make up an idea set.
   * @param {DieItem} name - the name of the item shard/element of the set
   * @param {Die} die - the instance of a Die object where the shard came from
   */
  constructor (item, die) {
    if (!(die instanceof Die) && !(item instanceof DieItem)) return

    this.shardId = item.itemId
    this.shardName = item.name
    this.dieName = die.name
    this.dieId = die.id
  }
}

export const atomicShrimpSampleDiceSet = [
  new Die({ name: 'Power source', items: [ new DieItem({ name: 'Manual' }), new DieItem({ name: 'Electric' }), new DieItem({ name: 'Clockwork' }), new DieItem({ name: 'Solar' }), new DieItem({ name: 'Wind' }), new DieItem({ name: 'Water' }) ] }),
  new Die({ name: 'Size', items: [ new DieItem({ name: 'Giant' }), new DieItem({ name: 'Mini' }), new DieItem({ name: 'Pocket' }), new DieItem({ name: 'Portable' }), new DieItem({ name: 'Inhabitable' }), new DieItem({ name: 'Wearable' }) ] }),
  new Die({ name: 'Material', items: [ new DieItem({ name: 'Metal' }), new DieItem({ name: 'Wood' }), new DieItem({ name: 'Plastic' }), new DieItem({ name: 'Edible' }), new DieItem({ name: 'Organic' }), new DieItem({ name: 'Paper' }) ] }),
  new Die({ name: 'Device', items: [ new DieItem({ name: 'Robot' }), new DieItem({ name: 'Vehicle' }), new DieItem({ name: 'Game' }), new DieItem({ name: 'Tool' }), new DieItem({ name: 'Art' }), new DieItem({ name: 'Computer' }) ] }),
  new Die({ name: 'Scope', items: [ new DieItem({ name: 'Family' }), new DieItem({ name: 'Personal' }), new DieItem({ name: 'Office' }), new DieItem({ name: 'Industrial' }), new DieItem({ name: 'Public' }), new DieItem({ name: 'Home' }) ] }),
  new Die({ name: 'Implementation type', items: [ new DieItem({ name: 'Random' }), new DieItem({ name: 'Flying' }), new DieItem({ name: 'Underwater' }), new DieItem({ name: 'Stealth' }), new DieItem({ name: 'Disposable' }), new DieItem({ name: 'Self-build' }) ] })
]

export const diceStorage = {
  fetch: function () {
    const dice = []
    return diceStorageInstance.iterate(function (value, key, index) {
      dice.push(new Die(value))
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
      ideas.push(new IdeaSet(value))
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
      ideasStorageInstance.setItem(String(idea.id), idea)
    }
  }
}
