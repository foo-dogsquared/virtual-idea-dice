<template>
  <header>
    <div class="wrapper header">
      <div class="app-name-header">
      <svg class="app-icon">
          <use href="/icon.svg#icon" />
      </svg>
      <h1>{{ appConstants.appName }}</h1>
      </div>
      <nav>
      </nav>
    </div>
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
  @apply w-full bg-grey-dark p-4 mx-auto text-white;
}

.app-name-header {
  @apply flex flex-row items-center;
}

.app-icon {
  @apply w-12 h-12 fill-current text-white mr-4;
}
</style>
