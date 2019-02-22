<template>
  <div id="app">
    <Header></Header>
    <DieMenu></DieMenu>
    <Footer></Footer>
  </div>
</template>

<script>
import DieMenu from './layouts/DieMenu.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'app',
  components: {
    DieMenu,
    Header,
    Footer
  }
}
</script>

<style lang="scss">
@import "./style/main.scss";

#app {@apply flex flex-col min-h-screen;}

.die-menu {@apply flex-1;}

</style>
