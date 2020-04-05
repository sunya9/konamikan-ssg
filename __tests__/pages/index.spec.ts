import { mount } from '@vue/test-utils'
import { post, postWithFeatureImage } from '@/__tests__/fixtures/postOrPage'
import Index from '@/pages/index.vue'

describe('index page', () => {
  it('normal', () => {
    expect(
      mount(Index, {
        mocks: {
          posts: [post, postWithFeatureImage]
        }
      })
    ).toMatchSnapshot()
  })
})
