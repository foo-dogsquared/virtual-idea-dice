<template>
  <div class="home">
    <h1>{{ appConstants.appConfig.tagline }}</h1>
    <p>It's a tool that's all about exploration with randomly generated ideas. Is it useful? Is it not? No matter! It mainly serves as a mental exercise to stretch how far our imagination can get with a set of randomly generated words that you've given.</p>
    <p>
      This app is inspired from <a href="https://www.youtube.com/watch?v=NBdVpiWUKhU">Atomic Shrimp's Invention Dice</a> with my personal twist.
      In this case, I made the app to be fully customizable for the user in order to explore with their own set of attributes that they've put together.
    </p>
    <p>To get started, head on over to the <router-link :to="appConstants.routes.app.path">app</router-link> and create your own set of invention dice.</p>
    <p>However, I would recommend to read about some things first <router-link :to="appConstants.routes.gettingStarted.path">where this whole idea was based from</router-link> in order to get the mindset that I (and by extension, the originator) want for the user to immerse.</p>
    <p>
      On another note, this app is free and open source which its code is <a :href="appConstants.appConfig.repo">hosted on GitHub</a>.
      Feel free to contribute on it whether it's through code, issues, or criticisms! 😊
    </p>
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
