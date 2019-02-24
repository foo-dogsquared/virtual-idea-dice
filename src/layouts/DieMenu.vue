<template>
  <div class="die-menu">
    <div class="dice">
      <DieComponent v-for="die in dice"
        :key="die.id"
        :die="die"
        :editingDie="editingDie"
        :editingDieItem="editingDieItem"
        :state="state"
        :draggableOptions="dieDragOptions"
        @die-item-context="$refs.dieItemContextMenu.open($event, $event)"
        @edit-die-name="editDieName"
        @edit-die-item="editDieItem"
        @done-edit-die-item="doneEditDieItem"
        @remove-die="removeDie"
        @disable-die="disableDie"
      >
      </DieComponent>
    </div>
    <GenerateIdeaLayout
    :dice="dice"
    :isIdeaSaved="isIdeaSaved"
    :ideas="ideas"
    @add-die="addDie"
    @generate-idea="generateItems"
    @clear-idea="clearGeneratedIdea"
    @save-idea="addIdea"
    ></GenerateIdeaLayout>
  </div>
</template>

<script>
import components from '../components'
import * as appConstants from '../appConstants'
import GenerateIdeaLayout from './GenerateIdeaLayout.vue'

export default {
  name: 'DieMenu',
  components: {
    DieComponent: components.DieComponent,
    GenerateIdeaLayout: GenerateIdeaLayout
  },
  data: function () {
    return {
      dice: [],
      editingDie: null,
      editingDieItem: null,
      state: null,
      ideas: [],
      savedIdeas: [],
      isIdeaSaved: false
    }
  },
  methods: {
    /*
    * State functions
    */
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

    /*
    * Die-related functions
    */
    addDie: function () {
      const newDieId = appConstants.generateId()
      this.dice.push(new appConstants.Die(newDieId, `NewDie${newDieId}`))
    },
    /**
      @function removeDie

      @param
    **/
    removeDie: function (dieObject) {
      this.dice.splice(this.dice.indexOf(dieObject), 1)
    },
    disableDie: function (dieObject) {
      const dieIndex = this.dice.indexOf(dieObject)
      this.dice[dieIndex].enabled = !this.dice[dieIndex].enabled
    },

    /*
    * Idea-related functions
    */
    generateItems: function () {
      if (this.ideas === null) return null

      this.isIdeaSaved = false
      const ideasArray = []
      this.dice.map(function (die) {
        if (die.items.length === 0) return
        if (!die.enabled) return
        ideasArray.push(die.items[Math.floor(Math.random() * die.items.length)])
      })

      this.ideas = ideasArray
    },
    clearGeneratedIdea: function () {
      this.ideas = []
    },
    addIdea: function () {
      const newIdeaSetId = appConstants.generateId()
      this.savedIdeas.push({ 'id': newIdeaSetId, 'shards': this.ideas, 'name': `Idea Set #${newIdeaSetId}` })
      this.isIdeaSaved = true
    }
  },
  watch: {
    dice: {
      handler: function (dice) {
        appConstants.diceStorage.save(dice)
      },
      deep: true
    },

    savedIdeas: {
      handler: function (ideaSet) {
        appConstants.ideaStorage.save(ideaSet)
      },
      deep: true
    }
  },
  computed: {
    dieDragOptions: function () {
      return {
        animation: 500,
        group: 'die-items'
      }
    }
  },
  created: async function () {
    appConstants.diceStorage.fetch().then(function (diceObject) {
      this.dice = diceObject
    }.bind(this))
  }
}
</script>

<style lang="scss">
.die-menu {
  & > *:last-child {@apply mb-4;}
}
</style>
