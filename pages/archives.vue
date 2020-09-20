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
import { PostObject } from '@tryghost/content-api'
import PostsGroupedByYearWrapper from '~/components/PostsGroupedByYearWrapper.vue'
import AppHeader from '~/components/AppHeader.vue'
import { reducePostFieldMapper, PostOrPageLight } from '~/util/util'

@Component({
  components: {
    PostsGroupedByYearWrapper,
    AppHeader
  },
  async asyncData({ $http }) {
    const res = await $http.$get<PostObject>('/resources/posts')
    return {
      posts: res.posts.map(reducePostFieldMapper)
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
