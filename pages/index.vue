<template>
  <div>
    <app-header :title="title" :description="description" />
    <main class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div v-for="post in posts" :key="post.uuid" class="column is-4">
            <post-card :post="post" class="fix-height" />
          </div>
        </div>
        <nuxt-link
          to="/archives"
          class="button is-fullwidth is-rounded is-outlined is-text"
        >
          Archives
        </nuxt-link>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { PostOrPage, PostObject } from '@tryghost/content-api'
import { Component, Vue } from 'nuxt-property-decorator'
import PostCard from '~/components/PostCard.vue'
import AppHeader from '~/components/AppHeader.vue'
import { reducePostFieldMapper } from '~/util/util'

@Component({
  components: {
    PostCard,
    AppHeader
  },
  async asyncData({ app: { $axios }, $payloadURL, route }) {
    if (process.static && process.client && $payloadURL) {
      const res = await $axios.$get($payloadURL(route))
      return res
    } else {
      const posts: PostObject = await $axios.$get('/posts')
      return {
        posts: posts.posts.slice(0, 9).map(reducePostFieldMapper)
      }
    }
  }
})
export default class Index extends Vue {
  posts!: PostOrPage[]
  title = this.$setting.title
  description = this.$setting.description

  head() {
    return {
      titleTemplate: null
    }
  }
}
</script>
<style scoped>
.fix-height {
  height: 100%;
}
</style>
