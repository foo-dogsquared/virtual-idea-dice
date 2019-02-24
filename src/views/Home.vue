<template>
  <div class="home">
    <h1>{{ appConstants.appConfig.tagline }}</h1>
    <div>It's a tool that's all about exploration with randomly generated ideas. Is it useful? Is it not? No matter! It mainly serves as a mental exercise to stretch how far our imagination can get with a set of randomly generated words that you've given.</div>
    <div>To get started, head on over to the <router-link :to="appConstants.routes.app.path">app</router-link> and create your own set of invention dice.</div>
  </div>
</template>

<script>
import * as appConstants from '../appConstants'

export default {
  name: 'Home',
  computed: {
    appConstants: function () {
      return appConstants
    }
  }
}
</script>
