<template>
  <div id="app">
    <DieComponent v-for="die in defaultItems"
      :key="die.name"
      :name="die.name"
      :items="die.items"
    >
    </DieComponent>
  </div>
</template>

<script>
import DieComponent from './components/DieComponent.vue'

export default {
  name: 'app',
  components: {
    DieComponent
  },
  data: function () {
    return { defaultItems: [
      {
        name: 'action',
        items: ['speak', 'sleep']
      },
      {
        name: 'material',
        items: ['wood', 'metal', 'electric boards', 'solar', 'wind']
      }
    ] }
  }
}
</script>

<style lang="scss">
@import "./style/main.scss";
</style>
