<template>
  <ul>
    <li v-for="post in posts" :key="post.id">
      <div class="oneline">
        <nuxt-link :to="$resolvePostUrl(post)">
          <span v-if="post.published_at" class="has-text-grey">
            {{ $dayjs(post.published_at).format('MM/DD') }}
          </span>
          <span>{{ post.title }}</span>
        </nuxt-link>
      </div>
    </li>
  </ul>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { PostOrPage } from '@tryghost/content-api'

@Component({})
export default class PostsGroupedByYear extends Vue {
  @Prop({ type: Array, required: true })
  posts!: PostOrPage[]

  @Prop({ type: Number, required: true })
  year!: number
}
</script>
<style lang="scss" scoped>
@import '~bulma/sass/utilities/all';

.oneline {
  @include desktop {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
