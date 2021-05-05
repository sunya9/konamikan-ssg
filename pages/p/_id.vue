<template>
  <div>
    <app-header
      home-button
      :title="post.title"
      :description="post.custom_excerpt"
      :cover="$replaceHostWithOriginal(post.feature_image)"
    >
      <template v-slot:extra>
        <div class="container">
          <div class="level">
            <div
              v-if="post.published_at || post.created_at"
              class="level-item has-text-centered content"
            >
              <span class="tag is-rounded is-medium">
                {{
                  $dayjs(post.published_at || post.created_at).format(
                    'YYYY/MM/DD hh:mm:ss'
                  )
                }}
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
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <div v-if="post.tags && post.tags.length" class="tags">
                    <nuxt-link
                      v-for="tag in post.tags"
                      :key="tag.id"
                      :to="`/tag/${tag.slug}`"
                      class="tag is-primary is-light"
                    >
                      {{ tag.name }}
                    </nuxt-link>
                  </div>
                </div>
              </div>
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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Share2Icon
} from 'vue-feather-icons'
import { PostOrPage } from '@tryghost/content-api'
import mediumZoom from 'medium-zoom'
import Prism from 'prismjs'
import AppHeader from '~/components/AppHeader.vue'
import AuthorInfo from '~/components/AuthorInfo.vue'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'

@Component({
  layout: 'no-header',
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
    AppHeader,
    AuthorInfo,
    Share2Icon
  },
  async asyncData({
    route: {
      params: { id }
    },
    error,
    preview
  }) {
    const notFound = () => error({ statusCode: 404 })
    if (process.client) return notFound()
    const post = await preview(id)
    if (!post) {
      return notFound()
    }
    return {
      post
    }
  }
})
export default class extends Vue {
  post!: PostOrPage
  $refs!: {
    content: HTMLDivElement
  }

  $el!: HTMLDivElement

  get postAbsUrl() {
    return this.post.url
  }

  get supportWebShare() {
    if (!process.client) {
      return false
    }
    return !!navigator.share
  }

  async shareOnNativeApp() {
    if (!this.supportWebShare) return
    await navigator
      .share({
        url: this.postAbsUrl,
        title: this.post.title!,
        text: this.post.title!
      })
      .catch(() => {})
  }

  openAsNewWindow(e: Event) {
    e.preventDefault()
    if (!e.target) {
      return
    }
    const a = e.target as HTMLAnchorElement
    const url = a.href
    window.open(
      url,
      a.target,
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600'
    )
  }

  async mounted() {
    await this.$nextTick()
    Array.from(this.$el.querySelectorAll('img'))
      .filter((el) =>
        el.parentElement?.classList.contains('kg-bookmark-thumbnail')
      )
      .forEach((el) => el.classList.add('medium-zoom-exclude'))
    mediumZoom('.content img:not(.medium-zoom-exclude)')
    if (!this.$el) return
    const preEls = this.$el.querySelectorAll('pre')
    Array.from(preEls).forEach((preEl) => {
      preEl.classList.add('line-numbers')
    })
    Prism.highlightAll()

    const scripts = this.$refs.content.querySelectorAll('script')
    if (!scripts) {
      return
    }
    Array.from(scripts).forEach((script) => {
      if (!script.parentNode) {
        return
      }
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
    const link: object[] = []
    return {
      title: this.post.meta_title || this.post.title,
      meta: [...baseMeta, ...extendedMeta],
      link
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
.content {
  /deep/ .kg-image {
    max-height: 50vh;
  }
  /deep/ .twitter-tweet {
    margin-left: auto;
    margin-right: auto;
  }
  /deep/ .kg-bookmark-card {
    font-size: $size-small;
    margin-left: auto;
    margin-right: auto;
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
      margin-bottom: 1rem;
    }
    @include desktop {
      max-height: 128px;
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
  /deep/ iframe {
    min-width: auto !important;
  }
  /deep/ figure {
    margin-left: auto;
    margin-right: auto;
  }
}

.vertical-center {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
.share-button {
  background: transparent;
  border: 0;
  cursor: pointer;
  color: inherit;
  outline: 0;
  padding: 0;
}
/deep/ pre[class*='language-'] {
  margin-left: calc((100% - 100vw) / 2);
  margin-right: calc((100% - 100vw) / 2);
  padding-left: calc((100vw - 100%) / 2 + 3.8em);
  padding-right: calc((100vw - 100%) / 2);
}
</style>
