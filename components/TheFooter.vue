<template>
  <footer class="footer">
    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="level">
            <div class="level-left">
              <div v-if="twitter" class="level-item">
                <a
                  :href="`https://twitter.com/${twitter}`"
                  :aria-label="`Twitter account: @${twitter}`"
                >
                  <span class="icon">
                    <twitter-icon />
                  </span>
                </a>
              </div>
              <div v-if="facebook" class="level-item">
                <a
                  :href="`https://facebook.com/${facebook}`"
                  :aria-label="`Facebook account: @${facebook}`"
                >
                  <span class="icon">
                    <facebook-icon />
                  </span>
                </a>
              </div>
            </div>
            <div class="level-right">
              <div
                v-for="navigation in navigations"
                :key="navigation.url"
                class="level-item"
              >
                <a :href="navigation.url">
                  {{ navigation.label }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-foot">
        <div class="content has-text-centered">
          <p>© {{ $setting.title }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { TwitterIcon, FacebookIcon } from 'vue-feather-icons'

@Component({
  components: {
    TwitterIcon,
    FacebookIcon
  }
})
export default class TheFooter extends Vue {
  navigations = this.$setting.navigation || []
  twitter = this.$setting.twitter || null
  facebook = this.$setting.facebook || null
  get url() {
    return this.$setting.url
  }
}
</script>
