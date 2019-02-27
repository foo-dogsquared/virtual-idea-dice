<template>
  <div class="feature-description">
    <svg class="feature-image">
      <use :href="img"/>
    </svg>
    <div class="feature-text">
      <h2 v-text="header"></h2>
      <p v-for="description in descriptionList"
      :key="description"
      v-html="description"
      ></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HighlightsListItem',
  props: {
    header: {
      type: String,
      required: true
    },
    descriptionList: {
      type: Array,
      required: true
    },
    img: {
      type: String
    }
  }
}
</script>
