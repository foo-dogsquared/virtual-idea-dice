<template>
  <header>
    <h1>{{ appConstants.appName }}</h1>
    <nav>
      <div></div>
    </nav>
  </header>
</template>

<script>
import * as appConstants from '../appConstants'

export default {
  name: 'Header',
  computed: {
    appConstants: function () {
      return appConstants
    }
  }
}
</script>

<style lang="scss">
header {
  @apply flex flex-row w-full bg-grey-dark p-4 text-white;
}
</style>
