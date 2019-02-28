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
      <button class="add-die" @click="$emit('add-die')">Add an empty die</button>
      <button :class="{disabled: totalCombinations <= 1}" :disabled="totalCombinations <= 1" class="generate-idea" @click="$emit('generate-idea')">Generate idea</button>
      <button :class="{disabled: ideas.length <= 0}" :disabled="ideas.length <= 0" class="clear-idea" @click="$emit('clear-idea')">Clear idea</button>
    </div>

    <!-- Idea set result -->
    <Draggable :noTransitionOnDrag="true" class="idea-result" :options="ideaDragOptions" :class="{ hidden: ideas.length <= 0 }">
      <span v-for="idea in ideas" :key="idea.id" v-text="idea.name" class="idea"></span>
    </Draggable>

    <!-- Save idea layout -->
    <div class="save-idea-layout">
      <button v-if="ideas.length > 1 && !isIdeaSaved" class="save-idea" @click="$emit('save-idea')">Save idea</button>
      <div v-if="isIdeaSaved">Your randomly generated idea setpieces has been saved! Head on over to the <router-link :to="appConstants.routes.ideas.path">ideas page</router-link> to see your idea sets that you've saved.</div>
      <div v-else-if="ideas.length === 1">You only have one setpiece which is not really suitable for saving. Add another die and fill up some items.</div>
    </div>
  </div>
</template>

<script>
import * as Draggable from 'vuedraggable'
import * as appConstants from '../appConstants'

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
    ideas: {
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
  components: {
    Draggable
  }
}
</script>

<style lang="scss">
.generate-idea-layout {
  @apply mt-4 mb-4;
  & > * {@apply ml-auto mr-auto mb-4 mt-4;}
}

.action-buttons {
  @apply flex flex-col justify-around;
  & > button {@apply m-4 p-4;}
  @screen sm {@apply flex-row;}
}

.die-combinations-stats {@apply text-center;}

.idea-result {
  @apply bg-brand-color-dark flex flex-row flex-wrap items-center justify-center mt-4 mb-4 p-3;
}

.idea {
  @apply w-full m-3 p-3 border-dashed border-grey bg-brand-color-light cursor-pointer break-words;
  @screen md {
    @apply w-1/4;
  }

  &:hover {@apply bg-grey-lightest;}
}

.save-idea-layout {
  & > * {@apply m-auto;}
}

.save-idea {@apply p-4;}

.delete-idea {@apply absolute border-none rounded-none w-10 h-10 pin-t pin-r;}
</style>
