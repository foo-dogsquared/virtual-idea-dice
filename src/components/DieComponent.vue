<template>
  <div :class="{ renaming: isDieEqual(die) }" class="die">
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
    <Draggable class="die-items" v-model="die.items" :options="draggableOptions">
      <div v-for="item in die.items"
      :key="item.id"
      class="die-item-name"
      :class="{ editing: isDieItemEqual(die, item) }">
        <label class="die-item-label" v-text="item.name" @click="$emit('edit-die-item', {die, item})" @dblclick="removeDieItem(item)"></label>
        <div class="die-item-actions">
          <div class="die-item-actions-flex">
            <input class="item-edit"
            @keyup.esc="$emit('done-edit-die-item')"
            @keyup.enter="$emit('done-edit-die-item')"
            @keyup.delete="removeDieItem(item)"
            v-model="item.name"
            v-edit-item-focus="isDieItemEqual(die, item)"
            type="text"
            >
            <button class="die-action-button remove-die-item" @click="removeDieItem(item)">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 10h24v4h-24z"/></svg>
            </button>
          </div>
        </div>
      </div>
      <button class="die-action-button add-die-item" @click.left="addDieItem()">
        Add item
      </button>
    </Draggable>
    <button class="die-action-button remove-die" @click.left="$emit('remove-die', die)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
    </button>
  </div>
</template>

<script>
import * as _ from 'lodash'
import * as appConstants from '../appConstants'
import * as Draggable from 'vuedraggable'

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
      this.die.items.push({ itemId: appConstants.generateId(), name: `${this.die.name}-${this.die.items.length + 1}` })
    },
    removeDieItem: function (item) {
      const itemIndex = this.die.items.indexOf(item)
      this.die.items.splice(itemIndex, 1)
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
    }
  },
  components: {
    Draggable
  }
}
</script>

<style lang="scss">
input[type="text"], input[type="password"],
input[type="email"], input[type="url"] {
  @apply bg-grey-light;
}

.die {
  @apply relative max-w-md mx-auto w-full p-2 mt-2 mb-2 border-grey border-2 border-solid rounded flex flex-col items-center justify-center;
  @screen md {
    @apply w-md flex-row;
  }

  &.renaming {
    & .die-name-edit {@apply block;}
    & .die-name {@apply hidden;}
  }
}

.die-type {
  @apply w-full;
  @screen md {
    @apply w-1/3 text-left h-full;
  }
}

.die-name {
  @apply cursor-pointer;
  &:hover {@apply bg-grey-light;}
}

.die-name, .die-name-edit {@apply p-2;}

.die-name-edit {@apply hidden;}

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
    @apply w-2/3 text-left border-grey border-l-2;
  }

  @screen sm {& > * {@apply w-1/3;}}
}

.die-item-name {
  @apply w-full m-2 flex justify-center items-end;
  @screen sm {@apply w-1/3;}
  @screen md {@apply border-grey border-b-2;}
}

.die-item-actions {
  @apply hidden;

  & .item-edit {@apply w-3/4;}
  & .remove-die-item {@apply w-1/4;}
}

.die-item-actions-flex {@apply flex flex-row;}

.die-item-label {
  @apply cursor-pointer block p-1 w-full;

  &:hover {@apply bg-grey-light;}
}
</style>
