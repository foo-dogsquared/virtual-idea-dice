<template>
  <div class="die-menu">
    <div class="dice">
      <Carousel :perPage="1"
      :centerMode="true"
      :paginationColor="colors['brand-color-light']"
      :paginationActiveColor="colors['brand-color-dark']"
      paginationPosition="bottom"
      :paginationSize="20"
      :minSwipeDistance="100"
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
    @import-file="importFile"
    @export-file="exportFile"
    @lock-dice="toggleAllDiceLock"
    ></GenerateIdeaLayout>

    <button class="help-button" @click="$modal.show('help-modal')">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.601 21.5c0 1.38-1.116 2.5-2.499 2.5-1.378 0-2.499-1.12-2.499-2.5s1.121-2.5 2.499-2.5c1.383 0 2.499 1.119 2.499 2.5zm-2.42-21.5c-4.029 0-7.06 2.693-7.06 8h3.955c0-2.304.906-4.189 3.024-4.189 1.247 0 2.57.828 2.684 2.411.123 1.666-.767 2.511-1.892 3.582-2.924 2.78-2.816 4.049-2.816 7.196h3.943c0-1.452-.157-2.508 1.838-4.659 1.331-1.436 2.986-3.222 3.021-5.943.047-3.963-2.751-6.398-6.697-6.398z"/></svg>
    </button>

    <HelpModal>
      <template v-slot:description>
        <p>
          Hello and welcome to <b>Virtual Idea Dice</b>! This is an app used to create
          and play with "idea dice". It's all about exploration with your imagination.
          You can use it whether you're stuck with ideas or just want to pass the time.
        </p>

        <p>
          If you're on a computer keyboard, you can make use of keyboard shortcuts.
          Here's the following keys and their functions:
          <ul>
            <li><kbd>F1</kbd> - View the help section</li>
            <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>N</kbd> - Add a new empty die</li>
            <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd> - Add a new die item on the current die</li>
            <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd> - Lock all dice</li>
            <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>:</kbd> - Unlock all dice</li>
            <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>"</kbd> - Toggle all die locks</li>
            <li><kbd>Ctrl</kbd> + <kbd>Delete</kbd> - Delete the currently shown die</li>
            <li><kbd>Ctrl</kbd> + <kbd>Z</kbd> - Retrieve the most recent deleted die</li>
            <li><kbd>Ctrl</kbd> + <kbd>G</kbd> - Roll the dice set</li>
            <li><kbd>Ctrl</kbd> + <kbd>S</kbd> - Save the results into an idea set</li>
            <li><kbd>Ctrl</kbd> + <kbd>D</kbd> - Clear the dice results</li>
            <li><kbd>Ctrl</kbd> + <kbd>E</kbd> - Export the dice set</li>
            <li><kbd>Ctrl</kbd> + <kbd>I</kbd> - Import a dice set</li>
          </ul>
        </p>
      </template>
    </HelpModal>
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
    HelpModal: components.HelpModal,
    Carousel: Carousel,
    Slide: Slide
  },
  data: function () {
    return {
      dice: [],
      ideas: [],
      savedIdeas: [],
      isIdeaSaved: false,
      dieStack: [],
      currentPage: 0
    }
  },
  methods: {
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
        if (!dieObject.enabled) return

        _dieObject['index'] = this.dice.indexOf(dieObject)
        _dieObject['die'] = this.dice.splice(_dieObject['index'], 1)[0]
      } else if (typeof dieObject === 'number') {
        _dieObject['die'] = this.dice[dieObject]
        if (!_dieObject['die']) return
        if (!_dieObject['die'].enabled) return

        _dieObject['index'] = dieObject
        this.dice.splice(_dieObject['index'], 1)
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
      this.dieStack = []
      this.dice = Array.from(appConstants.atomicShrimpSampleDiceSet)
    },

    /**
     * @function setCurrentPage - sets the currentPage emitted from the carousel;
     *                            this is mainly for managing dice with keyboard shortcuts
     */
    setCurrentPage: function (pageNumber) {
      this.currentPage = pageNumber
    },

    /**
     * die lock functions
     */
    toggleAllDiceLock: function (type) {
      for (const die of this.dice) {
        if (type === 'toggle') die.toggleLock()
        else if (type === 'lock') die.locked = true
        else if (type === 'unlock') die.locked = false
      }
    },

    /*
     * file related functions
     */
    /**
     * @function importFile - simply reads the file to be imported;
     *                        it has no form of validation so it is vulnerable to
     *                        malicious inputs; use of a JSON schema validation is
     *                        considered
     */
    importFile: function () {
      const files = document.querySelector("input[type='file']").files
      for (const file of files) {
        const fileReader = new FileReader()
        fileReader.addEventListener('loadend', function (event) {
          const diceData = JSON.parse(event.target.result)

          if (typeof diceData === 'object' && diceData instanceof Array) {
            this.dice = []
            this.dieStack = []
            for (const die of diceData) {
              this.dice.push(new appConstants.Die(die))
            }
          }
        }.bind(this))
        fileReader.readAsText(file)
      }
    },
    exportFile: function () {
      if (this.dice.length <= 0) return

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
      if (this.ideas.length < 2) return

      const newIdeaSet = new appConstants.IdeaSet()
      for (const idea of this.ideas) {
        newIdeaSet.addShard(idea)
      }
      this.savedIdeas.push(newIdeaSet)
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
    },
    appName: function () {
      return appConstants.appName
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
        } else if (event.key === 'E' || event.key === 'e') {
          event.preventDefault()
          this.exportFile()
        } else if (event.key === 'G' || event.key === 'g') {
          event.preventDefault()
          this.generateItems()
        } else if (event.key === 'I' || event.key === 'i') {
          event.preventDefault()
          this.openFilePrompt()
        } else if (event.key === 'D' || event.key === 'd') {
          event.preventDefault()
          this.clearGeneratedIdea()
        } else if (event.key === 'Z' || event.key === 'z') {
          event.preventDefault()
          this.undoRemoveDie()
        } else if (event.key === 'Delete') {
          event.preventDefault()
          this.removeDie(this.currentPage)
        }
      }

      // Shift + <KEY> shortcuts
      if (event.shiftKey && event.ctrlKey) {
        if (event.key === 'N' || event.key === 'n') {
          event.preventDefault()
          this.addDie()
        } else if (event.key === 'M' || event.key === 'm') {
          event.preventDefault()
          this.dice[this.currentPage].addDieItem()
        } else if (event.key === 'L' || event.key === 'l') {
          event.preventDefault()
          this.toggleAllDiceLock('lock')
        } else if (event.key === ':' || event.key === ';') {
          event.preventDefault()
          this.toggleAllDiceLock('unlock')
        } else if (event.key === '\'' || event.key === '"') {
          event.preventDefault()
          this.toggleAllDiceLock('toggle')
        }
      }

      if (event.key === 'F1') {
        event.preventDefault()
        this.$modal.show('help-modal')
      }

      // setting up Enter key for input and textareas to blur when
      // pressed Enter
      if (event.key === 'Enter' && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) {
        event.target.blur()
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

.help-button {
  @apply fixed bottom-0 right-0;
  @apply opacity-50;
  @apply m-4;

  &:hover {@apply opacity-100;}
}
</style>
