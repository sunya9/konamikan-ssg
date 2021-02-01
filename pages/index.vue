<template>
  <div>
    <app-header :title="title" :description="description" />
    <main class="section">
      <div class="container">
        <div class="content">
          <h2>Recent posts</h2>
          <posts :posts="posts" />
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
import { PostOrPage } from '@tryghost/content-api'
import { Component, Vue } from 'nuxt-property-decorator'
import AppHeader from '~/components/AppHeader.vue'
import Posts from '~/components/Posts.vue'
import { reducePostFieldMapper, PostOrPageLight } from '~/util/util'

@Component({
  components: {
    AppHeader,
    Posts
  },
  async asyncData({ $http, error }) {
    try {
      const posts = await $http.$get<PostOrPage[]>('/resources/posts')
      return {
        posts: posts.slice(0, 9).map(reducePostFieldMapper)
      }
    } catch (e) {
      error({
        message: e.message
      })
    }
  }
})
export default class Index extends Vue {
  posts!: PostOrPageLight[]
  title = this.$settings.title
  description = this.$settings.description

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
