<template>
  <div class="die">
    <div class="die-type">{{ name }}</div>
    <div class="die-items">
      <div class="" v-for="item in items" :key="item">
        {{ item }}
      </div>
      <button class="die-action-button add-die-item">
        Add item
      </button>
    </div>
    <button class="die-action-button hamburger-menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M1.439 16.873l-1.439 7.127 7.128-1.437 16.873-16.872-5.69-5.69-16.872 16.872zm4.702 3.848l-3.582.724.721-3.584 2.861 2.86zm15.031-15.032l-13.617 13.618-2.86-2.861 10.825-10.826 2.846 2.846 1.414-1.414-2.846-2.846 1.377-1.377 2.861 2.86z"/></svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'DieComponent',
  props: {
    name: String,
    items: Array
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.die {
  @apply relative max-w-md h-32 mx-auto w-full p-2 mt-2 mb-2 border-grey border-2 border-solid rounded flex flex-col items-center justify-center;
  @screen md {
    @apply flex-row;
  }
}

.die-type {
  @apply w-full h-full;
  @screen md {
    @apply w-1/3 text-left border-grey border-r-2;
  }
}

.die-items {
  @apply w-full flex flex-row flex-wrap;
  & > * {
    @apply w-1/3 m-2;
  }
  @screen md {
    @apply w-2/3 text-left;
  }
}

.die-action-button {
  @apply flex items-center justify-center cursor-pointer bg-grey;

  &:hover {@apply bg-grey-dark;}

  &.hamburger-menu {@apply absolute h-8 w-8 pin-t pin-r;}
  &.add-die-item {
    @apply bg-transparent rounded-full border-2 border-grey;

    &:hover {@apply bg-grey-darker text-white;}
  }
}
</style>
