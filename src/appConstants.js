export const diceStorageKey = 'digital-invention-cubes'

export const state = {
  dieRenaming: 'die-renaming',
  itemEditing: 'item-editing'
}

export function generateId () {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}

export const appName = 'Digital Invention Cubes'
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
