<template>
  <article class="card">
    <div class="card-image">
      <nuxt-link :to="$resolvePostUrl(post)">
        <div
          class="image-2by1"
          :class="{
            'has-background-white-bis no-image has-text-grey': !post.feature_image
          }"
        >
          <img
            v-if="post.feature_image"
            class="image-2by1-inner"
            :src="post.feature_image"
            alt=""
          />
        </div>
      </nuxt-link>
    </div>
    <div class="card-content">
      <div class="content">
        <h3 class="title is-5">
          <nuxt-link :to="$resolvePostUrl(post)">
            {{ post.title }}
          </nuxt-link>
        </h3>
        <h4 class="subtitle is-6 has-text-grey">
          <small>{{ $dayjs(post.published_at).format('YYYY/MM/DD') }}</small>
        </h4>
        <p>
          {{ excerpt }}
        </p>
      </div>
    </div>
  </article>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { PostOrPage } from '@tryghost/content-api'

export default Vue.extend({
  props: {
    post: {
      type: Object,
      required: true
    } as PropOptions<PostOrPage>
  },
  computed: {
    excerpt(): string {
      return this.post.custom_excerpt || this.post.excerpt || ''
    }
  }
})
</script>
<style scoped>
.image-2by1 {
  position: relative;
  overflow: hidden;
}

.image-2by1::before {
  content: '';
  display: block;
  padding-top: 50%;
}
.image-2by1-inner {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  height: auto;
  max-width: 100%;
}
.no-image::after {
  content: 'No image';
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
