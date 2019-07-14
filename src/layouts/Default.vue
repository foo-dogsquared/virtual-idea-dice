<template>
  <div>
    <Header></Header>
    <slot></slot>
    <Footer></Footer>
  </div>
</template>

<script>
import components from '../components'

export default {
  name: 'Default',
  components: {
    Header: components.Header,
    Footer: components.Footer
  }
}
</script>
