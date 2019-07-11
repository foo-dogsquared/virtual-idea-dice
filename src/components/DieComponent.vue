<template>
  <div :class="{ renaming: isDieEqual(die), disabled: !die.enabled }" class="die">
    <div class="die-type">
      <div class="die-name" v-text="die.name" @click="$emit('edit-die-name', die)"></div>
      <input class="die-name-edit" type="text"
      v-model="die.name"
      v-edit-die-focus="isDieEqual(die)"
      @keyup.enter="$emit('done-edit-die-item')"
      @blur="$emit('done-edit-die-item')"
      @keyup.esc="$emit('done-edit-die-item')"
      >
    </div>
    <div class="die-items">
      <div v-for="item in die.items"
      :key="item.id"
      class="die-item-name"
      :class="{ editing: isDieItemEqual(die, item) }">
        <label class="die-item-label" v-text="item.name" @click="$emit('edit-die-item', {die, item})" @dblclick="removeDieItem(item)"></label>
        <input class="item-edit"
        v-show="isDieItemEqual(die, item)"
        @keydown.esc.exact="$emit('done-edit-die-item')"
        @keydown.enter.exact="$emit('done-edit-die-item')"
        @blur="$emit('done-edit-die-item')"
        @keydown.shift.delete.exact="removeDieItem(item)"
        v-model="item.name"
        v-edit-item-focus="isDieItemEqual(die, item)"
        type="text"
        >
        <button class="die-action-button remove-die-item" @click="removeDieItem(item)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 10h24v4h-24z"/></svg>
        </button>
      </div>
      <button class="add-die-item" @click.left="addDieItem()">
        Add item
      </button>
    </div>
    <button v-tooltip="'Remove die'" class="die-action-button remove-die" @click.left="$emit('remove-die', die)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
    </button>
    <button v-tooltip="(die.enabled) ? 'Disable die' : 'Enable die'" class="die-action-button disable-die" @click.left="$emit('disable-die', die)">
      <svg v-if="die.enabled" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-4v14h18v-14h-12z"/></svg>
    </button>
  </div>
</template>

<script>
import * as _ from 'lodash'
import * as appConstants from '../constants'
import { VTooltip } from 'v-tooltip'

export default {
  name: 'DieComponent',
  props: {
    die: {
      type: Object,
      required: true
    },
    editingDie: {
      type: Object
    },
    editingDieItem: {
      type: Object
    },
    state: {
      type: String
    },
    draggableOptions: {
      type: Object
    }
  },
  methods: {
    isDieEqual: function (die) {
      return this.state === appConstants.state.dieRenaming && this.editingDie !== null && _.isEqual(die, this.editingDie)
    },
    isDieItemEqual: function (die, dieItem) {
      return this.state === appConstants.state.itemEditing && (this.editingDie !== null && this.editingDieItem !== null) && (_.isEqual(die, this.editingDie) && _.isEqual(dieItem, this.editingDieItem))
    },
    addDieItem: function () {
      if (this.die.enabled) {
        const newDieItemId = appConstants.generateId()
        const newDieItem = new appConstants.DieItem(`${this.die.name}-${newDieItemId}`, newDieItemId)
        this.die.items.push(newDieItem)
        this.$emit('edit-die-item', { die: this.die, item: newDieItem })
      }
    },
    removeDieItem: function (item) {
      if (this.die.enabled) {
        const itemIndex = this.die.items.indexOf(item)
        this.die.items.splice(itemIndex, 1)
      }
    },
    // for drag events
    onMove: function ({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      return !relatedElement
    }
  },
  directives: {
    'edit-item-focus': function (el, binding) {
      if (binding.value) { el.focus() }
    },
    'edit-die-focus': function (el, binding) {
      if (binding.value) { el.focus() }
    },
    'tooltip': VTooltip
  }
}
</script>

<style lang="scss">
input[type="text"], input[type="password"],
input[type="email"], input[type="url"] {
  @apply bg-gray-300;
}

.die {
  @apply relative min-h-full mx-auto min-h-48 w-full p-2 mt-2 mb-2 border-brand-color-dark border-2 border-solid rounded flex flex-col items-center justify-center;
  @screen md {@apply flex-row min-h-24;}

  &.renaming {
    & .die-name-edit {@apply block;}
    & .die-name {@apply hidden;}
  }

  &.disabled {
    @apply bg-gray-300 border-gray-700 text-gray-600 shadow-lg cursor-not-allowed;

    button {@apply bg-gray-300 text-gray-600 border-gray-700;}

    button.die-action-button {@apply bg-gray-600 text-gray-300;}

    & .die-items {@apply border-gray-700 border-l-2;}

    & .die-item-name {@apply border-gray-700 border-b-2;}

    & .die-name {&:hover {@apply bg-gray-300;}}

    & .die-item-label {&:hover {@apply bg-gray-300;}}
  }
}

.die-type {
  @apply w-full;
  @screen md {@apply w-1/3 text-left h-full;}
  @screen xs {@apply mb-4;}
}

.die-name {
  @apply cursor-pointer w-4/5;
  &:hover {@apply bg-gray-300;}

  @screen md {@apply w-full;}
}

.die-name, .die-name-edit {@apply p-2 min-h-8;}

.die-name-edit {
  @apply hidden w-4/5 p-2;
  @screen md {@apply w-full;}
}

.die-items {
  @apply w-full flex flex-row flex-wrap;
  & > * {
    @apply w-full m-2;
  }

  & .editing {
    & .die-item-label {@apply hidden;}
    & .die-item-actions {@apply block;}
  }

  @screen md {
    @apply w-2/3 text-left border-brand-color-dark border-l-2;
  }

  @screen sm {& > * {@apply w-1/3;}}
}

.die-item-name {
  @apply   m-2 flex justify-center items-end;
  @screen sm {@apply w-1/3;}
  @screen md {@apply border-brand-color-dark border-b-2;}

  & .item-edit {@apply h-full w-3/4;}
  & .remove-die-item {@apply w-1/4 h-full;}
}

.die-item-label, .item-edit {@apply w-3/4 min-h-8 p-2;}

.die-item-actions-flex {@apply flex flex-row;}

.die-item-label {
  @apply cursor-pointer block p-1 w-3/4 break-words;

  &:hover {
    @apply bg-gray-300;
    transition: .2s;
  }
}

.add-die-item {@apply p-1 max-h-1/2 my-auto;}

.die-action-button {
  @apply rounded-none border-none bg-brand-color-1 fill-current text-white;
  &:hover {@apply bg-brand-color-dark;}

  &.remove-die {@apply absolute h-8 w-8 top-0 right-0;}
  &.disable-die {@apply absolute h-8 w-8 right-0; top: 2.25rem;}
}
</style>
