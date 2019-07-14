<template>
  <div class="ideas">
    <div v-if="savedIdeas.length <= 0">
      <h1>You don't have any saved idea sets yet.</h1>
      <div>Go ahead to the <router-link :to="appConstants.routes.app.path">app</router-link> itself, generate an idea set, and save it. You'll see it here.</div>
    </div>
    <div v-else class="previous-ideas-container">
      <h1>Your saved idea sets</h1>
      <p>Here is where your idea sets are saved in case you found some interesting insights on an idea and you don't want to lose it.</p>
          <div class="idea-container" v-for="idea in savedIdeas" :key="idea.id">
            <input class="idea-set-name" v-model="idea.name" maxlength="64" @blur="idea.trimExtraCharacters()">

            <Draggable element="ul" class="previous-idea" :options="previousIdeaDragOptions">
                <li class="idea-shard" v-for="shard of idea.shards"
                :key="shard.shardId" v-text="shard.shardName"
                v-tooltip="{ content: shard.dieName, trigger: 'hover click', autoHide: false }"></li>
            </Draggable>
            <button v-tooltip="'Remove idea set result'" class="idea-set-remove-button" @click="$emit('remove-idea', idea)">
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 21h-17l-7-7.972 7-8.028h17v16zm-16.09-14l-5.252 6.023 5.247 5.977h14.095v-12h-14.09zm6.09 4.586l2.586-2.586 1.414 1.414-2.586 2.586 2.586 2.586-1.414 1.414-2.586-2.586-2.586 2.586-1.414-1.414 2.586-2.586-2.586-2.586 1.414-1.414 2.586 2.586z"/></svg>
            </button>
          </div>
    </div>
  </div>
</template>

<script>
import * as Draggable from 'vuedraggable'
import * as appConstants from '../constants'
import { VTooltip } from 'v-tooltip'

export default {
  name: 'SavedIdeasLayout',
  props: {
    savedIdeas: {
      type: Array,
      required: true
    }
  },
  components: {
    Draggable
    // TODO: Make carousel of the saved ideas
    // Carousel,
    // Slide
  },
  computed: {
    previousIdeaDragOptions: function () {
      return {
        animation: 500,
        group: 'saved-ideas'
      }
    },
    appConstants: function () {
      return appConstants
    }
  },
  directives: {
    'set-edit': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    },
    'tooltip': VTooltip
  }
}
</script>

<style lang="scss">
.previous-ideas-container {@apply flex flex-col;}

.idea-container {
  @apply bg-transparent;
  @apply border-brand-color-dark border-2 rounded-lg;
  @apply fill-current text-brand-color-dark;
  @apply relative p-4 mb-4 mt-4;
  min-height: 95%;
}

.idea-set-name {
  @apply p-2 min-h-8 w-4/5;
  @apply rounded-lg;

  &:hover {@apply bg-gray-300 cursor-pointer;}
  &:focus {@apply bg-gray-400 cursor-text;}
}

.previous-idea {
  @apply flex flex-row flex-wrap items-center justify-around;
  @apply mt-8 mb-6;
  @apply break-words;
}

.idea-shard {
  @apply bg-brand-color-1 text-white;
  @apply w-full;
  @apply p-4 m-3;
  @apply cursor-pointer break-words;
  @apply rounded-lg;
  &:hover {@apply bg-brand-color-dark;}

  @screen sm {@apply w-1/4;}

  @screen md {@apply w-1/5;}
}

.idea-set-remove-button {
  @apply rounded-tl-lg;
  @apply absolute top-0 right-0;
  @apply w-10 h-10;
  @apply border-none rounded-none rounded-bl-lg;
}
</style>
