<template>
  <div>
    <app-header
      home-button
      :title="tag.name"
      :description="tag.description"
      :cover="$resolveUrl(tag.feature_image)"
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
import { PostObject, Tag, TagsObject } from '@tryghost/content-api'
import PostsGroupedByYearWrapper from '~/components/PostsGroupedByYearWrapper.vue'
import AppHeader from '~/components/AppHeader.vue'
import { reducePostFieldMapper, PostOrPageLight } from '~/util/util'

@Component({
  components: {
    PostsGroupedByYearWrapper,
    AppHeader
  },
  async asyncData({ $http, route, error }) {
    const [postsWrapper, tagsWrapper] = await Promise.all([
      $http.$get<PostObject>('/resources/posts'),
      $http.$get<TagsObject>('/resources/tags')
    ])
    const posts = postsWrapper.posts
    const tags = tagsWrapper.tags
    const tag = tags.find((tag) => tag.slug === route.params.tag)
    if (!tag) return error({ statusCode: 404 })
    return {
      posts: posts
        .filter((post) =>
          post.tags?.some((postTag) => postTag.slug === tag.slug)
        )
        .map(reducePostFieldMapper),
      tag
    }
  }
})
export default class TagPage extends Vue {
  tag!: Tag
  posts!: PostOrPageLight[]
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
