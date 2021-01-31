<template>
  <div>
    <app-header
      title="Archives"
      home-button
      description="過去の記事はこちらから。"
    />
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
import { PostOrPage } from '@tryghost/content-api'
import PostsGroupedByYearWrapper from '~/components/PostsGroupedByYearWrapper.vue'
import AppHeader from '~/components/AppHeader.vue'
import { reducePostFieldMapper, PostOrPageLight } from '~/util/util'

@Component({
  components: {
    PostsGroupedByYearWrapper,
    AppHeader
  },
  async asyncData({ $http }) {
    const posts = await $http.$get<PostOrPage[]>('/resources/posts')
    return {
      posts: posts.map(reducePostFieldMapper)
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
