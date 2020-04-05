import { mount } from '@vue/test-utils'
import { post, postWithFeatureImage } from '@/__tests__/fixtures/postOrPage'
import Tag from '@/pages/tag/_tag.vue'
import { tag } from '~/__tests__/fixtures/tag'

describe('tag page', () => {
  it('normal', () => {
    expect(
      mount(Tag, {
        mocks: {
          posts: [post, postWithFeatureImage],
          tag
        }
      })
    ).toMatchSnapshot()
  })
})
