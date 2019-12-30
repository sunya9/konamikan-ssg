<template>
  <div>
    <app-header title="Archives" home-button />
    <main class="section">
      <div class="container">
        <posts-grouped-by-year-wrapper :posts="posts" />
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import PostsGroupedByYearWrapper from '~/components/PostsGroupedByYearWrapper.vue'
import AppHeader from '~/components/AppHeader.vue'
import { reducePostFieldMapper, PostOrPageLight } from '~/util/util'

@Component({
  components: {
    PostsGroupedByYearWrapper,
    AppHeader
  },
  async asyncData({ app: { $axios }, $payloadURL, route }) {
    if (process.static && process.client && $payloadURL) {
      const res = await $axios.$get($payloadURL(route))
      return res
    } else {
      const res = await $axios.$get(`/posts`)
      return {
        posts: res.posts.map(reducePostFieldMapper)
      }
    }
  }
})
export default class Archives extends Vue {
  posts!: PostOrPageLight[]
  head() {
    return {
      title: 'Archives'
    }
  }
}
</script>
