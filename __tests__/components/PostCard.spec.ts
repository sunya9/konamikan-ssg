import { mount } from '@vue/test-utils'
import { post, postWithFeatureImage } from '@/__tests__/fixtures/postOrPage'
import PostCard from '@/components/PostCard.vue'

describe('PostCard', () => {
  it('normal', () => {
    expect(
      mount(PostCard, {
        propsData: {
          post
        }
      })
    ).toMatchSnapshot()
  })
  it('with feature image', () => {
    expect(
      mount(PostCard, {
        propsData: {
          post: postWithFeatureImage
        }
      })
    ).toMatchSnapshot()
  })
})
