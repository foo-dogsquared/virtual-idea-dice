<template>
  <div class="generate-idea-layout">
    <!-- Dice statistics -->
    <div class="die-combinations-stats" v-if="totalNumberOfDice > 0">
      <div>A total of </div>
      <h1>{{ totalCombinations }} {{ (totalCombinations > 1) ? 'combinations' : 'combination'}}</h1>
      <div>with</div>
      <h1>{{ totalNumberOfDice }} {{ (totalNumberOfDice > 1) ? 'dice' : 'die' }}</h1>
      <h2 v-if="totalNumberOfEmptyDice > 0">(and {{ totalNumberOfEmptyDice }} empty {{ (totalNumberOfEmptyDice > 1) ? 'dice' : 'die' }})</h2>
    </div>
    <div class="die-combinations-stats" v-else-if="dice.length > 0 && dice.length === totalNumberOfAllEmptyDice">
      <h1>Seems like all of the dice is empty.</h1>
      <div>Add some items on all of the dice. Then press the 'Generate Idea' button and let your imagination free. 🙂</div>
    </div>
    <div v-else-if="dice.length <= 0" class="die-combinations-stats">
      <h1>No die. No try. 😁</h1>
      <div v-if="dice.length <= 0">
        <p>You don't have any dice yet. Add a die and name the items that you want to be included.</p>
        <p>Otherwise, you could see a <a @click="$emit('set-sample-set')">sample dice set straight from Atomic Shrimp's Invention Dice</a> (look up this <a href="https://www.youtube.com/watch?v=NBdVpiWUKhU">video</a> for reference).</p>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="action-buttons">
      <button v-tooltip="'Add an empty die'" @click="$emit('add-die')">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 51 51">
          <polygon points="45,0.5 0,0.5 0,43.5 5,43.5 5,6.5 45,6.5"/>
          <path d="M7,8.5v42h44v-42H7z M40,30.5H30v10c0,0.553-0.447,1-1,1s-1-0.447-1-1v-10H18c-0.553,0-1-0.447-1-1s0.447-1,1-1h10v-10
          c0-0.553,0.447-1,1-1s1,0.447,1,1v10h10c0.553,0,1,0.447,1,1S40.553,30.5,40,30.5z"/>
        </svg>
      </button>
      <button v-tooltip="'Generate an idea set'" :disabled="totalCombinations <= 1" @click="$emit('generate-idea')">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 455 455" style="enable-background:new 0 0 455 455;" xml:space="preserve">
        <path d="M0,0v455h455V0H0z M103.75,386.25c-19.33,0-35-15.67-35-35s15.67-35,35-35s35,15.67,35,35S123.08,386.25,103.75,386.25z
        M103.75,138.75c-19.33,0-35-15.67-35-35s15.67-35,35-35s35,15.67,35,35S123.08,138.75,103.75,138.75z M227.5,262.5
        c-19.33,0-35-15.67-35-35s15.67-35,35-35s35,15.67,35,35S246.83,262.5,227.5,262.5z M351.25,386.25c-19.33,0-35-15.67-35-35
        s15.67-35,35-35s35,15.67,35,35S370.58,386.25,351.25,386.25z M351.25,138.75c-19.33,0-35-15.67-35-35s15.67-35,35-35
        s35,15.67,35,35S370.58,138.75,351.25,138.75z"/></svg>
      </button>
      <button :disabled="dice.length <= 0" v-tooltip="'Lock all dice'" @click.left="$emit('lock-dice', 'lock')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z"/></svg>
      </button>
      <button :disabled="dice.length <= 0" v-tooltip="'Unlock all dice'" @click.left="$emit('lock-dice', 'unlock')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-4v14h18v-14h-12z"/></svg>
      </button>
      <button :disabled="dice.length <= 0" v-tooltip="'Toggle all die locks'" @click.left="$emit('lock-dice', 'toggle')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 21v3h-18v-3h18zm-13-15c0-2.206 1.795-4 4-4s4 1.794 4 4v3h2v-3c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3zm13 8v-3h-18v3h18zm0 5v-3h-18v3h18z"/></svg>
      </button>
      <button v-tooltip="'Export dice'" :disabled="dice.length <= 0" @click="$emit('export-file')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 11h5l-9 10-9-10h5v-11h8v11zm3 8v3h-14v-3h-2v5h18v-5h-2z"/></svg>
      </button>
      <button v-tooltip="'Import dice (file)'" @click="openFilePrompt">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 10h-5l9-10 9 10h-5v10h-8v-10zm11 9v3h-14v-3h-2v5h18v-5h-2z"/></svg>
      </button>
      <!-- Input element for file prompt -->
      <input type="file" id="import-file-dice-form" accept="application/json" @change="$emit('import-file')" hidden>
    </div>

    <!-- Idea set result -->
    <Draggable :noTransitionOnDrag="true" class="idea-result" :options="ideaDragOptions" :class="{ hidden: results.length <= 0 }">
      <span
      v-for="idea in results"
      :key="idea.id"
      v-text="idea.shardName"
      v-tooltip="{ content: `${idea.dieName}`, trigger: 'click hover', autoHide: false }"
      class="idea"
      ></span>
    </Draggable>

    <!-- Save idea layout -->
    <div class="idea-set-layout" v-if="results.length >= 1">
      <div class="idea-set-action">
        <button v-tooltip="'Save idea set'" v-if="results.length > 1 && !isIdeaSaved" class="save-idea" @click.left="$emit('save-idea')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.003 3h2.997v5h-2.997v-5zm8.997 1v20h-24v-24h20l4 4zm-19 5h14v-7h-14v7zm16 4h-18v9h18v-9z"/></svg>
        </button>
        <button v-tooltip="'Clear idea set'" class="clear-idea" @click.left="$emit('clear-idea')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900.5 900.5" >
          <path d="M176.415,880.5c0,11.046,8.954,20,20,20h507.67c11.046,0,20-8.954,20-20V232.487h-547.67V880.5L176.415,880.5z
            M562.75,342.766h75v436.029h-75V342.766z M412.75,342.766h75v436.029h-75V342.766z M262.75,342.766h75v436.029h-75V342.766z"/>
          <path d="M618.825,91.911V20c0-11.046-8.954-20-20-20h-297.15c-11.046,0-20,8.954-20,20v71.911v12.5v12.5H141.874
            c-11.046,0-20,8.954-20,20v50.576c0,11.045,8.954,20,20,20h34.541h547.67h34.541c11.046,0,20-8.955,20-20v-50.576
            c0-11.046-8.954-20-20-20H618.825v-12.5V91.911z M543.825,112.799h-187.15v-8.389v-12.5V75h187.15v16.911v12.5V112.799z"/>
          </svg>
        </button>
      </div>

      <div class="idea-set-status">
        <div v-if="isIdeaSaved">Your randomly generated idea setpieces has been saved! Head on over to the <router-link :to="appConstants.routes.ideas.path">ideas page</router-link> to see your idea sets that you've saved.</div>
        <div v-else-if="results.length === 1">You only have one setpiece which is not really suitable for saving. Add another die and fill up some items.</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Draggable from 'vuedraggable'
import * as appConstants from '../constants'
import { VTooltip } from 'v-tooltip'

export default {
  name: 'GenerateIdeaLayout',
  props: {
    dice: {
      type: Array,
      required: true
    },
    isIdeaSaved: {
      type: Boolean,
      required: true
    },
    results: {
      type: Array,
      required: true
    }
  },
  computed: {
    ideaDragOptions: function () {
      return {
        animation: 500,
        group: 'ideas'
      }
    },
    appConstants: function () {
      return appConstants
    },
    totalCombinations: function () {
      let total = 1
      for (const die of this.dice) {
        if (!die.enabled) continue
        total *= die.items.length || 1
      }

      return total
    },
    totalNumberOfDice: function () {
      let total = 0
      for (const die of this.dice) {
        if (!die.enabled) continue
        if (die.items.length <= 0) continue
        total++
      }

      return total
    },
    // disabled dice does not count
    totalNumberOfEmptyDice: function () {
      let total = 0
      for (const die of this.dice) {
        if (!die.enabled) continue
        if (die.items.length > 0) continue

        total++
      }
      return total
    },
    // all dice count to this one
    totalNumberOfAllEmptyDice: function () {
      let total = 0
      for (const die of this.dice) {
        if (die.items.length > 0) continue

        total++
      }
      return total
    }
  },
  methods: {
    openFilePrompt: function () {
      document.querySelector("input[type='file']#import-file-dice-form").click()
    }
  },
  components: {
    Draggable
  },
  directives: {
    'tooltip': VTooltip
  }
}
</script>

<style lang="scss">
.generate-idea-layout {
  @apply mt-4 mb-4;
  & > * {@apply ml-auto mr-auto mb-4 mt-4;}
}

.action-buttons {
  @apply flex flex-row flex-wrap justify-around;
  @apply mb-4;
  & > button {@apply m-4 p-4;}

  &::after {
    @apply h-8;
    @apply mb-4;
    @apply border-t-2 border-gray-300;
  }
}

.die-combinations-stats {@apply text-center;}

.idea-result {
  @apply bg-brand-color-dark;
  @apply flex flex-row flex-wrap items-center justify-center;
  @apply mt-4 mb-4 p-3 rounded-xl;
}

.idea {
  @apply m-3 p-3 border-dashed border-gray-700 bg-brand-color-light cursor-pointer break-words rounded-lg;

  &:hover {@apply bg-gray-300;}
}

.idea-set-layout {
  @apply flex flex-col flex-wrap;

  & .idea-set-action {
    @apply w-full;
    @apply flex flex-row flex-wrap justify-around;
    @apply mb-4;

    & button {@apply p-4;}
  }

  & > * {@apply m-auto;}
}

.save-idea {@apply p-4;}

</style>
