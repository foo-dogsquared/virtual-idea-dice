<template>
    <div>
        <DieComponent v-for="die in dice"
            :key="die.id"
            :die="die"
            :editingDie="editingDie"
            :editingDieItem="editingDieItem"
            @die-item-context="$refs.dieItemContextMenu.open($event, $event)"
            @edit-die-name="editDieName"
            @edit-die-item="editDieItem"
            @cancel-edit-die-item="cancelEditDieItem"
            @remove-die="removeDie"
        >
        </DieComponent>
        <button class="die-action-button add-die" @click="addDie">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
        </button>
        <VueContext ref="dieItemContextMenu" v-slot="item">
            <ul>
                <li>Hello {{ item.data }}</li>
            </ul>
        </VueContext>
    </div>
</template>

<script>
import DieComponent from '../components/DieComponent.vue'
import { VueContext } from 'vue-context'

const diceStorageKey = 'digital-invention-cubes'
const diceStorage = {
  fetch: function () {
    return JSON.parse(localStorage.getItem(diceStorageKey))
  },
  save: function (dice) {
    localStorage.setItem(diceStorageKey, dice)
  }
}

export default {
  name: 'DieMenu',
  components: {
    DieComponent,
    VueContext
  },
  data: function () {
    return {
      dice: diceStorage.fetch() || [],
      editingDie: null,
      editingDieItem: null
    }
  },
  methods: {
    editDieName: function (die) {
      this.editingDie = die
    },
    editDieItem: function (die, item) {
      console.log(die, item)
      this.editingDie = die
      this.editingDieItem = item
    },
    doneEditDieItem: function (itemName) {
      this.editingItem = null
      this.editingItemCache = null
    },
    cancelEditDieItem: function () {
      this.editingItem = null
      this.editingItemCache = null
    },
    addDie: function () {
      this.dice.push({ name: `NewDie${this.dice.length + 1}`, id: this.dice.length + 1, items: [ ] })
    },
    /**
      @function removeDie

      @param
    **/
    removeDie: function (dieObject) {
      this.dice.splice(this.dice.indexOf(dieObject), 1)
    }
  },
  watch: {
    dice: {
      handler: function (dice) {
        diceStorage.save(JSON.stringify(dice))
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.die-action-button {
  @apply flex items-center justify-center cursor-pointer bg-grey;

  &:hover {@apply bg-grey-dark;}

  &.remove-die {@apply absolute h-8 w-8 pin-t pin-r;}
  &.add-die-item {
    @apply bg-transparent rounded-full border-2 border-grey;

    &:hover {@apply bg-grey-darker text-white;}
  }
}
</style>
