<template>
  <Default id="app">
    <main class="wrapper main" name="content">
      <router-view/>
    </main>
  </Default>
</template>

<script>
import layouts from './layouts'

export default {
  name: 'app',
  components: {
    Default: layouts.Default
  }
}
</script>

<style lang="scss">
@import "./style/main.scss";

#app {
  @apply flex flex-col min-h-screen;

  & > *:nth-child(2) {@apply flex-1;}
}
</style>
