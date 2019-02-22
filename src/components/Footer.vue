<template>
  <footer>
    <div>{{ currentDate }} © {{ appConstants.author.name }}</div>
  </footer>
</template>

<script>
import * as appConstants from '../appConstants'

export default {
  name: 'Footer',
  computed: {
    appConstants: function () {
      return appConstants
    },
    currentDate: function () {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss">
footer {
  @apply flex flex-row w-full bg-grey-dark p-4 mx-auto text-white;
}
</style>
