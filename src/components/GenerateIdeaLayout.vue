<template>
  <div class="generate-idea-layout">
    <button class="die-action-button add-die" @click="$emit('add-die')">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
    </button>
    <button class="generate-idea" @click="$emit('generate-idea')">Generate idea</button>
    <div v-if="dice.length <= 0">You don't have any dice yet. Click the '+' to add a die and name the items that you want to be included.</div>
    <Draggable class="idea-result" :options="ideaDragOptions" :class="{ hidden: ideas.length <= 0 }">
      <span v-for="idea in ideas" :key="idea" v-text="idea" class="idea"></span>
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
    }
  },
  components: {
    Draggable
  }
}
</script>

<style lang="scss">
.generate-idea-layout {
  & > * {@apply m-auto;}
}

.generate-idea {@apply p-4;}

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
