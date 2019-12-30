<template>
  <div>
    <app-header
      home-button
      :title="author.name"
      :description="author.bio"
      :cover="author.cover_image"
    >
      <div class="container has-text-centered">
        <div class="media">
          <div class="media-left">
            <div class="image is-128x128">
              <img
                class="is-rounded"
                :src="author.profile_image"
                width="256"
                height="256"
              />
            </div>
          </div>
          <div class="media-content">
            <div class="content">
              <h1 class="title is-1 has-text-white">
                {{ author.name }}
              </h1>
              <h2
                v-if="author.location"
                class="subtitle has-text-white-ter is-6"
              >
                {{ author.location }}
              </h2>
              <p class="has-text-white-ter">
                {{ author.bio }}
              </p>
              <author-web
                :author="author"
                color="has-text-white"
                size="is-normal"
              />
            </div>
          </div>
        </div>
      </div>
    </app-header>
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
import { PostOrPage, Author } from '@tryghost/content-api'
import PostsGroupedByYearWrapper from '~/components/PostsGroupedByYearWrapper.vue'
import AppHeader from '~/components/AppHeader.vue'
import AuthorWeb from '~/components/AuthorWeb.vue'

@Component({
  components: {
    PostsGroupedByYearWrapper,
    AppHeader,
    AuthorWeb
  },
  async asyncData({ app: { $axios }, $payloadURL, route, error }) {
    if (process.static && process.client && $payloadURL) {
      const res = await $axios.$get($payloadURL(route))
      return res
    } else {
      const [postsWrapper, authorsWrapper] = await Promise.all([
        $axios.$get(`/posts`),
        $axios.$get(`/authors`)
      ])
      const posts: PostOrPage[] = postsWrapper.posts
      const authors: Author[] = authorsWrapper.authors
      const author = authors.find(
        (author) => author.slug === route.params.author
      )
      if (!author) return error({ statusCode: 404 })
      return {
        posts: posts.filter((post) =>
          post.authors?.some((postAuthor) => postAuthor.slug === author.slug)
        ),
        author
      }
    }
  }
})
export default class AuthorPage extends Vue {
  author!: Author
  posts!: PostOrPage[]
  head() {
    const meta: object[] = [
      {
        hid: 'description',
        property: 'description',
        content: this.author.bio
      },
      ...this.$createBaseMetadata(this.author)
    ]
    return {
      title: this.author.meta_title || this.author.name,
      meta
    }
  }
}
</script>