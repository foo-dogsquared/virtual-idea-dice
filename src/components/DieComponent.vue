<template>
  <div :class="{ disabled: !die.enabled }" class="die">
    <input class="die-type" type="text"
    ref="dieType"
    v-model="die.name"
    @blur="die.name = die.name.length <= 0 ? die.id : die.name.trim()"
    :disabled="!die.checkLockOrEnabled()"
    >
    <div class="die-items">
      <div v-for="item in die.items"
      :key="item.id"
      class="die-item-name-container"
      ref="itemName"
      >
        <label class="die-item-name"
        v-show="!(editingItem && editingItem === item)"
        v-text="item.name"
        @click.left="setEditingItem(item)"
        >
        </label>

        <input class="die-item-name"
        v-show="editingItem === item"
        @keydown.shift.delete.exact="die.removeDieItem(item)"
        @blur="item.name.length === 0 ? die.removeDieItem(item) : ''; editingItem = null; item.trimExtraCharacters()"
        v-model="item.name"
        :disabled="!die.checkLockOrEnabled()"
        v-edit-item-focus="editingItem === item"
        >
        <button :disabled="!die.checkLockOrEnabled()" class="die-action-button remove-item-button" @click.left="die.removeDieItem(item)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 10h24v4h-24z"/></svg>
        </button>
      </div>
    </div>

    <Popover class="die-popover" popoverInnerClass="die-popover-content">
      <button class="die-popover-target">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 10.645v-2.29c-1.17-.417-1.907-.533-2.28-1.431-.373-.9.07-1.512.6-2.625l-1.618-1.619c-1.105.525-1.723.974-2.626.6-.9-.373-1.017-1.116-1.431-2.28h-2.29c-.412 1.158-.53 1.907-1.431 2.28h-.001c-.9.374-1.51-.07-2.625-.6l-1.617 1.619c.527 1.11.973 1.724.6 2.625-.375.901-1.123 1.019-2.281 1.431v2.289c1.155.412 1.907.531 2.28 1.431.376.908-.081 1.534-.6 2.625l1.618 1.619c1.107-.525 1.724-.974 2.625-.6h.001c.9.373 1.018 1.118 1.431 2.28h2.289c.412-1.158.53-1.905 1.437-2.282h.001c.894-.372 1.501.071 2.619.602l1.618-1.619c-.525-1.107-.974-1.723-.601-2.625.374-.899 1.126-1.019 2.282-1.43zm-8.5 1.689c-1.564 0-2.833-1.269-2.833-2.834s1.269-2.834 2.833-2.834 2.833 1.269 2.833 2.834-1.269 2.834-2.833 2.834zm15.5 4.205v-1.077c-.55-.196-.897-.251-1.073-.673-.176-.424.033-.711.282-1.236l-.762-.762c-.52.248-.811.458-1.235.283-.424-.175-.479-.525-.674-1.073h-1.076c-.194.545-.25.897-.674 1.073-.424.176-.711-.033-1.235-.283l-.762.762c.248.523.458.812.282 1.236-.176.424-.528.479-1.073.673v1.077c.544.193.897.25 1.073.673.177.427-.038.722-.282 1.236l.762.762c.521-.248.812-.458 1.235-.283.424.175.479.526.674 1.073h1.076c.194-.545.25-.897.676-1.074h.001c.421-.175.706.034 1.232.284l.762-.762c-.247-.521-.458-.812-.282-1.235s.529-.481 1.073-.674zm-4 .794c-.736 0-1.333-.597-1.333-1.333s.597-1.333 1.333-1.333 1.333.597 1.333 1.333-.597 1.333-1.333 1.333zm-4 3.071v-.808c-.412-.147-.673-.188-.805-.505s.024-.533.212-.927l-.572-.571c-.389.186-.607.344-.926.212s-.359-.394-.506-.805h-.807c-.146.409-.188.673-.506.805-.317.132-.533-.024-.926-.212l-.572.571c.187.393.344.609.212.927-.132.318-.396.359-.805.505v.808c.408.145.673.188.805.505.133.32-.028.542-.212.927l.572.571c.39-.186.608-.344.926-.212.318.132.359.395.506.805h.807c.146-.409.188-.673.507-.805h.001c.315-.131.529.025.924.213l.572-.571c-.186-.391-.344-.609-.212-.927s.397-.361.805-.506zm-3 .596c-.552 0-1-.447-1-1s.448-1 1-1 1 .447 1 1-.448 1-1 1z"/></svg>
      </button>

      <template slot="popover">
        <button v-tooltip="'Add a die item'" class="die-action-button" :disabled="!die.checkLockOrEnabled()" @click.left="die.addDieItem()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
        </button>
        <button :disabled="!die.checkLockOrEnabled()"
        v-tooltip="'Remove die'"
        class="die-action-button remove-die"
        @click.left="$emit('remove-die', die)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z"/></svg>
        </button>
        <button :disabled="!die.enabled" v-tooltip="(!die.locked) ? 'Lock die' : 'Unlock die'" class="die-action-button disable-die" @click.left="die.toggleLock()">
          <svg v-if="!die.locked" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-4v14h18v-14h-12z"/></svg>
        </button>
        <button :disabled="die.locked" v-tooltip="(die.enabled) ? 'Disable die' : 'Enable die'" class="die-action-button disable-die" @click.left="die.toggleDisabling()">
          <svg v-if="die.enabled" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M1.341 6.502c1.11-2.157 2.877-3.984 5.162-5.16l.766 1.848c-1.779.954-3.169 2.393-4.074 4.081l-1.854-.769zm5.93 14.302c-1.688-.904-3.126-2.294-4.08-4.074l-1.848.765c1.175 2.286 3.002 4.054 5.16 5.165l.768-1.856zm-4.845-5.921c-.584-1.932-.549-3.932.005-5.765l-1.856-.768c-.739 2.311-.782 4.852.003 7.299l1.848-.766zm5.925-14.306l.766 1.848c1.932-.583 3.933-.549 5.765.005l.77-1.855c-2.313-.74-4.853-.782-7.301.002zm8.378 2.619c1.688.905 3.126 2.294 4.079 4.073l1.848-.766c-1.176-2.285-3.002-4.052-5.159-5.163l-.768 1.856zm4.845 5.919c.584 1.933.549 3.933-.005 5.766l1.855.769c.74-2.311.782-4.853-.003-7.301l-1.847.766zm-.77 7.614c-.904 1.688-2.294 3.126-4.072 4.08l.766 1.848c2.285-1.176 4.052-3.003 5.162-5.16l-1.856-.768zm-5.92 4.845c-1.933.584-3.933.549-5.766-.005l-.77 1.856c2.312.739 4.853.782 7.301-.002l-.765-1.849z"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
        </button>
      </template>
    </Popover>

    <div class="die-status">
      <svg v-if="die.locked" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z"/></svg>
      <svg v-else-if="!die.enabled" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M1.341 6.502c1.11-2.157 2.877-3.984 5.162-5.16l.766 1.848c-1.779.954-3.169 2.393-4.074 4.081l-1.854-.769zm5.93 14.302c-1.688-.904-3.126-2.294-4.08-4.074l-1.848.765c1.175 2.286 3.002 4.054 5.16 5.165l.768-1.856zm-4.845-5.921c-.584-1.932-.549-3.932.005-5.765l-1.856-.768c-.739 2.311-.782 4.852.003 7.299l1.848-.766zm5.925-14.306l.766 1.848c1.932-.583 3.933-.549 5.765.005l.77-1.855c-2.313-.74-4.853-.782-7.301.002zm8.378 2.619c1.688.905 3.126 2.294 4.079 4.073l1.848-.766c-1.176-2.285-3.002-4.052-5.159-5.163l-.768 1.856zm4.845 5.919c.584 1.933.549 3.933-.005 5.766l1.855.769c.74-2.311.782-4.853-.003-7.301l-1.847.766zm-.77 7.614c-.904 1.688-2.294 3.126-4.072 4.08l.766 1.848c2.285-1.176 4.052-3.003 5.162-5.16l-1.856-.768zm-5.92 4.845c-1.933.584-3.933.549-5.766-.005l-.77 1.856c2.312.739 4.853.782 7.301-.002l-.765-1.849z"/></svg>
    </div>
    </div>
</template>

<script>
import * as constants from '../constants'
import { VTooltip, VPopover } from 'v-tooltip'

export default {
  name: 'DieComponent',
  components: {
    Popover: VPopover
  },
  props: {
    die: {
      type: constants.Die,
      required: true
    },
    draggableOptions: {
      type: Object
    }
  },

  // meant to be shared among all Die components
  data: function () {
    return { editingItem: null }
  },
  methods: {
    checkForInput: function (item) {
      if (item.length <= 0) {
        this.die.removeDieItem(item)
      }
    },
    setEditingItem: function (item) {
      if (this.die.locked || !this.die.enabled) return

      this.editingItem = item
    },
    checkForLabel: function (index) {
      this.$nextTick(function () {
        const container = this.$refs.itemName[index]
        const label = container.querySelector('label.die-item-name')
        const labelStyle = window.getComputedStyle(label)
        if (container.clientHeight > 60 && label.innerText.length > 20 && labelStyle.fontSize >= '18px') container.style.gridRow = 'auto / span 2'
        else container.style.gridRow = ''
      })
    },
    updateLabels: function () {
      const dieItems = this.$refs.itemName
      for (let index = 0; index < dieItems.length; index++) {
        this.checkForLabel(index)
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
  },
  mounted () {
    this.updateLabels()
  },
  updated () {
    this.updateLabels()
  }
}
</script>

<style lang="scss">
.die {
  @apply relative mx-auto min-h-48 w-full p-2 mt-2 mb-2;
  @apply border-brand-color-dark border-2 border-solid rounded;
  @apply flex flex-col items-center justify-center;

  &.disabled {
    @apply bg-gray-300 border-gray-700 text-gray-600 shadow-lg cursor-not-allowed;

    & .die-item-name {@apply border-gray-700;}
  }
}

.die-type {
  @apply underline text-xl font-bold text-center;
  @apply p-2 min-h-4 w-4/5 max-w-4/5;

  &:disabled {@apply cursor-not-allowed;}

  @screen md {@apply w-full;}
  @screen xs {@apply mb-4;}
}

.die-items {
  @apply w-full;

  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-auto-rows: minmax(70px, auto);
  grid-auto-flow: row dense;
}

.die-item-name-container {
  @apply m-2 flex justify-center items-end;

  & .die-item-name {
    @apply border-brand-color-dark border-b-2 rounded-l-lg;
    @apply min-h-4 h-full max-w-4/5 w-full overflow-hidden;
    @apply p-2;
    @apply cursor-pointer block break-words resize-none;

    // transition: .2s;
    &:disabled { @apply text-gray-600; }
    &:hover { @apply bg-gray-300; }
    &:focus { @apply bg-gray-400; }
  }

  & .remove-item-button {@apply rounded-r-lg;}
}

.die-item-actions-flex {@apply flex flex-row;}

.add-die-item {
  @apply p-1 max-h-1/2 my-auto;
}

.die-action-button {
  @apply rounded-none border-none;
  @apply bg-brand-color-1 fill-current text-white;
  @apply h-full;
  &:hover {@apply bg-brand-color-dark;}

  // &.remove-die {@apply absolute h-8 w-8 top-0 right-0;}
  // &.disable-die {@apply absolute h-8 w-8 right-0; top: 2.25rem;}
}

.die-popover {
  @apply text-black absolute top-0 right-0;

  .die-popover-target {
    @apply p-1;
    @apply rounded-none rounded-bl-lg border-none;
    @apply text-white;
  }
}

.die-popover-content {
  @apply bg-gray-700 shadow-lg rounded-lg;
  @apply p-3;

  & > div > * {@apply mb-2; }

  & > div {
    @apply flex flex-col flex-wrap;
  }
}

.die-status {
  @apply p-1;
  @apply absolute top-0 left-0;
  @apply text-brand-color-dark;
}
</style>
