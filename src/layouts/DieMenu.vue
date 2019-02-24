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
    ></GenerateIdeaLayout>
    <SaveIdeaLayout
    :generatedIdea="ideas"
    :isIdeaSaved="isIdeaSaved"
    :savedIdeas="savedIdeas"
    :editingIdeaSet="editingideaSet"
    :state="state"
    @save-idea="addIdea"
    @remove-idea="removeIdea"
    @edit-idea-set-name="editIdeaSetName"
    @done-edit-idea-set-name="doneEditIdeaSetName"
    ></SaveIdeaLayout>
  </div>
</template>

<script>
import components from '../components'
import * as appConstants from '../appConstants'
import GenerateIdeaLayout from './GenerateIdeaLayout.vue'
import SaveIdeaLayout from './SaveIdeaLayout.vue'

export default {
  name: 'DieMenu',
  components: {
    DieComponent: components.DieComponent,
    GenerateIdeaLayout: GenerateIdeaLayout,
    SaveIdeaLayout: SaveIdeaLayout
  },
  data: function () {
    return {
      dice: [],
      editingDie: null,
      editingDieItem: null,
      editingideaSet: null,
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
    editIdeaSetName: function (ideaSet) {
      this.editingideaSet = ideaSet
      this.state = appConstants.state.ideaSetRenaming
    },
    doneEditIdeaSetName: function () {
      this.editingideaSet = null
      this.state = null
    },

    /*
    * Die-related functions
    */
    addDie: function () {
      this.dice.push(new appConstants.Die(appConstants.generateId(), `NewDie${this.dice.length + 1}`))
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
      this.savedIdeas.push({ 'id': appConstants.generateId(), 'shards': this.ideas, 'name': `Idea Set #${this.savedIdeas.length + 1}` })
      this.isIdeaSaved = true
    },
    removeIdea: function (ideaObject) {
      this.savedIdeas.splice(this.savedIdeas.indexOf(ideaObject), 1)
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
      handler: function (ideas) {
        appConstants.ideaStorage.save(ideas)
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

    appConstants.ideaStorage.fetch().then(function (ideasObject) {
      this.savedIdeas = ideasObject
    }.bind(this))
  }
}
</script>

<style lang="scss">
.die-menu {
  & > *:last-child {@apply mb-4;}
}
</style>
