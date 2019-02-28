<template>
  <div class="die-menu"
  @keyup.self.enter.exact="addDie"
  @keyup.self.ctrl.71.exact.prevent="clearGeneratedIdea"
  @keyup.self.ctrl.shift.69.exact.prevent="exportFile"
  @keyup.self.ctrl.shift.73.exact.prevent="importFile"
  >
    <div class="dice">
      <Carousel :perPage="1"
      :centerMode="true"
      :paginationColor="colors['brand-color-light']"
      :paginationActiveColor="colors['brand-color-dark']"
      paginationPosition="bottom"
      :mouseDrag="true"
      :paginationSize="20"
      :minSwipeDistance="100"
      >
        <Slide v-for="die in dice"
        :key="die.id">
          <DieComponent
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
        </Slide>
      </Carousel>
    </div>
    <GenerateIdeaLayout
    :dice="dice"
    :isIdeaSaved="isIdeaSaved"
    :ideas="ideas"
    @add-die="addDie"
    @generate-idea="generateItems"
    @clear-idea="clearGeneratedIdea"
    @save-idea="addIdea"
    @set-sample-set="setSampleSet"
    ></GenerateIdeaLayout>
    <div class="action-buttons">
      <button class="export-dice" :class="{disabled: dice.length <= 0}" :disabled="dice.length <= 0" @click="exportFile">Export dice</button>
      <input type="file" id="import-file-dice-form" accept="application/json" @change="importFile" hidden>
      <button class="import-file-dice-button" @click="openFilePrompt">Import dice (file)</button>
    </div>
  </div>
</template>

<script>
import components from '../components'
import * as appConstants from '../appConstants'
import GenerateIdeaLayout from './GenerateIdeaLayout.vue'
import { saveAs } from 'file-saver'
import { Carousel, Slide } from 'vue-carousel'
import { colors } from '../../tailwind.config'

export default {
  name: 'DieMenu',
  components: {
    DieComponent: components.DieComponent,
    GenerateIdeaLayout: GenerateIdeaLayout,
    Carousel: Carousel,
    Slide: Slide
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
      @function removeDie - removes the die passed as the parameter

      @param dieObject - the die to be removed
    **/
    removeDie: function (dieObject) {
      this.dice.splice(this.dice.indexOf(dieObject), 1)
    },
    disableDie: function (dieObject) {
      const dieIndex = this.dice.indexOf(dieObject)
      this.dice[dieIndex].enabled = !this.dice[dieIndex].enabled
    },
    setSampleSet: function () {
      this.dice = appConstants.atomicShrimpSampleDiceSet
    },

    /*
     * file related functions
     */
    openFilePrompt: function () {
      document.querySelector("input[type='file']#import-file-dice-form").click()
    },
    importFile: function () {
      const files = document.querySelector("input[type='file']#import-file-dice-form").files
      for (const file of files) {
        const fileReader = new FileReader()
        fileReader.addEventListener('loadend', function (event) {
          const diceData = JSON.parse(event.target.result)

          if (typeof diceData === 'object' && diceData instanceof Array) {
            this.dice = diceData
          }
        }.bind(this))
        fileReader.readAsText(file)
      }
    },
    exportFile: function () {
      appConstants.diceStorage.fetch().then(function (dice) {
        const diceBlob = new Blob([JSON.stringify(dice)], { type: 'application/json;charset=utf-8' })
        saveAs(diceBlob, 'yourDice.json')
      })
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
    },
    colors: function () {
      return colors
    }
  },
  created: async function () {
    appConstants.diceStorage.fetch().then(function (diceObject) {
      this.dice = diceObject
    }.bind(this))

    appConstants.ideaStorage.fetch().then(function (ideas) {
      this.savedIdeas = ideas
    }.bind(this))
  }
}
</script>

<style lang="scss">
.die-menu {
  & > *:last-child {@apply mb-4;}
}
</style>
