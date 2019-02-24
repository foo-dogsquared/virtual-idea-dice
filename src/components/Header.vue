<template>
  <header>
    <div class="wrapper header">
      <div class="app-name-header">
        <svg class="app-icon">
            <use href="/icon.svg#icon" />
        </svg>
        <h1>{{ appConstants.appName }}</h1>
      </div>
      <nav class="nav-links">
        <router-link v-for="route in appConstants.routes" :key="route.name" :to="route.path" v-text="route.name"></router-link>
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
.nav-links {
  & > * {@apply ml-4 mr-4;}
}

.app-name-header {
  @apply flex flex-row items-center;
}

.app-icon {
  @apply w-12 h-12 fill-current text-white mr-4;
}
</style>
