<template>
  <app-header
    :title="title"
    home-button
    :description="body"
    class="is-fullheight"
  >
    <template #footer>
      <div class="has-text-centered">
        <nuxt-link
          class="button is-text"
          to="/"
          exact-active-class=""
          active-class=""
        >
          トップページに戻る
        </nuxt-link>
      </div>
    </template>
  </app-header>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { NuxtError } from '@nuxt/types'
import AppHeader from '~/components/AppHeader.vue'

interface Message {
  title: string
  body: string
}

const errorMap: { [key: number]: Message } = {
  404: {
    title: '404 Not found',
    body: 'ページが見つかりませんでした。'
  }
} as const

@Component({
  components: { AppHeader },
  layout: 'no-footer'
})
export default class ErrorPage extends Vue {
  @Prop({ type: Object, required: true })
  error!: NuxtError

  get title(): string {
    return this.message?.title || 'Error'
  }

  get message(): Message | null {
    return this.error.statusCode ? errorMap[this.error.statusCode] : null
  }

  get body(): string {
    return this.message?.body || '何らかのエラーが発生しました'
  }
}
</script>
