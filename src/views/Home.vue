<template>
  <div class="home">
    <h1>{{ appConstants.appConfig.tagline }}</h1>
    <p>It's a tool that's all about exploration with randomly generated ideas. Is it useful? Is it not? Doesn't matter! It mainly serves as a mental exercise to stretch how far our imagination can get with a set of randomly generated words that you've given.</p>
    <div class="app-highlights">
      <HighlightsListItem
      v-for="highlights in appConstants.appHighlights"
      :key="highlights.header"
      :header="highlights.header"
      :descriptionList="highlights.description"
      :img="'/home-icons.svg#' + highlights.img">
      </HighlightsListItem>
    </div>
    <p>To get started, head on over to the <router-link :to="appConstants.routes.app.path">app</router-link> and create your own set of idea dice.</p>
    <p>However, I would recommend to read about some things first <router-link :to="appConstants.routes.gettingStarted.path">where this whole idea was based from</router-link> in order to get the mindset that I (and by extension, the originator) want for the user to immerse.</p>
  </div>
</template>

<script>
import * as appConstants from '../appConstants'
import component from '../components'

export default {
  name: 'Home',
  computed: {
    appConstants: function () {
      return appConstants
    }
  },
  components: {
    HighlightsListItem: component.HighlightsListItem
  }
}
</script>
