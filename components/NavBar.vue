<template>
  <nav class="navbar ">
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
          <div
            ref="searchForm"
            class="navbar-item"
            :class="{ 'is-active': activated && text }"
          >
            <div class="control has-icons-right">
              <label class="is-sr-only" for="search-form-input">Search</label>
              <input
                id="search-form-input"
                v-model="text"
                type="search"
                placeholder="Search..."
                class="input is-small search"
                autocomplete="off"
                @focus="activate"
                @input="inputQuery"
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
              style="max-width: 300px"
            >
              <template v-if="searchResults.state === 'fulfilled'">
                <template v-for="(result, index) in searchResults.data">
                  <nuxt-link
                    :key="result.refIndex"
                    :to="createSearchLink(result.item)"
                    class="navbar-item"
                    active-class=""
                    exact-active-class=""
                    :class="{
                      'has-background-dark has-text-white':
                        index === selectedIndex
                    }"
                  >
                    <div style="overflow: hidden">
                      <div class="is-flex mb-1">
                        <span class="icon is-small search-icon">
                          <user-icon v-if="result.item.type === 'author'" />
                          <tag-icon v-else-if="result.item.type === 'tag'" />
                          <file-icon v-else />
                        </span>
                        <span class="is-text-truncated">
                          &nbsp;{{ result.item.title }}
                        </span>
                      </div>

                      <matched-text :matches="result.matches" />
                    </div>
                  </nuxt-link>
                  <div
                    :key="`${result.refIndex}-divider`"
                    class="dropdown-divider"
                  />
                </template>
                <div v-if="!searchResults.data.length" class="navbar-item">
                  No hits.
                </div>
              </template>
              <div v-else class="navbar-item">
                <progress class="progress is-small is-primary" max="100" />
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
import Fuse from 'fuse.js'
import { DebouncedFunc } from 'lodash'
import MatchedText from './MatchedText'
import { FuseItem } from '~/entity/fuseItem'

const searchClient = algoliasearch(process.env.APP_ID!, process.env.SEARCH_KEY!)

interface SearchResult {
  type: 'post' | 'tag' | 'author' | 'page'
  name: string
  slug: string
  url?: string
}

type Result =
  | {
      state: 'pending'
    }
  | {
      state: 'fulfilled'
      data: Fuse.FuseResult<FuseItem>[]
    }
  | {
      state: 'reject'
      error: Error
    }

@Component({
  components: {
    SearchIcon,
    UserIcon,
    TagIcon,
    FileIcon,
    RssIcon,
    MatchedText
  }
})
export default class NavBar extends Vue {
  @Prop({ type: Boolean, required: false, default: false })
  homeButton!: boolean

  collapse = false
  text = ''
  searchClient = searchClient
  searchDebounce!: DebouncedFunc<NavBar['search']>
  searchResults: Result = {
    state: 'pending'
  }

  activated = false
  selectedIndex = -1

  $refs!: {
    searchForm: Element
  }

  toggle() {
    this.collapse = !this.collapse
  }

  deactivatedIfNeed(e: Event) {
    e.stopPropagation()
    if (!this.activated || !(e.target instanceof Element)) return
    const el = e.target
    if (this.$refs.searchForm.contains(el)) return
    this.activated = false
    this.selectedIndex = -1
  }

  mounted() {
    this.searchDebounce = debounce(this.search, 500)
    document.addEventListener('click', this.deactivatedIfNeed)
  }

  beforeDestroy() {
    document.removeEventListener('click', this.deactivatedIfNeed)
  }

  async search(text: string) {
    await this.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 500))
    try {
      const result = await this.$axios.$get<Fuse.FuseResult<FuseItem>[]>(
        '/search',
        {
          params: {
            q: text
          }
        }
      )
      this.searchResults = {
        state: 'fulfilled',
        data: result
      }
      this.selectedIndex = -1
    } catch (e) {
      this.searchResults = {
        state: 'reject',
        error: e
      }
    }
  }

  inputQuery(e: Event) {
    if (!(e.target instanceof HTMLInputElement)) return
    const text = e.target.value
    this.searchResults = {
      state: 'pending'
    }
    if (!text) return
    this.searchDebounce(text)
  }

  activate() {
    this.activated = true
  }

  initSelectedIndex() {
    if (this.selectedIndex < 0) {
      this.selectedIndex = 0
      return true
    }
    return false
  }

  down() {
    if (this.initSelectedIndex() || this.searchResults.state !== 'fulfilled')
      return
    if (this.searchResults.data.length - 1 === this.selectedIndex) return
    this.selectedIndex++
  }

  up() {
    if (this.initSelectedIndex()) return
    if (this.selectedIndex - 1 < 0) return
    this.selectedIndex--
  }

  createSearchLink(searchResult: FuseItem) {
    return this.$resolvePostUrl(searchResult)
  }

  go() {
    if (this.searchResults.state !== 'fulfilled') return
    const selectedLink = this.searchResults.data[this.selectedIndex]
    if (!selectedLink) return
    this.$router.push(this.createSearchLink(selectedLink.item))
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
.search-icon {
  width: auto;
  height: auto;
  line-height: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
