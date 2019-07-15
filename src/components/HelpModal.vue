<template>
  <modal name="help-modal" :adaptive="true" :width="800" height="auto" :scrollable="true" classes="modal">
    <header class="modal-header">
      <slot name="header">Help</slot>
      <button class="modal-close-button" @click.left="$modal.hide('help-modal')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/></svg>
      </button>
    </header>
    <aside class="modal-description">
      <slot name="description">Default Description</slot>
    </aside>
  </modal>
</template>

<script>
export default {
  name: 'HelpModal'
}
</script>

<style lang="scss">

</style>
