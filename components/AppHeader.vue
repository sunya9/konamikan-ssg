<template>
  <header key="header">
    <div
      class="hero is-medium fix-background"
      :style="{
        'background-image': `url(${cover || defaultCover})`
      }"
    >
      <div class="hero-head">
        <nav-bar :home-button="homeButton" />
      </div>
      <div class="hero-body fix-z-index">
        <slot>
          <div class="container has-text-centered">
            <h1 class="title is-1 has-text-white">
              {{ title }}
            </h1>
            <h2 class="subtitle has-text-white-bis">
              {{ description }}
            </h2>
          </div>
        </slot>
      </div>
      <div v-if="$slots.footer" class="hero-foot">
        <slot name="footer" />
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import NavBar from '~/components/NavBar.vue'

@Component({
  components: {
    NavBar
  }
})
export default class Header extends Vue {
  @Prop({ type: String, required: false, default: '' })
  cover!: string

  @Prop({ type: String, required: false, default: '' })
  title!: string

  @Prop({ type: String, required: false, default: '' })
  description!: string

  @Prop({ type: Boolean, required: false, default: false })
  homeButton!: boolean

  defaultCover = this.$resolveUrl(this.$setting.cover_image)

  get isIndex(): boolean {
    return this.$route.name === 'index'
  }
}
</script>
<style scoped>
.fix-background {
  background-position: center;
  background-size: cover;
  position: relative;
}
.fix-background::after {
  content: '';
  display: block;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  backdrop-filter: blur(4px);
}
.fix-z-index {
  z-index: 2;
}
</style>
