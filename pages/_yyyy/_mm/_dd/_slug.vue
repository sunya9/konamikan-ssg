<template>
  <div>
    <app-header
      home-button
      :title="post.title"
      :description="post.custom_excerpt"
      :cover="$resolveUrl(post.feature_image)"
    >
      <template v-slot:extra>
        <div class="container">
          <div class="level">
            <div
              v-if="post.published_at"
              class="level-item has-text-centered content"
            >
              <span class="tag is-rounded is-medium">
                {{ $dayjs(post.published_at).format('YYYY/MM/DD hh:mm:ss') }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </app-header>
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
            <nav aria-label="この記事の前後の記事">
              <ul class="columns is-vcentered is-mobile">
                <li v-if="newerPost" class="column has-text-left">
                  <nuxt-link
                    class="is-block"
                    :to="$resolvePostUrl(newerPost)"
                    aria-label="新しい記事"
                  >
                    <div class="vertical-center">
                      <span class="icon">
                        <chevron-left-icon />
                      </span>
                      <span>{{ newerPost.title }}</span>
                    </div>
                  </nuxt-link>
                </li>
                <li v-if="olderPost" class="column has-text-right">
                  <nuxt-link
                    class="is-block"
                    :to="$resolvePostUrl(olderPost)"
                    aria-label="古い記事"
                  >
                    <div class="vertical-center">
                      <span>{{ olderPost.title }}</span>
                      <span class="icon">
                        <chevron-right-icon />
                      </span>
                    </div>
                  </nuxt-link>
                </li>
              </ul>
            </nav>
          </footer>
        </article>
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { ChevronLeftIcon, ChevronRightIcon } from 'vue-feather-icons'
import { PostOrPage, PostObject } from '@tryghost/content-api'
import mediumZoom from 'medium-zoom'
import Prism from 'prismjs'
import AppHeader from '~/components/AppHeader.vue'
import AuthorInfo from '~/components/AuthorInfo.vue'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/components/prism-bash'

@Component({
  layout: 'no-header',
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
    AppHeader,
    AuthorInfo
  },
  asyncData({
    $resolvePostUrl,
    getPayload,
    app: { $axios },
    route: { params },
    error
  }) {
    const { yyyy, mm, dd, slug } = params
    return getPayload(async () => {
      const posts: PostObject = await $axios.$get(`/posts`)
      const index = posts.posts.findIndex((post) => {
        return $resolvePostUrl(post) === `/${yyyy}/${mm}/${dd}/${slug}/`
      })
      const newerPost = posts.posts[index - 1]
      const post = posts.posts[index]
      const olderPost = posts.posts[index + 1]
      if (!post) return error({ statusCode: 404 })
      return {
        post,
        newerPost,
        olderPost
      }
    })
  }
})
export default class extends Vue {
  post!: PostOrPage
  newerPost!: PostOrPage
  olderPost!: PostOrPage
  $refs!: {
    content: HTMLDivElement
  }

  $el!: HTMLDivElement

  async mounted() {
    await this.$nextTick()
    mediumZoom('.content img')
    const preEls = this.$el.querySelectorAll('pre')
    Array.from(preEls).forEach((preEl) => {
      preEl.classList.add('line-numbers')
    })
    Prism.highlightAll()

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
<style lang="scss">
@import '~prismjs/themes/prism-tomorrow';
@import '~prismjs/plugins/line-numbers/prism-line-numbers';
</style>
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
  max-width: 100%;
  max-height: 50vh;
}
/deep/ .instagram-media {
  margin: auto !important;
}
.content /deep/ figure.kg-card {
  margin-left: 0;
  margin-right: 0;
}
.vertical-center {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
</style>
