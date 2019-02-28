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
            <div class="idea-set-name" :class="{ renaming: isIdeaSetEqual(idea) }">
              <div v-text="idea.name" class="idea-set-label" @click="$emit('edit-idea-set-name', idea)"></div>
              <input
              class="idea-set-label-edit"
              @keyup.enter="$emit('done-edit-idea-set-name')"
              @keyup.esc="$emit('done-edit-idea-set-name')"
              @blur="$emit('done-edit-idea-set-name')"
              v-set-edit="isIdeaSetEqual(idea)"
              v-model="idea.name"
              >
            </div>
            <Draggable element="ul" class="previous-idea" v-model="idea.shards" :options="previousIdeaDragOptions">
                <li class="idea-shard" v-for="shard in idea.shards" :key="shard.itemId" v-text="shard.name"></li>
            </Draggable>
            <button v-tooltip="'Remove idea set result'" class="delete-idea" @click="$emit('remove-idea', idea)">
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 21h-17l-7-7.972 7-8.028h17v16zm-16.09-14l-5.252 6.023 5.247 5.977h14.095v-12h-14.09zm6.09 4.586l2.586-2.586 1.414 1.414-2.586 2.586 2.586 2.586-1.414 1.414-2.586-2.586-2.586 2.586-1.414-1.414 2.586-2.586-2.586-2.586 1.414-1.414 2.586 2.586z"/></svg>
            </button>
          </div>
    </div>
  </div>
</template>

<script>
import * as Draggable from 'vuedraggable'
import * as _ from 'lodash'
import * as appConstants from '../appConstants'
// import { Carousel, Slide } from 'vue-carousel'
import { VTooltip } from 'v-tooltip'
import { colors } from '../../tailwind.config'

export default {
  name: 'SavedIdeasLayout',
  props: {
    savedIdeas: {
      type: Array,
      required: true
    },
    editingIdeaSet: {
      type: Object
    },
    state: {
      type: String
    }
  },
  components: {
    Draggable
    // TODO: Make carousel of the saved ideas
    // Carousel,
    // Slide
  },
  methods: {
    isIdeaSetEqual: function (ideaSet) {
      return this.state === appConstants.state.ideaSetRenaming && this.editingIdeaSet && _.isEqual(this.editingIdeaSet, ideaSet)
    }
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
    },
    colors: function () {
      return colors
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
  @apply bg-transparent border-brand-color-dark border-2 fill-current text-brand-color-dark relative p-4 mb-4 mt-4;
  min-height: 95%;
}

.idea-set-name {
  &.renaming {
   & > .idea-set-label-edit {@apply block;}
   & > .idea-set-label {@apply hidden;}
  }
}

.idea-set-label, .idea-set-label-edit {@apply p-2 min-h-8;}

.idea-set-label {
  @apply cursor-pointer w-3/4;

  &:hover {@apply bg-brand-color-1 text-white;}
}

.idea-set-label-edit {@apply hidden bg-brand-color-1 text-white w-4/5;}

.previous-idea {
  @apply flex flex-row flex-wrap items-center mt-8 mb-6 list-reset break-words justify-around;
}

.idea-shard {
  @apply bg-brand-color-1 text-white w-full p-4 m-3 cursor-pointer break-words;
  &:hover {@apply bg-brand-color-dark;}

  @screen sm {@apply w-1/4;}

  @screen md {@apply w-1/5;}
}
</style>
