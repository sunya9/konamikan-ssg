import { mount } from '@vue/test-utils'
import { post } from '@/__tests__/fixtures/postOrPage'
import Article from '@/pages/_yyyy/_mm/_dd/_slug.vue'

describe('article page', () => {
  it('normal', () => {
    expect(
      mount(Article, {
        mocks: {
          post
        }
      })
    ).toMatchSnapshot()
  })
})
