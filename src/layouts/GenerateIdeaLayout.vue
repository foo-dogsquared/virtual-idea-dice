<template>
  <div class="generate-idea-layout">
    <div class="die-combinations-stats" v-if="totalNumberOfDice > 0">
      <div>A total of </div>
      <h1>{{ totalCombinations }} {{ (totalCombinations > 1) ? 'combinations' : 'combination'}}</h1>
      <div> with </div>
      <h1>{{ totalNumberOfDice }} {{ (totalNumberOfDice > 1) ? 'dice' : 'die' }}</h1>
      <h2 v-if="totalNumberOfEmptyDice > 0">(with {{ totalNumberOfEmptyDice }} empty dice)</h2>
    </div>
    <div class="die-combinations-stats" v-else-if="dice.length > 0 && dice.length === totalNumberOfEmptyDice">
      <h1>Seems like all of the dice is empty.</h1>
      <div>Add some items on all of the dice. Then press the 'Generate Idea' button and let your imagination free. 🙂</div>
    </div>
    <div v-else class="die-combinations-stats">
      <h1>No die. No try. 😁</h1>
      <div v-if="dice.length <= 0">You don't have any dice yet. Add a die and name the items that you want to be included.</div>
    </div>
    <div class="action-buttons">
      <button class="add-die" @click="$emit('add-die')">Add an empty die</button>
      <button :class="{disabled: totalCombinations <= 1}" :disabled="totalCombinations <= 1" class="generate-idea" @click="$emit('generate-idea')">Generate idea</button>
      <button :class="{disabled: ideas.length <= 0}" :disabled="ideas.length <= 0" class="clear-idea" @click="$emit('clear-idea')">Clear idea</button>
    </div>
    <Draggable class="idea-result" :options="ideaDragOptions" :class="{ hidden: ideas.length <= 0 }">
      <span v-for="idea in ideas" :key="idea.id" v-text="idea.name" class="idea"></span>
    </Draggable>
  </div>
</template>

<script>
import * as Draggable from 'vuedraggable'

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
    totalNumberOfEmptyDice: function () {
      let total = 0
      for (const die of this.dice) {
        if (!die.enabled) continue
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
  & > * {@apply m-4}
  @screen sm {@apply flex-row;}
}

.die-combinations-stats {@apply text-center;}

.generate-idea, .add-die, .clear-idea {@apply p-4;}

.idea-result {
  @apply bg-grey flex flex-row flex-wrap items-center justify-center mt-4 mb-4 p-3;

  & > .idea {
    @apply w-full m-3 p-3 border-dashed border-grey bg-grey-light cursor-pointer;
    @screen md {
      @apply w-1/4;
    }

    &:hover {@apply bg-grey-lightest;}
  }
}
</style>
