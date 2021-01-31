import { mount } from '@vue/test-utils'
import { post } from '@/__tests__/fixtures/postOrPage'
import PostsWithYear from '@/components/PostsWithYear.vue'

describe('PostsWithYear', () => {
  it('normal', () => {
    expect(
      mount(PostsWithYear, {
        propsData: {
          posts: [post]
        }
      })
    ).toMatchSnapshot()
  })
})
