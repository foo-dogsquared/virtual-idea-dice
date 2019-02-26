<template>
  <footer>
    <div class="wrapper footer">
      <div>{{ currentDate }} © <a :href="appConstants.author.link" target="_blank">{{ appConstants.author.name }}</a></div>
      <div class="social-icons">
      <a v-for="(url, socialLink) in appConstants.author.socialLinks" :key="socialLink" :href="url" target="_blank">
        <svg class="icon">
          <use :href="'/social-icons.svg#' + socialLink" />
        </svg>
      </a>
      </div>
    </div>
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
.social-icons {
  & > * {@apply ml-3 mr-3;}
}

.icon {
  @apply fill-current stroke-current text-white w-8 h-8;

  &:hover {@apply text-grey;}
}
</style>
