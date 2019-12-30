<template>
  <div>
    <app-header
      home-button
      :title="tag.name"
      :description="tag.description"
      :cover="tag.feature_image"
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
import { PostOrPage, Tag } from '@tryghost/content-api'
import PostsGroupedByYearWrapper from '~/components/PostsGroupedByYearWrapper.vue'
import AppHeader from '~/components/AppHeader.vue'

@Component({
  components: {
    PostsGroupedByYearWrapper,
    AppHeader
  },
  async asyncData({ app: { $axios }, $payloadURL, route, error }) {
    if (process.static && process.client && $payloadURL) {
      const res = await $axios.$get($payloadURL(route))
      return res
    } else {
      const [postsWrapper, tagsWrapper] = await Promise.all([
        $axios.$get(`/posts`),
        $axios.$get(`/tags`)
      ])
      const posts: PostOrPage[] = postsWrapper.posts
      const tags: Tag[] = tagsWrapper.tags
      const tag = tags.find((tag) => tag.slug === route.params.tag)
      if (!tag) return error({ statusCode: 404 })
      return {
        posts: posts.filter((post) =>
          post.tags?.some((postTag) => postTag.slug === tag.slug)
        ),
        tag
      }
    }
  }
})
export default class TagPage extends Vue {
  tag!: Tag
  posts!: PostOrPage[]
  head() {
    const meta: object[] = [
      {
        hid: 'description',
        property: 'description',
        content: this.tag.description
      },
      ...this.$createBaseMetadata(this.tag)
    ]
    return {
      title: this.tag.meta_title || this.tag.name,
      meta
    }
  }
}
</script>
