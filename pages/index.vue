<template>
  <div>
    <app-header :title="title" :description="description" />
    <main class="section">
      <div class="container">
        <div class="content">
          <h2>Recent posts</h2>
          <ul>
            <li v-for="post in posts" :key="post.id">
              <nuxt-link :to="$resolvePostUrl(post)">
                <span v-if="post.published_at" class="has-text-grey">
                  {{ $dayjs(post.published_at).format('MM/DD') }}
                </span>
                <span>{{ post.title }}</span>
              </nuxt-link>
            </li>
          </ul>
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
import { reducePostFieldMapper, PostOrPageLight } from '~/util/util'

@Component({
  components: {
    AppHeader
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
