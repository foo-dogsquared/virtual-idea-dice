<template>
  <div :class="{ renaming: isDieEqual(die, editingDie) }" class="die">
    <div class="die-type">
      <div class="die-name" v-text="die.name" @dblclick="$emit('edit-die-name', die)"></div>
      <input class="die-name-edit" v-model="die.name" v-edit-focus="isDieEqual(die, editingDie)">
    </div>
    <div class="die-items">
      <div v-for="item in die.items"
      :key="item.id"
      :class="{ editing: isDieItemEqual(die, item) }">
        <label class="item-name" v-text="item.name" @dblclick="$emit('edit-die-item', {die, item})"></label>
        <input class="item-edit"
        @keyup.esc="$emit('cancel-edit-die-item')"
        @keyup.enter="$emit('done-edit-die-item', {die, item})"
        @blur="$emit('cancel-edit-die-item')"
        v-model="item.name"
        v-edit-focus="item.name == editingDieItem"
        >
      </div>
      <button class="die-action-button add-die-item" @click.left="addDieItem()">
        Add item
      </button>
      <input class="add-item-input">
    </div>
    <button class="die-action-button remove-die" @click.left="$emit('remove-die', die)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 10h24v4h-24z"/></svg>
    </button>
  </div>
</template>

<script>
import * as _ from 'lodash'

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
    }
  },
  methods: {
    isDieEqual: function (die, editingDie) {
      return editingDie !== null && _.isEqual(die, editingDie)
    },
    isDieItemEqual: function (die, dieItem) {
      return (this.editingDie !== null && this.editingDieItem !== null) && _.isEqual(die, this.editingDie) && _.isEqual(dieItem, this.editingDieItem)
    },
    addDieItem: function () {
      this.die.items.push({ itemId: this.die.items.length + 1, name: `${this.die.name}-${this.die.items.length + 1}` })
    }
  },
  directives: {
    'edit-focus': function (el, binding) {
      if (binding.value) { el.focus() }
    }
  }
}
</script>

<style lang="scss">
input[type="text"], input[type="password"],
input[type="email"], input[type="url"] {
  @apply bg-grey-light;
}

.die {
  @apply relative max-w-md min-h-full mx-auto w-full p-2 mt-2 mb-2 border-grey border-2 border-solid rounded flex flex-col items-center justify-center;
  @screen md {
    @apply flex-row;
  }

  & .add-item-input {@apply hidden w-full;}
  .die-name-edit {@apply hidden;}

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

.die-items {
  @apply w-full flex flex-row flex-wrap border-grey border-l-2;
  & > * {
    @apply w-1/3 m-2 border-grey border-b-2;
  }

  & .item-edit {
    @apply bg-grey-light hidden w-full;
  }

  & .editing {
    & .item-edit {@apply block;}
    & .item-name {@apply hidden;}
  }

  @screen md {
    @apply w-2/3 text-left;
  }
}
</style>
