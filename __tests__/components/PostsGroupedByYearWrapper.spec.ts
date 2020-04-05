import { mount } from '@vue/test-utils'
import { post } from '@/__tests__/fixtures/postOrPage'
import PostsGroupedByYearWrapper from '@/components/PostsGroupedByYearWrapper.vue'

describe('PostsGroupedByYearWrapper', () => {
  it('normal', () => {
    expect(
      mount(PostsGroupedByYearWrapper, {
        propsData: {
          posts: [post]
        }
      })
    ).toMatchSnapshot()
  })
})
