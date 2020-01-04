<template>
  <div>
    <app-header
      home-button
      :title="post.title"
      :description="post.custom_excerpt"
      :cover="post.feature_image"
    />
    <main class="section">
      <div class="container">
        <article>
          <div class="content">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div ref="content" v-html="post.html" />
          </div>
          <footer>
            <div v-if="post.tags && post.tags.length" class="tags">
              <nuxt-link
                v-for="tag in post.tags"
                :key="tag.id"
                :to="`/tag/${tag.slug}`"
                class="tag is-rounded is-medium"
              >
                {{ tag.name }}
              </nuxt-link>
            </div>
            <author-info :author="post.primary_author" />
          </footer>
        </article>
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { ChevronLeftIcon } from 'vue-feather-icons'
import { PostOrPage, PostObject } from '@tryghost/content-api'
import AppHeader from '~/components/AppHeader.vue'
import AuthorInfo from '~/components/AuthorInfo.vue'

@Component({
  layout: 'no-header',
  components: {
    ChevronLeftIcon,
    AppHeader,
    AuthorInfo
  },
  async asyncData({
    $resolvePostUrl,
    $payloadURL,
    route,
    app: { $axios },
    route: { params },
    error
  }) {
    const { yyyy, mm, dd, slug } = params
    if (process.static && process.client && $payloadURL) {
      const res = await $axios.$get($payloadURL(route))
      return res
    } else {
      const posts: PostObject = await $axios.$get(`/posts`)
      const post = posts.posts.find((post) => {
        return $resolvePostUrl(post) === `/${yyyy}/${mm}/${dd}/${slug}/`
      })
      if (!post) return error({ statusCode: 404 })
      return {
        post
      }
    }
  }
})
export default class extends Vue {
  post!: PostOrPage
  $refs!: {
    content: HTMLDivElement
  }

  $el!: HTMLDivElement

  async mounted() {
    await this.$nextTick()
    window.scrollTo({
      top: this.$el.offsetTop,
      behavior: 'smooth'
    })
    const scripts = this.$refs.content.querySelectorAll('script')
    if (!scripts) return
    Array.from(scripts).forEach((script) => {
      if (!script.parentNode) return
      const node = document.createElement('script')
      node.src = script.src
      script.parentNode.replaceChild(node, script)
    })
  }

  head() {
    const baseMeta: object[] = [
      {
        hid: 'description',
        property: 'description',
        content: this.post.custom_excerpt || this.post.excerpt
      },
      ...this.$createBaseMetadata(this.post)
    ]
    const extendedMeta = this.$createSocialMediaMeta(this.post)
    return {
      title: this.post.meta_title || this.post.title,
      meta: [...baseMeta, ...extendedMeta]
    }
  }
}
</script>
<style scoped lang="scss">
@import '~bulma/sass/utilities/all';

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
.fix-background > * {
  position: relative;
  z-index: 2;
}

/deep/ .kg-image {
  max-height: 50vh;
}
/deep/ .twitter-tweet {
  margin: auto;
}
/deep/ .kg-bookmark-card {
  font-size: $size-small;
  margin: auto;
  @include desktop {
    max-width: 80%;
  }
}
/deep/ .kg-bookmark-content {
  order: 2;
}
/deep/ .kg-bookmark-thumbnail {
  order: 1;
  img {
    height: 64px;
    max-width: 100%;
  }
  @include desktop {
    height: 128px;
  }
}
/deep/ .kg-bookmark-title {
  font-size: $size-normal;
}
/deep/ .kg-bookmark-publisher,
/deep/ .kg-bookmark-metadata {
  display: none;
}
/deep/ .kg-bookmark-description {
  display: none;
  @include desktop {
    display: block;
  }
}
/deep/ img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
/deep/ .instagram-media {
  margin: auto !important;
}
</style>
