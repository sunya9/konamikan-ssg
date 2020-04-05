import { mount } from '@vue/test-utils'
import { post, postWithFeatureImage } from '@/__tests__/fixtures/postOrPage'
import Archives from '@/pages/archives.vue'

describe('archives page', () => {
  it('normal', () => {
    expect(
      mount(Archives, {
        mocks: {
          posts: [post, postWithFeatureImage]
        }
      })
    ).toMatchSnapshot()
  })
})
