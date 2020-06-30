<template>
  <div>
    <nuxt />
    <the-footer />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import TheFooter from '~/components/TheFooter.vue'

export default Vue.extend({
  name: 'Default',
  components: { TheFooter }
})
</script>
