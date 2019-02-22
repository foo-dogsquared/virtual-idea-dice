<template>
    <div class="die-menu">
      <div>
        <DieComponent v-for="die in dice"
            :key="die.id"
            :die="die"
            :editingDie="editingDie"
            :editingDieItem="editingDieItem"
            :state="state"
            @die-item-context="$refs.dieItemContextMenu.open($event, $event)"
            @edit-die-name="editDieName"
            @edit-die-item="editDieItem"
            @done-edit-die-item="doneEditDieItem"
            @remove-die="removeDie"
        >
        </DieComponent>
      </div>
      <button class="die-action-button add-die" @click="addDie">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
      </button>
      <button class="generate-idea" @click="generateIdea">Generate idea</button>
      <div v-text="generatedIdea" class="idea-result"></div>
    </div>
</template>

<script>
import DieComponent from '../components/DieComponent.vue'
import * as appConstants from '../appConstants'

const diceStorageKey = appConstants.diceStorageKey
const diceStorage = {
  fetch: function () {
    return JSON.parse(localStorage.getItem(diceStorageKey))
  },
  save: function (dice) {
    localStorage.setItem(diceStorageKey, dice)
  }
}

export default {
  name: 'DieMenu',
  components: {
    DieComponent
  },
  data: function () {
    return {
      dice: diceStorage.fetch() || [],
      editingDie: null,
      editingDieItem: null,
      state: null,
      generatedIdea: null
    }
  },
  methods: {
    editDieName: function (die) {
      this.editingDie = die
      this.state = appConstants.state.dieRenaming
    },
    editDieItem: function ({ die, item }) {
      this.editingDie = die
      this.editingDieItem = item
      this.state = appConstants.state.itemEditing
    },
    doneEditDieItem: function () {
      this.editingItem = null
      this.editingItemCache = null
      this.state = null
    },
    addDie: function () {
      this.dice.push({ name: `NewDie${this.dice.length + 1}`, id: appConstants.generateId(), items: [ ] })
    },
    /**
      @function removeDie

      @param
    **/
    removeDie: function (dieObject) {
      this.dice.splice(this.dice.indexOf(dieObject), 1)
    },
    generateIdea: function () {
      const ideas = []
      this.dice.map(function (die) {
        if (die.items.length === 0) return
        ideas.push(die.items[Math.floor(Math.random() * die.items.length)])
      })

      this.generatedIdea = ideas
    }
  },
  watch: {
    dice: {
      handler: function (dice) {
        diceStorage.save(JSON.stringify(dice))
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
button {
  @apply flex items-center justify-center cursor-pointer bg-grey;
  @apply bg-transparent rounded-full border-2 border-grey;

  &:hover {@apply bg-grey-darker text-white;}
}

.die-menu {
  & > * {@apply m-auto;}
}

.die-action-button {
  @apply rounded-none bg-grey;
  &:hover {@apply bg-grey-dark;}

  &.remove-die {@apply absolute h-8 w-8 pin-t pin-r;}
  &.add-die-item {
    @apply bg-transparent rounded-full border-2 border-grey;

    &:hover {@apply bg-grey-darker text-white;}
  }
}

.generate-idea {
  @apply p-4;
}
</style>
