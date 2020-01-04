<template>
  <nav class="navbar is-transparent">
    <div class="container">
      <div class="navbar-brand">
        <div v-if="homeButton" class="navbar-brand">
          <nuxt-link class="navbar-item has-text-white-bis" to="/" exact>
            {{ $setting.title }}
          </nuxt-link>
        </div>
        <a
          href="#"
          class="navbar-burger has-text-white"
          aria-label="Menu"
          :aria-expanded="collapse"
          :class="{ 'is-active': collapse }"
          @click.prevent="toggle"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div
        class="navbar-menu"
        :class="{ 'is-relative': !collapse, 'is-active fix-navbar': collapse }"
      >
        <div class="navbar-end">
          <div class="navbar-item" :class="{ 'is-active': activated && text }">
            <div class="control has-icons-right">
              <label class="is-sr-only" for="search-form-input">Search</label>
              <input
                id="search-form-input"
                v-model="text"
                type="search"
                placeholder="Search..."
                class="input is-small search"
                @focus="activate"
                @blur="deactivate"
                @input="searchDebounce($event.target.value)"
                @keydown.down.prevent="down"
                @keydown.up.prevent="up"
                @keydown.esc.prevent="$event.target.blur()"
                @keydown.enter.prevent="go"
              />
              <span class="icon is-small is-right">
                <search-icon />
              </span>
            </div>
            <div
              v-if="text && activated"
              class="navbar-dropdown is-right is-boxed"
            >
              <template v-if="searchResults.length">
                <nuxt-link
                  v-for="(result, index) in searchResults"
                  :key="index"
                  :to="createSearchLink(result)"
                  class="navbar-item"
                  active-class=""
                  exact-active-class=""
                  :class="{
                    'has-background-dark has-text-white':
                      index === selectedIndex
                  }"
                >
                  <span class="icon is-small">
                    <user-icon v-if="result.type === 'author'" />
                    <tag-icon v-else-if="result.type === 'tag'" />
                    <file-icon v-else />
                  </span>
                  <span>&nbsp;{{ result.name }}</span>
                </nuxt-link>
              </template>
              <div v-else-if="processing" class="navbar-item">
                <progress class="progress is-small is-primary" max="100" />
              </div>
              <div v-else class="navbar-item">No hits.</div>
              <hr class="navbar-divider" />
              <div class="navbar-item has-text-centered">
                <div style="margin-left: auto">
                  <img
                    src="~/assets/images/search-by-algolia-light-background.svg"
                    alt="search by algolia"
                    width="120"
                  />
                </div>
              </div>
            </div>
          </div>
          <a href="/rss" class="navbar-item has-text-white-ter">
            <span class="icon">
              <rss-icon />
            </span>
            <span class="is-sr-only">RSS</span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import {
  SearchIcon,
  UserIcon,
  TagIcon,
  FileIcon,
  RssIcon
} from 'vue-feather-icons'
import algoliasearch from 'algoliasearch/lite'
import debounce from 'lodash/debounce'

const searchClient = algoliasearch(process.env.APP_ID!, process.env.SEARCH_KEY!)

interface SearchResult {
  type: string
  name: string
  html: string
  slug: string
  // eslint-disable-next-line camelcase
  url?: string
}

@Component({
  components: {
    SearchIcon,
    UserIcon,
    TagIcon,
    FileIcon,
    RssIcon
  }
})
export default class NavBar extends Vue {
  @Prop({ type: Boolean, required: false, default: false })
  homeButton!: boolean

  collapse = false
  text = ''
  searchClient = searchClient
  searchDebounce!: Function
  searchResults: SearchResult[] = []
  activated = false
  selectedIndex = -1
  processing = false
  toggle() {
    this.collapse = !this.collapse
  }

  mounted() {
    this.searchDebounce = debounce(this.search, 300)
  }

  async search(text: string) {
    if (!text) return
    this.processing = true
    try {
      const res = await searchClient.search([
        { indexName: 'private', query: text, params: {} }
      ])
      const [result] = res.results
      this.searchResults = result.hits.slice(0, 5).map((hit) => {
        return {
          name: hit.name,
          type: hit.type,
          html: hit._highlightResult,
          slug: hit.slug,
          url: hit.url
        }
      })
      this.selectedIndex = -1
    } finally {
      this.processing = false
    }
  }

  activate() {
    this.activated = true
  }

  deactivate() {
    this.activated = false
    this.selectedIndex = -1
  }

  initSelectedIndex() {
    if (this.selectedIndex < 0) {
      this.selectedIndex = 0
      return true
    }
    return false
  }

  down() {
    if (this.initSelectedIndex()) return
    if (this.searchResults.length - 1 === this.selectedIndex) return
    this.selectedIndex++
  }

  up() {
    if (this.initSelectedIndex()) return
    if (this.selectedIndex - 1 < 0) return
    this.selectedIndex--
  }

  createSearchLink(searchResult: SearchResult) {
    if (searchResult.type === 'post') {
      return this.$resolvePostUrl(searchResult)
    } else {
      return `/${searchResult.type}/${searchResult.slug}`
    }
  }

  go() {
    const selectedLink = this.searchResults[this.selectedIndex]
    if (!selectedLink) return
    this.$router.push(this.createSearchLink(selectedLink))
  }
}
</script>
<style scoped lang="scss">
@import '~bulma/sass/utilities/all';

.search {
  background-color: rgba(#fff, 0.5);
}
.search-results {
  position: absolute;
  height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  right: 0;
  top: 100%;
  left: 0;
}
.fix-z-index {
  z-index: 10;
}
.fix-navbar {
  position: absolute;
  left: 0;
  right: 0;
}
.navbar-menu {
  background-color: rgba(#fafafa, 0.4);
  backdrop-filter: blur(4px);
  @include desktop {
    background-color: inherit;
    backdrop-filter: blur(0);
  }
}
</style>
