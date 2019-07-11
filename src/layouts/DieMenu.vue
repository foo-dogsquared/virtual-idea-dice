<template>
  <div class="die-menu">
    <div class="dice">
      <Carousel :perPage="1"
      :centerMode="true"
      :paginationColor="colors['brand-color-light']"
      :paginationActiveColor="colors['brand-color-dark']"
      paginationPosition="bottom"
      :mouseDrag="true"
      :paginationSize="20"
      :minSwipeDistance="150"
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
import * as appConstants from '../constants'
import GenerateIdeaLayout from './GenerateIdeaLayout.vue'
import { saveAs } from 'file-saver'
import { Carousel, Slide } from 'vue-carousel'
import { theme } from '../../tailwind.config'

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
      isIdeaSaved: false,
      dieStack: [],
      showHelp: false
    }
  },
  methods: {
    /*
    * State functions
    */
    editDieName: function (die) {
      if (die.enabled) {
        this.editingDie = die
        this.state = appConstants.state.dieRenaming
      }
    },
    editDieItem: function ({ die, item }) {
      if (die.enabled) {
        this.editingDie = die
        this.editingDieItem = item
        this.state = appConstants.state.itemEditing
      }
    },
    doneEditDieItem: function () {
      this.editingItem = null
      this.editingItemCache = null
      this.state = null
    },

    /*
    * Die-related functions
    */

    /**
     * @function addDie - adds a die into the list
     *
     * @param die - an instance of the Die object; if no instance has passed it'll create a new one
     */
    addDie: function (die = undefined) {
      if (die && die instanceof appConstants.Die) {
        this.dice.push(die)
      } else {
        this.dice.push(new appConstants.Die())
      }
    },

    /**
    * @function removeDie - removes the die passed as the parameter
    *                       and pass it to the removed die stack
    *
    * @param dieObject - the die to be removed
    **/
    removeDie: function (dieObject) {
      if (this.dieStack.length > 20) {
        this.dieStack.shift()
      }

      this.dieStack.push(this.dice.splice(this.dice.indexOf(dieObject), 1)[0])
    },

    /**
     * @function undoRemoveDie - simply gets the most recent deleted die
     *                           and adds it back to the dice list
     */
    undoRemoveDie: function () {
      const mostRecentDie = this.dieStack.pop()
      if (mostRecentDie && mostRecentDie instanceof appConstants.Die) this.addDie(mostRecentDie)
    },

    /**
     * @function disableDie - disables the die; when the die is disabled, it doesn't
     *                        included into any of the counting/evaluation processes
     *                        (i.e. counting of total combinations, generating ideas)
     */
    disableDie: function (dieObject) {
      const dieIndex = this.dice.indexOf(dieObject)
      this.dice[dieIndex].enabled = !this.dice[dieIndex].enabled
    },

    /**
     * @function setSampleSet - for now, simply sets Atomic Shrimp's Invention Dice set;
     *                          I probably make it as a basis for multiple dice set feature
     *                          without relying on multiple JSON dice set files
     */
    setSampleSet: function () {
      this.dice = appConstants.atomicShrimpSampleDiceSet
    },

    /*
     * file related functions
     */
    openFilePrompt: function () {
      document.querySelector("input[type='file']#import-file-dice-form").click()
    },

    /**
     * @function importFile - simply reads the file to be imported;
     *                        it has no form of validation so it is vulnerable to
     *                        malicious inputs; use of a JSON schema validation is
     *                        considered
     */
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
      if (this.ideas.length < 2) return

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
      return theme.extend.colors
    }
  },
  created: async function () {
    appConstants.diceStorage.fetch().then(function (diceObject) {
      this.dice = diceObject
    }.bind(this))

    appConstants.ideaStorage.fetch().then(function (ideas) {
      this.savedIdeas = ideas
    }.bind(this))
  },
  mounted () {
    // a function that holds a list of keyboard shortcuts within the app page
    this._keyListener = function (event) {
      if (event.ctrlKey) {
        if (event.key === 'S' || event.key === 's') {
          event.preventDefault()
          this.addIdea()
        } else if (event.shiftKey && (event.key === 'E' || event.key === 'e')) {
          event.preventDefault()
          this.exportFile()
        } else if (event.key === 'G' || event.key === 'g' || event.key === 'Enter') {
          event.preventDefault()
          this.generateItems()
        } else if (event.shiftKey && (event.key === 'I' || event.key === 'i')) {
          event.preventDefault()
          this.openFilePrompt()
        } else if (event.key === 'Delete' || (event.key === 'D' || event.key === ('d'))) {
          event.preventDefault()
          this.clearGeneratedIdea()
        } else if (event.key === 'Z' || event.key === 'z') {
          event.preventDefault()
          this.undoRemoveDie()
        }
      }

      // Shift + <KEY> shortcuts
      if (event.shiftKey) {
        if (event.key === 'N' || event.key === 'n') {
          event.preventDefault()
          this.addDie()
        }
      }
    }

    document.addEventListener('keydown', this._keyListener.bind(this))
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this._keyListener)
  }
}
</script>

<style lang="scss">
.die-menu {
  & > *:last-child {@apply mb-4;}
}
</style>
