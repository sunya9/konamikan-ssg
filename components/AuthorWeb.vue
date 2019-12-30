<template>
  <div class="level is-mobile">
    <div class="level-left">
      <div v-if="author.website" class="level-item">
        <a :href="author.website" :class="color">
          <span class="icon" :class="size">
            <globe-icon />
          </span>
        </a>
      </div>
      <div v-if="author.facebook" class="level-item">
        <a :href="`https://facebook.com/${author.facebook}`" :class="color">
          <span class="icon" :class="size">
            <facebook-icon />
          </span>
        </a>
      </div>
      <div v-if="author.twitter" class="level-item">
        <a :href="`https://twitter.com/${author.twitter}`" :class="color">
          <span class="icon" :class="size">
            <twitter-icon />
          </span>
        </a>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { Author } from '@tryghost/content-api'
import { GlobeIcon, TwitterIcon, FacebookIcon } from 'vue-feather-icons'

@Component({
  components: { GlobeIcon, TwitterIcon, FacebookIcon }
})
export default class AuthorWeb extends Vue {
  @Prop({ type: Object, required: true })
  author!: Author

  @Prop({ type: String, required: false, default: '' })
  color!: string

  @Prop({ type: String, required: false, default: 'is-small' })
  size!: string
}
</script>
