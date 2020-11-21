<template>
  <div class="columns is-centered">
    <div class="column is-10">
      <div class="box">
        <div class="media">
          <div class="media-left">
            <div class="image is-64x64">
              <nuxt-link :to="`/author/${author.slug}`">
                <img
                  class="is-rounded"
                  :src="author.profile_image"
                  width="128"
                  height="128"
                  loading="lazy"
                />
              </nuxt-link>
            </div>
          </div>
          <div class="media-content">
            <div class="content is-small">
              <div class="title is-6">
                <nuxt-link :to="`/author/${author.slug}`">
                  {{ author.name }}
                </nuxt-link>
              </div>
              <div class="subtitle is-6">
                <small v-if="author.location" class="has-text-grey">
                  {{ author.location }}
                </small>
              </div>
              <p>{{ author.bio }}</p>
              <author-web :author="author" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { Author } from '@tryghost/content-api'
import AuthorWeb from '~/components/AuthorWeb.vue'

@Component({
  components: { AuthorWeb }
})
export default class AuthorInfo extends Vue {
  @Prop({ type: Object, required: true })
  author!: Author
}
</script>
