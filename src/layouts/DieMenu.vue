<template>
  <div class="die-menu">
    <div class="dice">
      <Carousel :perPage="1"
      :centerMode="true"
      :paginationColor="colors['brand-color-light']"
      :paginationActiveColor="colors['brand-color-dark']"
      paginationPosition="bottom"
      :paginationSize="20"
      @page-change="setCurrentPage"
      >
        <Slide v-for="die in dice"
        :key="die.id">
          <DieComponent
            :die="die"
            :draggableOptions="dieDragOptions"
            @remove-die="removeDie"
          >
          </DieComponent>
        </Slide>
      </Carousel>
    </div>
    <GenerateIdeaLayout
    :dice="dice"
    :isIdeaSaved="isIdeaSaved"
    :results="ideas"
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
      showHelp: false,
      currentPage: 0
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
    addDie: function (die = undefined, index = undefined) {
      let _index = null

      if (typeof index === 'number' && index >= 0) {
        _index = index
      } else {
        _index = this.dice.length
      }

      if (die && die instanceof appConstants.Die) {
        this.dice.splice(_index, 0, die)
      } else {
        this.dice.splice(_index, 0, new appConstants.Die())
      }
    },

    /**
    * @function removeDie - removes the die passed as the parameter
    *                       and pass it to the removed die stack
    *
    * @param dieObject - the die to be removed
    *                    or a number representing the position from the
    *                    dice carousel/menu
    **/
    removeDie: function (dieObject) {
      const _dieObject = {}
      if (dieObject instanceof appConstants.Die) {
        _dieObject['index'] = this.dice.indexOf(dieObject)
        _dieObject['die'] = this.dice.splice(_dieObject['index'], 1)[0]
      } else if (typeof dieObject === 'number') {
        _dieObject['index'] = dieObject
        _dieObject['die'] = this.dice.splice(dieObject, 1)[0]
      }

      if (!_dieObject) { return }

      if (this.dieStack.length > 20) {
        this.dieStack.shift(_dieObject)
      }

      this.dieStack.push(_dieObject)
    },

    /**
     * @function undoRemoveDie - simply gets the most recent deleted die
     *                           and adds it back to the dice list
     */
    undoRemoveDie: function () {
      const mostRecentDie = this.dieStack.pop()
      if (mostRecentDie && mostRecentDie['die'] instanceof appConstants.Die) {
        this.addDie(mostRecentDie['die'], mostRecentDie['index'])
      }
    },

    /**
     * @function setSampleSet - for now, simply sets Atomic Shrimp's Invention Dice set;
     *                          I probably make it as a basis for multiple dice set feature
     *                          without relying on multiple JSON dice set files
     */
    setSampleSet: function () {
      this.dice = appConstants.atomicShrimpSampleDiceSet
    },

    /**
     * @function setCurrentPage - sets the currentPage emitted from the carousel;
     *                            this is mainly for managing dice with keyboard shortcuts
     */
    setCurrentPage: function (pageNumber) {
      this.currentPage = pageNumber
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

        const dieResult = die.items[Math.floor(Math.random() * die.items.length)]

        const ideaShard = new appConstants.IdeaShard(dieResult, die)

        ideasArray.push(ideaShard)
      })

      this.ideas = ideasArray
    },
    clearGeneratedIdea: function () {
      this.ideas = []
    },
    addIdea: function () {
      if (this.ideas.shards.length < 2) return

      this.savedIdeas.push(this.ideas)
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
      return appConstants.colors
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
        } else if (event.key === 'D' || event.key === 'd') {
          event.preventDefault()
          this.removeDie(this.currentPage)
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

      // prevents entering a newline in any of the input since it is
      // not allowed (I mean, it doesn't make sense to have a name with a
      // newline)
      if (event.target.tagName === 'TEXTAREA') {
        if (event.key === 'Enter') {
          event.target.blur()
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
