<template>
  <div>
    <div v-for="year in years" :key="year" class="content">
      <h2 :id="`#${year}`">
        <span>{{ year }}</span>
        <small class="has-text-grey is-size-6">
          {{ groupedByYear[year].length }} posts
        </small>
      </h2>
      <posts :posts="groupedByYear[year]" />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { PostOrPage } from '@tryghost/content-api'
import Posts from '~/components/Posts.vue'

@Component({
  components: {
    Posts
  }
})
export default class PostsWithYear extends Vue {
  @Prop({ type: Array, required: true })
  posts!: PostOrPage[]

  get groupedByYear() {
    return this.posts.reduce<{ [key: number]: PostOrPage[] }>((map, post) => {
      if (!post.published_at) return map
      const date = new Date(post.published_at)
      const year = date.getFullYear()
      return {
        ...map,
        [year]: [...(map[year] || []), post]
      }
    }, {})
  }

  get years(): number[] {
    return Object.keys(this.groupedByYear)
      .map((key) => +key)
      .slice()
      .sort((a, b) => b - a)
  }
}
</script>
