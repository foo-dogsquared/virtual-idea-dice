<template>
  <div class="save-idea-layout">
    <button v-if="generatedIdea.length > 1 && !isIdeaSaved" class="save-idea" @click="$emit('save-idea')">Save idea</button>
    <div v-if="isIdeaSaved && generatedIdea.length > 1">Your randomly generated idea setpieces has been saved!</div>
    <div v-else-if="generatedIdea.length === 1">You only have one setpiece which is not really suitable for saving. Add another die and fill up some items.</div>
    <div class="previous-ideas-container" :class="{ hidden: savedIdeas.length <= 0 }">
      <div class="idea-container" v-for="idea in savedIdeas" :key="idea.key">
        <div class="idea-set-name" :class="{ renaming: isIdeaSetEqual(idea)}">
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
        <Draggable class="previous-idea" v-model="idea.shards" :options="previousIdeaDragOptions">
          <li class="idea-shard" v-for="shard in idea.shards" :key="shard" v-text="shard"></li>
        </Draggable>
        <button class="delete-idea" @click="$emit('remove-idea', idea)">
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

export default {
  name: 'SaveIdeaLayout',
  props: {
    generatedIdea: {
      type: Array,
      required: true
    },
    isIdeaSaved: {
      type: Boolean,
      required: true
    },
    savedIdeas: {
      type: Array,
      required: true
    },
    state: {
      type: String
    },
    editingIdeaSet: {
      type: Object
    }
  },
  components: {
    Draggable
  },
  methods: {
    isIdeaSetEqual: function (ideaSet) {
      return this.state === appConstants.state.ideaSetRenaming && this.editingIdeaSet && _.isEqual(this.editingIdeaSet, ideaSet)
    }
  },
  computed: {
    previousIdeaDragOptions: function () {
      return {
        animation: 500
      }
    }
  },
  directives: {
    'set-edit': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
}
</script>

<style lang="scss">
.save-idea-layout {
  & > * {@apply m-auto;}
}

.save-idea {
  @apply p-4;
}

.delete-idea {
  @apply absolute border-none rounded-none w-10 h-10 pin-t pin-r;
}

.previous-ideas-container {@apply bg-grey-dark flex flex-col p-4 mb-4 mt-4;}

.idea-container {@apply relative;}

.idea-set-name {
  &.renaming {
   & > .idea-set-label-edit {@apply block;}
   & > .idea-set-label {@apply hidden;}
  }
}

.idea-set-label-edit {@apply hidden w-4/5;}

.previous-idea {
  @apply flex flex-row flex-wrap items-center mt-8 mb-6 list-reset break-words justify-around;
}

.idea-shard {
  @apply bg-grey w-full p-4 m-3 cursor-pointer;
  &:hover {@apply bg-grey-light;}

  @screen md {
    @apply w-1/5;
  }
}

</style>
